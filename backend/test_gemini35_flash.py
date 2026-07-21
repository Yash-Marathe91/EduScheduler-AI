import asyncio
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

load_dotenv()

async def test_gemini():
    llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash", google_api_key=os.getenv("GEMINI_API_KEY"))
    try:
        res = await llm.ainvoke([HumanMessage(content="test")])
        print("Success:", res.content)
    except Exception as e:
        print("Error:", type(e).__name__, str(e))

if __name__ == "__main__":
    asyncio.run(test_gemini())
