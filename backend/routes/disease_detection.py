from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
import torch
from utils.image_preprocessing import preprocess_image
from utils.gemini_helper import (
    get_disease_advisory,
    validate_leaf_image
)

router = APIRouter()

disease_model = None
class_names = None

ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png',
                 'image/webp', 'image/bmp']

DISEASE_CONFIDENCE_THRESHOLD = 50.0


@router.post("/api/disease-detection")
async def disease_detection(image: UploadFile = File(...)):

    # Step 1 — Validate file type
    if image.content_type not in ALLOWED_TYPES:
        return JSONResponse(status_code=200, content={
            "status": "invalid_image",
            "message": (
                "Invalid file type. Please upload a "
                "JPG, PNG or WEBP photo of a plant leaf."
            ),
            "disease": None,
            "confidence": None,
            "treatment": None
        })

    # Step 2 — Read image bytes
    image_bytes = await image.read()

    # Step 3 — Check file size
    if len(image_bytes) < 5000:
        return JSONResponse(status_code=200, content={
            "status": "invalid_image",
            "message": (
                "The uploaded file is too small. "
                "Please upload a proper photo of a plant leaf."
            ),
            "disease": None,
            "confidence": None,
            "treatment": None
        })

    # Step 4 — Groq Vision validation
    is_valid, reason = validate_leaf_image(image_bytes)

    if is_valid is False:
        return JSONResponse(status_code=200, content={
            "status": "not_leaf",
            "message": (
                "The image you uploaded does not appear "
                "to be a plant leaf. Our AI carefully looked "
                "at your image and could not find any plant "
                "leaf. Please upload a clear close-up photo "
                "of a plant leaf showing the diseased or "
                "affected area. Avoid uploading photos of "
                "people, animals, soil, documents, or "
                "anything other than plant leaves."
            ),
            "disease": None,
            "confidence": None,
            "treatment": None
        })

    # Step 5 — Preprocess image
    tensor, error = preprocess_image(image_bytes)
    if error or tensor is None:
        return JSONResponse(status_code=200, content={
            "status": "invalid_image",
            "message": (
                "We could not process your image. "
                "Please upload a clear photo of a "
                "plant leaf and try again."
            ),
            "disease": None,
            "confidence": None,
            "treatment": None
        })

    # Step 6 — Run disease model
    with torch.no_grad():
        outputs = disease_model(tensor)
        proba = torch.softmax(outputs, dim=1)
        confidence, predicted = torch.max(proba, 1)

    disease_name = class_names[predicted.item()]
    confidence_pct = round(confidence.item() * 100, 2)

    # Step 7 — Check model confidence
    if confidence_pct < DISEASE_CONFIDENCE_THRESHOLD \
            and is_valid is None:
        return JSONResponse(status_code=200, content={
            "status": "not_leaf",
            "message": (
                f"Our model could not confidently identify "
                f"the plant disease in your image "
                f"(confidence: {confidence_pct}%). "
                f"Please upload a clearer close-up photo "
                f"of your plant leaf showing the affected "
                f"area in good lighting."
            ),
            "disease": None,
            "confidence": confidence_pct,
            "treatment": None
        })

    # Step 8 — Get treatment advisory
    treatment = get_disease_advisory(disease_name, confidence_pct)

    return JSONResponse(status_code=200, content={
        "status": "success",
        "disease": disease_name,
        "confidence": confidence_pct,
        "treatment": treatment
    })