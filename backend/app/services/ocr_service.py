import os
import json
import google.generativeai as genai
from typing import List, Dict

# Configure genai with the same key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def extract_attendance_from_image(image_bytes: bytes) -> List[Dict[str, str]]:
    """
    Uses Gemini Vision to read a handwritten or printed attendance sheet image 
    and extract the enrollment numbers and their attendance status.
    """
    model = genai.GenerativeModel('gemini-3.5-flash')
    
    prompt = """
    You are an expert OCR and data extraction system for a university.
    Look at the provided image of an attendance sheet.
    Extract the list of student enrollment numbers and their attendance status (present, absent, or late).
    
    Return the data EXACTLY as a JSON array of objects, with no markdown formatting or extra text.
    Example format:
    [
      {"student_enrollment": "PRN2021001", "status": "present"},
      {"student_enrollment": "PRN2021002", "status": "absent"}
    ]
    """
    
    try:
        # We need to construct the part for the image
        image_part = {
            "mime_type": "image/jpeg", # Or determine dynamically
            "data": image_bytes
        }
        
        response = await model.generate_content_async([prompt, image_part])
        text = response.text.strip()
        
        # Clean up possible markdown json blocks
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        data = json.loads(text.strip())
        return data
    except Exception as e:
        print(f"OCR Error: {e}")
        raise ValueError("Failed to extract attendance data from image. Please ensure the image is clear.")
