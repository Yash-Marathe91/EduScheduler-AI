import asyncio, asyncpg

async def run():
    conn = await asyncpg.connect('postgresql://postgres:Yash%405204j123@db.abtnmtvtpukfeyimrynz.supabase.co:5432/postgres')
    
    # Create notifications table
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS public.notifications (
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
            title VARCHAR(100) NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(50) DEFAULT 'info',
            is_read BOOLEAN DEFAULT FALSE,
            created_at VARCHAR(30)
        );
    ''')
    print("Created notifications table.")

asyncio.run(run())
