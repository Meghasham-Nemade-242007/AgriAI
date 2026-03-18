from torchvision import transforms
from PIL import Image
import io
import numpy as np

def get_transform():
    return transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])

def preprocess_image(image_bytes):
    try:
        transform = get_transform()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')

        width, height = image.size
        if width < 100 or height < 100:
            return None, "Image too small"

        tensor = transform(image).unsqueeze(0)
        return tensor, None

    except Exception as e:
        return None, str(e)


def get_image_info(image_bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        width, height = image.size
        img_array = np.array(image)
        avg_r = float(np.mean(img_array[:, :, 0]))
        avg_g = float(np.mean(img_array[:, :, 1]))
        avg_b = float(np.mean(img_array[:, :, 2]))
        return {
            "width": width,
            "height": height,
            "avg_r": avg_r,
            "avg_g": avg_g,
            "avg_b": avg_b
        }
    except Exception:
        return None