import asyncio
import os
from supabase import create_client
from dotenv import load_dotenv
import urllib.request
import urllib.error
import json

load_dotenv()

async def test_api():
    supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    
    # We don't have user credentials, so we can't fully login. 
    # Let's just try to hit the endpoint directly and see if we get a 401 or a crash.
    try:
        req = urllib.request.Request("http://localhost:8000/api/v1/departments/")
        response = urllib.request.urlopen(req)
        print("Success:", response.read().decode())
    except urllib.error.HTTPError as e:
        print("HTTP Error:", e.code, e.read().decode())
    except Exception as e:
        print("Error:", str(e))

if __name__ == "__main__":
    asyncio.run(test_api())
