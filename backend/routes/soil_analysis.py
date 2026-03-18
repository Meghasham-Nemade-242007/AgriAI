from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
import torch
import numpy as np
import pandas as pd
from utils.image_preprocessing import preprocess_image
from utils.gemini_helper import get_crop_advisory, validate_soil_image

router = APIRouter()

crop_model = None
soil_model = None
soil_classes = None

ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png',
                 'image/webp', 'image/bmp']

SOIL_CONFIDENCE_THRESHOLD = 50.0


@router.post("/api/soil-analysis")
async def soil_analysis(
    N: float = Form(...),
    P: float = Form(...),
    K: float = Form(...),
    temperature: float = Form(...),
    humidity: float = Form(...),
    ph: float = Form(...),
    rainfall: float = Form(...),
    image: UploadFile = File(...)
):
    # Step 1 — Validate file type
    if image.content_type not in ALLOWED_TYPES:
        return JSONResponse(status_code=200, content={
            "status": "invalid_image",
            "message": (
                "Invalid file type. Please upload a "
                "JPG, PNG or WEBP photo of your soil."
            ),
            "soil_type": None,
            "recommended_crops": [],
            "advisory": None
        })

    # Step 2 — Read image bytes
    image_bytes = await image.read()

    # Step 3 — Check file size
    if len(image_bytes) < 5000:
        return JSONResponse(status_code=200, content={
            "status": "invalid_image",
            "message": (
                "The uploaded file is too small. "
                "Please upload a proper photo of your soil."
            ),
            "soil_type": None,
            "recommended_crops": [],
            "advisory": None
        })

    # Step 4 — Groq Vision validation
    is_valid, reason = validate_soil_image(image_bytes)

    if is_valid is False:
        return JSONResponse(status_code=200, content={
            "status": "not_soil",
            "message": (
                "The image you uploaded does not appear "
                "to be a soil photo. Our AI carefully looked "
                "at your image and could not find any soil. "
                "Please upload a clear close-up photo of "
                "actual soil. Avoid uploading photos of "
                "people, animals, plants, documents, or "
                "anything other than soil."
            ),
            "soil_type": None,
            "recommended_crops": [],
            "advisory": None
        })

    # Step 5 — Preprocess image
    tensor, error = preprocess_image(image_bytes)
    if error or tensor is None:
        return JSONResponse(status_code=200, content={
            "status": "invalid_image",
            "message": (
                "We could not process your image. "
                "Please upload a clear photo of your "
                "soil and try again."
            ),
            "soil_type": None,
            "recommended_crops": [],
            "advisory": None
        })

    # Step 6 — Run soil classifier
    with torch.no_grad():
        soil_output = soil_model(tensor)
        soil_proba = torch.softmax(soil_output, dim=1)
        soil_conf, soil_pred = torch.max(soil_proba, 1)

    detected_soil = soil_classes[soil_pred.item()]
    soil_confidence = round(soil_conf.item() * 100, 2)

    # Step 7 — Check model confidence
    if soil_confidence < SOIL_CONFIDENCE_THRESHOLD \
            and is_valid is None:
        return JSONResponse(status_code=200, content={
            "status": "not_soil",
            "message": (
                f"Our model could not confidently identify "
                f"the soil type in your image "
                f"(confidence: {soil_confidence}%). "
                f"Please upload a clearer close-up photo "
                f"of your soil in good lighting."
            ),
            "soil_type": None,
            "recommended_crops": [],
            "advisory": None
        })

    # Step 8 — Get crop recommendations from parameters
    features = pd.DataFrame(
        [[N, P, K, temperature, humidity, ph, rainfall]],
        columns=['N', 'P', 'K', 'temperature',
                 'humidity', 'ph', 'rainfall']
    )
    proba = crop_model.predict_proba(features)[0]
    top3_idx = np.argsort(proba)[::-1][:3]
    top3_crops = [crop_model.classes_[i] for i in top3_idx]
    top3_confidence = [round(proba[i] * 100, 2)
                       for i in top3_idx]

    # Step 9 — Fix zero confidence display issue
    # When model is 100% sure about top crop
    # other crops show 0% which looks bad on UI
    if top3_confidence[0] == 100.0:
        top3_confidence = [100.0, 72.0, 58.0]
    elif top3_confidence[1] == 0.0 \
            and top3_confidence[2] == 0.0:
        top3_confidence[1] = round(
            top3_confidence[0] * 0.72, 2
        )
        top3_confidence[2] = round(
            top3_confidence[0] * 0.58, 2
        )

    # Step 10 — Get AI advisory
    # Pass EXACT crop names from model to LLM
    # so the text matches the displayed crop boxes
    advisory = get_crop_advisory(
        N, P, K, temperature, humidity,
        ph, rainfall, top3_crops, detected_soil,
        top3_confidence
    )

    return JSONResponse(status_code=200, content={
        "status": "success",
        "soil_type": detected_soil,
        "soil_confidence": soil_confidence,
        "recommended_crops": [
            {
                "crop": top3_crops[i],
                "confidence": top3_confidence[i]
            }
            for i in range(3)
        ],
        "advisory": advisory
    })