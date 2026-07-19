import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.sql import text
from dotenv import load_dotenv

load_dotenv()

async def test_connection():
    database_url = os.getenv("DATABASE_URL")
    print(f"Attempting to connect to: {database_url.split('@')[1] if '@' in database_url else 'Unknown'}")
    
    try:
        engine = create_async_engine(database_url, echo=False)
        async with engine.begin() as conn:
            result = await conn.execute(text("SELECT 1"))
            print("\nSUCCESS! The password is correct and the database is connected!")
            print(f"Query Result: {result.scalar()}")
    except Exception as e:
        print("\nFAILED to connect. The password might be wrong or the database is unreachable.")
        print(f"Error Details: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())
