import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ─────────────────────────────────────
# API Keys
# ─────────────────────────────────────
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

# ─────────────────────────────────────
# Model File Paths
# ─────────────────────────────────────
CROP_MODEL_PATH = os.getenv(
    "CROP_MODEL_PATH",
    "models/crop_model.pkl"
)
DISEASE_MODEL_PATH = os.getenv(
    "DISEASE_MODEL_PATH",
    "models/disease_model.pth"
)
SOIL_MODEL_PATH = os.getenv(
    "SOIL_MODEL_PATH",
    "models/soil_model.pth"
)
CLASS_NAMES_PATH = os.getenv(
    "CLASS_NAMES_PATH",
    "models/class_names.json"
)
SOIL_CLASS_NAMES_PATH = os.getenv(
    "SOIL_CLASS_NAMES_PATH",
    "models/soil_class_names.json"
)

# ─────────────────────────────────────
# Dataset Paths
# ─────────────────────────────────────
CROP_CSV_PATH = os.getenv(
    "CROP_CSV_PATH",
    "datasets/Crop_recommendation.csv"
)
PLANTVILLAGE_PATH = os.getenv(
    "PLANTVILLAGE_PATH",
    "datasets/plantvillage"
)
SOIL_DATASET_PATH = os.getenv(
    "SOIL_DATASET_PATH",
    "datasets/soil_types"
)

# ─────────────────────────────────────
# Server Settings
# ─────────────────────────────────────
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
ENV  = os.getenv("ENV", "development")

# ─────────────────────────────────────
# Image & Model Settings
# ─────────────────────────────────────
IMAGE_SIZE  = 224
BATCH_SIZE  = 32
EPOCHS      = 5

# ─────────────────────────────────────
# Validation Thresholds
# ─────────────────────────────────────
SOIL_CONFIDENCE_THRESHOLD    = 50.0
DISEASE_CONFIDENCE_THRESHOLD = 50.0
MIN_IMAGE_SIZE_BYTES         = 5000

# ─────────────────────────────────────
# Allowed Image Types
# ─────────────────────────────────────
ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/bmp'
]

# ─────────────────────────────────────
# Groq Model Names
# ─────────────────────────────────────
GROQ_TEXT_MODEL  = "llama-3.3-70b-versatile"
GROQ_VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"

# ─────────────────────────────────────
# Startup Validation
# ─────────────────────────────────────
if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY is not set in .env file!")
    print("Please add your Groq API key to backend/.env")