import os
import sys

# This fixes the import issue on Windows
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
from config import CROP_CSV_PATH, CROP_MODEL_PATH

print("Loading dataset...")
df = pd.read_csv(CROP_CSV_PATH)
print(f"Dataset shape: {df.shape}")
print(f"Crops: {list(df['label'].unique())}")

X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("Training Random Forest...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Accuracy: {accuracy * 100:.2f}%")

# Make sure models folder exists
os.makedirs(os.path.dirname(CROP_MODEL_PATH), exist_ok=True)

joblib.dump(model, CROP_MODEL_PATH)
print(f"Model saved to {CROP_MODEL_PATH}")
print("DONE!")