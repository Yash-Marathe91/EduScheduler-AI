import asyncio
import traceback
import sys
from dotenv import load_dotenv
load_dotenv() # Force dot env
from app.services.ai_coordinator import process_chat_message

async def main():
    try:
        res = await process_chat_message("Hello, who is free tomorrow?")
        with open("agent_output.txt", "w", encoding="utf-8") as f:
            f.write(f"RESPONSE: {res}")
        print("Success! Output written to agent_output.txt")
    except Exception as e:
        with open("agent_output.txt", "w", encoding="utf-8") as f:
            f.write("ERROR OCCURRED:\n")
            traceback.print_exc(file=f)
        print("Failed. Error written to agent_output.txt")

if __name__ == "__main__":
    asyncio.run(main())
