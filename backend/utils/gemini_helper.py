import base64
from groq import Groq
from config import GROQ_API_KEY, GROQ_TEXT_MODEL, GROQ_VISION_MODEL

client = Groq(api_key=GROQ_API_KEY)


def validate_soil_image(image_bytes):
    """
    Uses Groq Vision to actually look at the image
    and verify it is a soil photo
    """
    try:
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')

        response = client.chat.completions.create(
          model=GROQ_VISION_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        },
                        {
                            "type": "text",
                            "text": (
                                "Look at this image carefully. "
                                "Does this image show soil, mud, dirt, "
                                "ground, earth, or any type of soil surface? "
                                "Reply with ONLY one word: "
                                "YES if it shows soil, "
                                "NO if it shows anything else."
                            )
                        }
                    ]
                }
            ],
            max_tokens=5
        )
        result = response.choices[0].message.content.strip().upper()
        print(f"Soil validation result: {result}")
        if "YES" in result:
            return True, "Valid soil image"
        else:
            return False, "Not a soil image"

    except Exception as e:
        print(f"Soil validation error: {e}")
        return None, "Validation skipped"


def validate_leaf_image(image_bytes):
    """
    Uses Groq Vision to actually look at the image
    and verify it is a plant leaf photo
    """
    try:
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')

        response = client.chat.completions.create(
            model=GROQ_VISION_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        },
                        {
                            "type": "text",
                            "text": (
                                "Look at this image carefully. "
                                "Does this image show a plant leaf, "
                                "crop leaf, tree leaf, or any plant "
                                "foliage with or without disease? "
                                "Reply with ONLY one word: "
                                "YES if it shows a plant leaf, "
                                "NO if it shows anything else."
                            )
                        }
                    ]
                }
            ],
            max_tokens=5
        )
        result = response.choices[0].message.content.strip().upper()
        print(f"Leaf validation result: {result}")
        if "YES" in result:
            return True, "Valid leaf image"
        else:
            return False, "Not a plant leaf"

    except Exception as e:
        print(f"Leaf validation error: {e}")
        return None, "Validation skipped"


def get_crop_advisory(N, P, K, temperature,
                      humidity, ph, rainfall,
                      top_crops, soil_type=None,
                      top_confidence=None):

    # Build crop list with confidence for the prompt
    # This ensures LLM talks about EXACTLY these crops
    if top_confidence:
        crop_list = "\n".join([
            f"  {i+1}. {top_crops[i].capitalize()} "
            f"({top_confidence[i]}% match)"
            for i in range(len(top_crops))
        ])
    else:
        crop_list = "\n".join([
            f"  {i+1}. {top_crops[i].capitalize()}"
            for i in range(len(top_crops))
        ])

    prompt = f"""You are an expert agricultural advisor
helping a farmer in India.

Soil information:
- Nitrogen (N)   : {N} kg/ha
- Phosphorus (P) : {P} kg/ha
- Potassium (K)  : {K} kg/ha
- Temperature    : {temperature} degrees Celsius
- Humidity       : {humidity}%
- Soil pH        : {ph}
- Rainfall       : {rainfall} mm
- Soil Type      : {soil_type if soil_type else 'Not specified'}

Our AI model has identified these TOP 3 RECOMMENDED CROPS
for your exact soil conditions:
{crop_list}

IMPORTANT INSTRUCTIONS:
- You MUST only talk about these exact 3 crops listed above
- Do NOT suggest or mention any other crops
- Do NOT replace these crops with different ones
- Address each crop by its exact name as listed above

Please provide:
1. Is this soil suitable for farming? (yes/no and why)
2. For each of the 3 crops listed above explain why it
   suits these exact soil conditions
3. Any soil improvements the farmer should make
4. Best season to plant each crop

Use simple language that a farmer can understand."""

    response = client.chat.completions.create(
        model=GROQ_TEXT_MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1024
    )
    return response.choices[0].message.content


def get_disease_advisory(disease_name, confidence):

    prompt = f"""You are an expert plant doctor
helping a farmer.

Detected plant disease : {disease_name}
Detection confidence   : {confidence}%

Please provide:
1. What is this disease and what causes it
2. How serious is it (mild / moderate / severe)
3. Which chemical sprays or fertilizers to use
   (with specific product names)
4. Natural or organic alternatives
5. How to prevent it next season

Use simple language that a farmer can understand.
Keep your answer practical and actionable."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1024
    )
    return response.choices[0].message.content