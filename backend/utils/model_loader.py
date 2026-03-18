import torch
import torchvision.models as models
import torch.nn as nn
import joblib
import json
from config import (
    CROP_MODEL_PATH, DISEASE_MODEL_PATH,
    CLASS_NAMES_PATH, SOIL_MODEL_PATH, SOIL_CLASS_NAMES_PATH
)

def load_crop_model():
    print("Loading crop recommendation model...")
    model = joblib.load(CROP_MODEL_PATH)
    print("Crop model loaded!")
    return model

def load_disease_model():
    print("Loading disease detection model...")
    with open(CLASS_NAMES_PATH) as f:
        class_names = json.load(f)

    model = models.efficientnet_b3(pretrained=False)
    model.classifier[1] = nn.Linear(
        model.classifier[1].in_features,
        len(class_names)
    )
    model.load_state_dict(
        torch.load(DISEASE_MODEL_PATH, map_location='cpu')
    )
    model.eval()
    print(f"Disease model loaded! ({len(class_names)} classes)")
    return model, class_names

def load_soil_model():
    print("Loading soil classification model...")
    with open(SOIL_CLASS_NAMES_PATH) as f:
        soil_classes = json.load(f)

    model = models.resnet50(pretrained=False)
    model.fc = nn.Linear(model.fc.in_features, len(soil_classes))
    model.load_state_dict(
        torch.load(SOIL_MODEL_PATH, map_location='cpu')
    )
    model.eval()
    print(f"Soil model loaded! ({len(soil_classes)} classes)")
    return model, soil_classes