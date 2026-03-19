# 1. Use Python
FROM python:3.12-slim

# 2. Go into the backend folder
WORKDIR /app/backend

# 3. Install extra system tools for OpenCV
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0

# 4. Install your requirements.txt
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy your actual backend code
COPY backend/ .

# 6. Start the uvicorn server on port 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
