---
title: AgriAI API
emoji: 🌿
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
app_file: Dockerfile
pinned: false
---
# 🌱 AgriAI Platform

AI-powered agricultural assistant for soil analysis
and plant disease detection.

## Features
- **Soil Analysis** — Upload soil photo + parameters
  to get crop recommendations
- **Disease Detection** — Upload plant leaf photo
  to detect diseases and get treatment advice

## Tech Stack
- Frontend: React + Vite
- Backend: FastAPI (Python)
- ML Models: EfficientNet-B3, ResNet-50, Random Forest
- LLM: Groq (Llama 3.3)

## Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Add your GROQ_API_KEY to .env
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend/agri-ui
npm install
cp .env.example .env
npm run dev
```

## Models
Download trained models and place in `backend/models/`:
- crop_model.pkl
- disease_model.pth
- soil_model.pth
- class_names.json
- soil_class_names.json

## Datasets
- Crop Recommendation: Kaggle
- PlantVillage: GitHub (spMohanty)
- Soil Types: Kaggle (ai4a-lab)