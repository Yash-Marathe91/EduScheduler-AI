import asyncio
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import SessionLocal
from app.models.domain import Department, Faculty, Subject, Classroom, Semester, Batch, TimetableSlot

async def seed_ece_demo():
    print("Seeding TY ECE Demo Timetable...")
    async with SessionLocal() as db:
        # Clear existing
        await db.execute(TimetableSlot.__table__.delete())
        await db.execute(Batch.__table__.delete())
        await db.execute(Semester.__table__.delete())
        await db.execute(Subject.__table__.delete())
        await db.execute(Faculty.__table__.delete())
        await db.execute(Classroom.__table__.delete())
        await db.execute(Department.__table__.delete())
        
        # 1. Department
        dept = Department(name="Electronics & Computer Engineering", code="ECE", description="ECE Dept")
        db.add(dept)
        await db.flush()
        
        # 2. Faculty
        faculties = {
            "AI": Faculty(first_name="R. G.", last_name="Dabhade", email="rg.dabhade@ece.edu", designation="Dr.", department_id=dept.id),
            "DCCN": Faculty(first_name="S. R.", last_name="Kamlapurkar", email="sr.kamlapurkar@ece.edu", designation="Prof.", department_id=dept.id),
            "DBMS": Faculty(first_name="K. N.", last_name="Nagare", email="kn.nagare@ece.edu", designation="Prof.", department_id=dept.id),
            "Micro": Faculty(first_name="P. A.", last_name="Nawale", email="pa.nawale@ece.edu", designation="Prof.", department_id=dept.id),
            "Java": Faculty(first_name="A. P.", last_name="Jagtap", email="ap.jagtap@ece.edu", designation="Prof.", department_id=dept.id),
            "SPML": Faculty(first_name="H. S.", last_name="Ahire", email="hs.ahire@ece.edu", designation="Prof.", department_id=dept.id),
            "OE": Faculty(first_name="V.", last_name="Gujarathi", email="v.gujarathi@ece.edu", designation="Prof.", department_id=dept.id),
            "Audit": Faculty(first_name="V. A.", last_name="Sanap", email="va.sanap@ece.edu", designation="Prof.", department_id=dept.id),
            "Aptitude": Faculty(first_name="Training", last_name="Placement", email="tnp@ece.edu", designation="Trainer", department_id=dept.id),
        }
        for f in faculties.values(): db.add(f)
        await db.flush()
        
        # 3. Subjects
        subjects = {
            "AI": Subject(name="Artificial Intelligence", code="AI", department_id=dept.id, is_lab=False),
            "DCCN": Subject(name="Data Comm & Computer Network", code="DCCN", department_id=dept.id, is_lab=False),
            "DBMS": Subject(name="Database Management System", code="DBMS", department_id=dept.id, is_lab=False),
            "Micro": Subject(name="Microprocessor", code="MICRO", department_id=dept.id, is_lab=False),
            "Java": Subject(name="EL-I Java", code="JAVA", department_id=dept.id, is_lab=False),
            "Java_Lab": Subject(name="Java Lab", code="JAVA_LAB", department_id=dept.id, is_lab=True),
            "SPML_Lab": Subject(name="SPML Lab", code="SPML_LAB", department_id=dept.id, is_lab=True),
            "OE": Subject(name="Open Elective", code="OE", department_id=dept.id, is_lab=False),
            "OE_Lab": Subject(name="OE Lab", code="OE_LAB", department_id=dept.id, is_lab=True),
            "Audit": Subject(name="Audit Course", code="AUDIT", department_id=dept.id, is_lab=False),
            "Aptitude": Subject(name="Aptitude Training", code="APT", department_id=dept.id, is_lab=False),
        }
        for s in subjects.values(): db.add(s)
        await db.flush()
        
        # 4. Classrooms
        rooms = {
            "CR1": Classroom(name="Classroom 1", capacity=80, is_lab=False),
            "LAB_A": Classroom(name="Computer Lab A", capacity=30, is_lab=True),
            "LAB_B": Classroom(name="Computer Lab B", capacity=30, is_lab=True),
            "LAB_C": Classroom(name="Computer Lab C", capacity=30, is_lab=True),
            "LAB_D": Classroom(name="Computer Lab D", capacity=30, is_lab=True),
        }
        for r in rooms.values(): db.add(r)
        await db.flush()
        
        # 5. Semester & Batches
        sem = Semester(name="TY ECE Sem-I", department_id=dept.id)
        db.add(sem)
        await db.flush()
        
        b_main = Batch(name="TY ECE", semester_id=sem.id, student_count=80)
        t1 = Batch(name="T1", semester_id=sem.id, student_count=20)
        t2 = Batch(name="T2", semester_id=sem.id, student_count=20)
        t3 = Batch(name="T3", semester_id=sem.id, student_count=20)
        t4 = Batch(name="T4", semester_id=sem.id, student_count=20)
        db.add_all([b_main, t1, t2, t3, t4])
        await db.flush()

        all_sub = [t1.id, t2.id, t3.id, t4.id]
        
        # Helper to schedule
        def add_slot(batch_ids, subject_key, faculty_key, room_key, day, period, duration=1):
            for bid in batch_ids:
                for d in range(duration):
                    s = TimetableSlot(
                        batch_id=bid,
                        subject_id=subjects[subject_key].id,
                        faculty_id=faculties[faculty_key].id,
                        classroom_id=rooms[room_key].id,
                        day_of_week=day,
                        start_time=period + d, # mapping period 0 to 5
                        duration_minutes=55
                    )
                    db.add(s)

        # MONDAY (Day 0)
        add_slot(all_sub, "Audit", "Audit", "CR1", 0, 0)
        add_slot(all_sub, "Java", "Java", "CR1", 0, 1)
        add_slot(all_sub, "Aptitude", "Aptitude", "CR1", 0, 2, duration=2)
        add_slot(all_sub, "DBMS", "DBMS", "CR1", 0, 4)
        add_slot(all_sub, "Micro", "Micro", "CR1", 0, 5)

        # TUESDAY (Day 1)
        add_slot(all_sub, "Micro", "Micro", "CR1", 1, 0)
        add_slot(all_sub, "DCCN", "DCCN", "CR1", 1, 1)
        add_slot(all_sub, "Aptitude", "Aptitude", "CR1", 1, 2, duration=2)
        add_slot(all_sub, "Java", "Java", "CR1", 1, 4)
        add_slot(all_sub, "AI", "AI", "CR1", 1, 5)

        # WEDNESDAY (Day 2)
        # Period 0 & 1 (Labs)
        add_slot([t1.id], "OE_Lab", "OE", "LAB_A", 2, 0, duration=2)
        add_slot([t2.id], "OE_Lab", "OE", "LAB_B", 2, 0, duration=2)
        add_slot([t3.id], "Java_Lab", "Java", "LAB_C", 2, 0, duration=2)
        add_slot([t4.id], "SPML_Lab", "SPML", "LAB_D", 2, 0, duration=2)
        add_slot(all_sub, "Aptitude", "Aptitude", "CR1", 2, 2, duration=2)
        add_slot(all_sub, "OE", "OE", "CR1", 2, 4)
        add_slot(all_sub, "OE", "OE", "CR1", 2, 5)

        # THURSDAY (Day 3)
        add_slot(all_sub, "Micro", "Micro", "CR1", 3, 0)
        add_slot(all_sub, "DCCN", "DCCN", "CR1", 3, 1)
        add_slot(all_sub, "Aptitude", "Aptitude", "CR1", 3, 2, duration=2)
        add_slot(all_sub, "AI", "AI", "CR1", 3, 4)
        add_slot(all_sub, "DBMS", "DBMS", "CR1", 3, 5)

        # FRIDAY (Day 4)
        add_slot(all_sub, "DCCN", "DCCN", "CR1", 4, 0)
        add_slot(all_sub, "AI", "AI", "CR1", 4, 1)
        add_slot(all_sub, "Aptitude", "Aptitude", "CR1", 4, 2, duration=2)
        add_slot(all_sub, "Java", "Java", "CR1", 4, 4)
        add_slot(all_sub, "DBMS", "DBMS", "CR1", 4, 5)

        # SATURDAY (Day 5) - All Labs
        # Morning (Period 0 & 1)
        add_slot([t1.id], "DBMS", "DBMS", "LAB_A", 5, 0, duration=2)
        add_slot([t2.id], "DCCN", "DCCN", "LAB_B", 5, 0, duration=2)
        add_slot([t3.id], "SPML_Lab", "SPML", "LAB_C", 5, 0, duration=2)
        add_slot([t4.id], "Java_Lab", "Java", "LAB_D", 5, 0, duration=2)

        # Mid-Morning (Period 2 & 3)
        add_slot([t1.id], "Java_Lab", "Java", "LAB_A", 5, 2, duration=2)
        add_slot([t2.id], "SPML_Lab", "SPML", "LAB_B", 5, 2, duration=2)
        add_slot([t3.id], "DBMS", "DBMS", "LAB_C", 5, 2, duration=2)
        add_slot([t4.id], "DCCN", "DCCN", "LAB_D", 5, 2, duration=2)

        # Afternoon (Period 4 & 5)
        add_slot([t1.id], "SPML_Lab", "SPML", "LAB_A", 5, 4, duration=2)
        add_slot([t2.id], "Java_Lab", "Java", "LAB_B", 5, 4, duration=2)
        add_slot([t3.id], "SPML_Lab", "SPML", "LAB_C", 5, 4, duration=2)
        add_slot([t4.id], "DBMS", "DBMS", "LAB_D", 5, 4, duration=2)

        await db.commit()
        print("Demo data seeded successfully.")

if __name__ == "__main__":
    asyncio.run(seed_ece_demo())
