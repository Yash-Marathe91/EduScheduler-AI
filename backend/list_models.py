import urllib.request
import os
import json
from dotenv import load_dotenv

load_dotenv()
key = os.getenv('GEMINI_API_KEY')
url = f'https://generativelanguage.googleapis.com/v1beta/models?key={key}'

try:
    req = urllib.request.Request(url)
    res = urllib.request.urlopen(req).read().decode('utf-8')
    models = json.loads(res)['models']
    names = [m['name'] for m in models if 'generateContent' in m.get('supportedGenerationMethods', [])]
    print("Available models:", names)
except Exception as e:
    print("Error:", e)
