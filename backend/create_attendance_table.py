import asyncio, asyncpg

async def run():
    conn = await asyncpg.connect('postgresql://postgres:Yash%405204j123@db.abtnmtvtpukfeyimrynz.supabase.co:5432/postgres')
    
    # Create attendance_records table
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS public.attendance_records (
            id UUID PRIMARY KEY,
            timetable_slot_id UUID REFERENCES public.timetable_slots(id) ON DELETE CASCADE,
            date VARCHAR(20) NOT NULL,
            student_enrollment VARCHAR(50) NOT NULL,
            status VARCHAR(20) NOT NULL,
            marked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
            confidence_score VARCHAR(20)
        );
    ''')
    print("Created attendance_records table.")

asyncio.run(run())
