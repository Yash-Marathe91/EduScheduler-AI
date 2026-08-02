import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()

async def main():
    url = os.getenv("DATABASE_URL")
    if not url:
        print("No DATABASE_URL")
        return
    
    engine = create_async_engine(url, echo=True)
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE profiles ADD COLUMN hashed_password VARCHAR(255);"))
            print("Successfully added hashed_password column.")
        except Exception as e:
            print("Error or column already exists:", e)
            
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
