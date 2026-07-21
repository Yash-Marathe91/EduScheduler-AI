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
    
    # Create faculty_absences table
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS public.faculty_absences (
            id UUID PRIMARY KEY,
            faculty_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
            absence_date VARCHAR(20) NOT NULL,
            reason TEXT,
            status VARCHAR(20) DEFAULT 'pending'
        );
    ''')
    print("Created faculty_absences table.")
    
    # Create substitute_assignments table
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS public.substitute_assignments (
            id UUID PRIMARY KEY,
            absence_id UUID REFERENCES public.faculty_absences(id) ON DELETE CASCADE,
            original_slot_id UUID REFERENCES public.timetable_slots(id) ON DELETE CASCADE,
            substitute_faculty_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
            status VARCHAR(20) DEFAULT 'assigned'
        );
    ''')
    print("Created substitute_assignments table.")

asyncio.run(run())
