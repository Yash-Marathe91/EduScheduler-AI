import asyncio
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

load_dotenv()

async def test_openai():
    llm = ChatOpenAI(model="gpt-4o", api_key=os.getenv("OPENAI_API_KEY"))
    try:
        res = await llm.ainvoke([HumanMessage(content="test")])
        print("Success:", res.content)
    except Exception as e:
        print("Error:", type(e).__name__, str(e))

if __name__ == "__main__":
    asyncio.run(test_openai())
