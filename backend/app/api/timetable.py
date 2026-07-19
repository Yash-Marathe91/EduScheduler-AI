from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Any
import uuid

from app.db.database import get_db
from app.core.security import verify_token
from app.models.domain import Semester, Batch, TimetableSlot, Subject, Faculty, Classroom
from app.schemas.timetable import (
    SemesterCreate, SemesterResponse,
    BatchCreate, BatchResponse,
    GenerateTimetableRequest, TimetableSlotResponse
)
from app.services.scheduler_engine import TimetableScheduler

router = APIRouter(prefix="/timetable", tags=["Timetable"])

@router.post("/semesters", response_model=SemesterResponse, status_code=status.HTTP_201_CREATED)
async def create_semester(
    semester: SemesterCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token)
):
    new_semester = Semester(**semester.model_dump())
    db.add(new_semester)
    await db.commit()
    await db.refresh(new_semester)
    return new_semester

@router.get("/semesters", response_model=List[SemesterResponse])
async def get_semesters(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token)
):
    result = await db.execute(select(Semester))
    return result.scalars().all()

@router.post("/batches", response_model=BatchResponse, status_code=status.HTTP_201_CREATED)
async def create_batch(
    batch: BatchCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token)
):
    new_batch = Batch(**batch.model_dump())
    db.add(new_batch)
    await db.commit()
    await db.refresh(new_batch)
    return new_batch

@router.get("/batches", response_model=List[BatchResponse])
async def get_batches(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token)
):
    result = await db.execute(select(Batch))
    return result.scalars().all()

@router.post("/generate", status_code=status.HTTP_200_OK)
async def generate_timetable(
    request: GenerateTimetableRequest,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token)
):
    """
    Generates a timetable for a given department and semester.
    Gathers all active batches, subjects, faculty, and classrooms to form requirements.
    """
    # 1. Fetch batches for the semester
    batches_result = await db.execute(select(Batch).filter(Batch.semester_id == request.semester_id, Batch.is_active == True))
    batches = batches_result.scalars().all()
    
    if not batches:
        raise HTTPException(status_code=400, detail="No active batches found for this semester.")

    # 2. Fetch subjects for the department
    subjects_result = await db.execute(select(Subject).filter(Subject.department_id == request.department_id, Subject.is_active == True))
    subjects = subjects_result.scalars().all()
    
    if not subjects:
        raise HTTPException(status_code=400, detail="No active subjects found for this department.")

    # 3. Fetch faculty for the department
    faculty_result = await db.execute(select(Faculty).filter(Faculty.department_id == request.department_id, Faculty.is_active == True))
    faculty = faculty_result.scalars().all()
    
    if not faculty:
        raise HTTPException(status_code=400, detail="No active faculty found for this department.")
        
    # 4. Fetch classrooms
    classrooms_result = await db.execute(select(Classroom).filter(Classroom.is_active == True))
    classrooms = classrooms_result.scalars().all()
    
    if not classrooms:
        raise HTTPException(status_code=400, detail="No active classrooms found.")

    # 5. Formulate Requirements (simplified logic for prototype)
    # We will assign each subject to one batch and one random faculty for the sake of the engine test.
    # In a full production system, there would be a Subject-Faculty-Batch mapping table.
    import random
    requirements = []
    
    for batch in batches:
        for subject in subjects:
            # Randomly assign a faculty member to teach this subject to this batch
            assigned_faculty = random.choice(faculty)
            requirements.append({
                "batch_id": batch.id,
                "subject_id": subject.id,
                "faculty_id": assigned_faculty.id,
                "count": subject.lectures_per_week,
                "is_lab": subject.is_lab
            })
            
    # 6. Run Engine
    scheduler = TimetableScheduler(days=request.days, periods_per_day=request.periods_per_day)
    result = scheduler.generate_schedule(
        batches=[{"id": b.id} for b in batches],
        faculty=[{"id": f.id} for f in faculty],
        subjects=[{"id": s.id} for s in subjects],
        classrooms=[{"id": c.id} for c in classrooms],
        requirements=requirements
    )
    
    if result["status"] == "success":
        # 7. Save to Database
        # First, delete existing slots for this semester's batches
        batch_ids = [b.id for b in batches]
        await db.execute(TimetableSlot.__table__.delete().where(TimetableSlot.batch_id.in_(batch_ids)))
        
        final_schedule = []
        for slot in result["schedule"]:
            new_slot = TimetableSlot(
                id=str(uuid.uuid4()),
                batch_id=slot["batch_id"],
                subject_id=slot["subject_id"],
                faculty_id=slot["faculty_id"],
                classroom_id=slot["classroom_id"],
                day_of_week=slot["day"],
                start_time=slot["period"] * 60 + 540, # Assuming period 0 starts at 9:00 AM (540 mins)
                duration_minutes=60,
                is_lab=slot["is_lab"]
            )
            db.add(new_slot)
            
            final_schedule.append({
                "batch_id": slot["batch_id"],
                "subject_id": slot["subject_id"],
                "faculty_id": slot["faculty_id"],
                "classroom_id": slot["classroom_id"],
                "day_of_week": slot["day"],
                "start_time": slot["period"] * 60 + 540,
                "duration_minutes": 60,
                "is_lab": slot["is_lab"]
            })
            
        await db.commit()
            
        return {"status": "success", "message": "Timetable generated and saved successfully.", "schedule": final_schedule}
    else:
        raise HTTPException(status_code=422, detail=result["message"])

@router.get("/slots")
async def get_timetable_slots(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token)
):
    """
    Fetches all timetable slots with resolved names for the UI Demo.
    """
    from sqlalchemy.orm import selectinload
    
    # We will manually join or just query all and build the response
    query = select(
        TimetableSlot, Batch, Subject, Faculty, Classroom
    ).join(Batch, TimetableSlot.batch_id == Batch.id)\
     .join(Subject, TimetableSlot.subject_id == Subject.id)\
     .join(Faculty, TimetableSlot.faculty_id == Faculty.id)\
     .join(Classroom, TimetableSlot.classroom_id == Classroom.id)
     
    result = await db.execute(query)
    rows = result.all()
    
    schedule = []
    for slot, batch, subject, faculty, classroom in rows:
        schedule.append({
            "id": slot.id,
            "batch_id": batch.id,
            "batch_name": batch.name,
            "subject_id": subject.id,
            "subject_name": subject.name,
            "subject_code": subject.code,
            "faculty_id": faculty.id,
            "faculty_name": f"{faculty.designation} {faculty.first_name} {faculty.last_name}",
            "classroom_id": classroom.id,
            "classroom_name": classroom.name,
            "day_of_week": slot.day_of_week,
            "start_time": slot.start_time,
            "duration_minutes": slot.duration_minutes,
            "is_lab": slot.is_lab
        })
        
    return {"schedule": schedule}
