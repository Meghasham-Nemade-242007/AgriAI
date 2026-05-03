<div align="center">
  <h1>🌱 AgriAI Platform</h1>
  <p><strong>AI-powered agricultural assistant for soil analysis and plant disease detection.</strong></p>
</div>

## 🌟 Overview

AgriAI is a comprehensive full-stack agricultural platform designed to empower farmers and agricultural enthusiasts. By leveraging advanced Machine Learning models and Large Language Models (LLM), AgriAI provides precise soil analysis, accurate crop recommendations, and reliable plant disease detection with actionable treatment advice.

## ✨ Features

- 🌍 **Soil Analysis**: Upload a soil photo along with parameters to receive AI-driven crop recommendations.
- 🍃 **Disease Detection**: Upload a plant leaf photo to instantly identify diseases and get tailored treatment advice.
- 🔐 **Secure Authentication**: Robust user authentication system powered by Node.js and MongoDB.
- 🤖 **LLM Integration**: Integrated with Groq (Llama 3.3) for intelligent, conversational agricultural insights.

## 🛠️ Tech Stack

### Frontend
- **React.js** with **Vite** for blazing fast performance
- Modern UI components

### Backend Services
- **FastAPI (Python)**: Handles ML model inference and LLM integrations.
- **Node.js & Express**: Dedicated authentication backend.
- **MongoDB**: Database for user management.

### Machine Learning & AI
- **Models**: EfficientNet-B3, ResNet-50, Random Forest
- **LLM**: Groq (Llama 3.3)

---

## 🚀 Project Structure

The project is divided into distinct microservices:
- `frontend/` - The React application (UI)
- `backend/` - FastAPI application for ML inference and logic
- `auth-backend/` - Node.js/Express server for user authentication
- `notebooks/` - Jupyter notebooks for ML model training and exploration

---

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Python](https://www.python.org/) (v3.8 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URL)

### 1. Authentication Backend (Node.js)

```bash
cd auth-backend
npm install
```
Create a `.env` file in the `auth-backend` directory with your environment variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
Start the auth server:
```bash
npm start
# or for development: npm run dev
```

### 2. Main Backend (FastAPI)

```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
# source venv/bin/activate

pip install -r requirements.txt
```
Create a `.env` file in the `backend` directory based on `.env.example`:
```env
GROQ_API_KEY=your_groq_api_key
```
Start the FastAPI server:
```bash
uvicorn main:app --reload
```

### 3. Frontend (React)

```bash
cd frontend/agri-ui
npm install
```
Create a `.env` file in the `frontend/agri-ui` directory based on `.env.example`:
```env
VITE_API_URL=http://localhost:8000
VITE_AUTH_API_URL=http://localhost:5000/api/auth
```
Start the development server:
```bash
npm run dev
```

---

## 🧠 Models & Datasets

### Models
To run the project locally, download the trained models and place them in the `backend/models/` directory:
To train the models use the .ipynb files from the /notebooks folder and use the appropriate datasets.
- `crop_model.pkl`
- `disease_model.pth`
- `soil_model.pth`
- `class_names.json`
- `soil_class_names.json`

### Datasets Used
- **Crop Recommendation**: [Kaggle](https://www.kaggle.com/)
- **PlantVillage (Disease Detection)**: [GitHub (spMohanty)](https://github.com/spMohanty/PlantVillage-Dataset)
- **Soil Types**: [Kaggle (ai4a-lab)](https://www.kaggle.com/)

---

<div align="center">
  <p>Built with ❤️ for sustainable agriculture.</p>
</div>
