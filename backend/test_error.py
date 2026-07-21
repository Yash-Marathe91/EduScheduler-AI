import asyncio
from app.services.ai_coordinator import coordinator_app
from langchain_core.messages import HumanMessage

async def main():
    try:
        await coordinator_app.ainvoke({'messages': [HumanMessage(content='hello')]})
    except Exception as e:
        print(f"Exception Type: {type(e).__name__}")
        print(f"Exception Message: {e}")

if __name__ == "__main__":
    asyncio.run(main())
