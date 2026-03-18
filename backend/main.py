from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.model_loader import load_crop_model, load_disease_model, load_soil_model
import routes.soil_analysis as soil_route
import routes.disease_detection as disease_route

# Create FastAPI app
app = FastAPI(
    title="AgriAI API",
    description="AI-powered soil analysis and plant disease detection",
    version="1.0.0"
)

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load all models when server starts
@app.on_event("startup")
async def load_models():
    print("Starting AgriAI server...")
    print("Loading all models...")

    # Load models
    soil_route.crop_model = load_crop_model()
    soil_route.soil_model, soil_route.soil_classes = load_soil_model()
    disease_route.disease_model, disease_route.class_names = load_disease_model()

    print("All models loaded successfully!")
    print("Server is ready!")

# Register routes
app.include_router(soil_route.router)
app.include_router(disease_route.router)

# Health check endpoint
@app.get("/")
def root():
    return {"message": "AgriAI API is running!"}