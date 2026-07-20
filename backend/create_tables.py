import asyncio, asyncpg

async def run():
    conn = await asyncpg.connect('postgresql://postgres:Yash%405204j123@db.abtnmtvtpukfeyimrynz.supabase.co:5432/postgres')
    
    # Create student_details table
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS public.student_details (
            id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
            enrollment_number VARCHAR(50) UNIQUE,
            batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL,
            current_semester_id UUID REFERENCES public.semesters(id) ON DELETE SET NULL,
            phone VARCHAR(20)
        );
    ''')
    print("Created student_details table.")

asyncio.run(run())
