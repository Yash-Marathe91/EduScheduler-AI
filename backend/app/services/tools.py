import asyncio
from langchain_core.tools import tool
from sqlalchemy import select, and_, or_
from app.db.database import SessionLocal
from app.models.domain import Profile, FacultyDetails, TimetableSlot, Classroom, Subject

@tool
async def get_faculty_info(name_query: str) -> str:
    """Finds information about a faculty member by their name."""
    async with SessionLocal() as session:
        result = await session.execute(
            select(Profile).filter(Profile.role.in_(['faculty', 'admin']), Profile.full_name.ilike(f"%{name_query}%"))
        )
        profiles = result.scalars().all()
        if not profiles:
            return f"No faculty found matching '{name_query}'"
        
        info = []
        for p in profiles:
            info.append(f"Name: {p.full_name}, Email: {p.email}")
        return "\n".join(info)

@tool
async def check_faculty_availability(faculty_name: str, day_of_week: int, period_number: int) -> str:
    """Checks if a faculty member is free on a given day (1=Mon, 5=Fri) and period number (1 to N)."""
    async with SessionLocal() as session:
        # Find faculty id
        result = await session.execute(
            select(Profile).filter(Profile.role.in_(['faculty', 'admin']), Profile.full_name.ilike(f"%{faculty_name}%"))
        )
        profile = result.scalar_one_or_none()
        if not profile:
            return f"Faculty matching '{faculty_name}' not found."
            
        # Check timetable slots
        result = await session.execute(
            select(TimetableSlot).filter(
                TimetableSlot.faculty_id == profile.id,
                TimetableSlot.day_of_week == day_of_week,
                TimetableSlot.period_number == period_number
            )
        )
        slot = result.scalar_one_or_none()
        if slot:
            return f"{profile.full_name} is BUSY on day {day_of_week}, period {period_number}. They are teaching."
        else:
            return f"{profile.full_name} is FREE on day {day_of_week}, period {period_number}."

@tool
async def get_free_faculty(day_of_week: int, period_number: int) -> str:
    """Finds a list of all faculty members who are completely free on a given day (1=Mon, 5=Fri) and period."""
    async with SessionLocal() as session:
        # Get all faculty ids that have a slot at this time
        busy_result = await session.execute(
            select(TimetableSlot.faculty_id).filter(
                TimetableSlot.day_of_week == day_of_week,
                TimetableSlot.period_number == period_number
            )
        )
        busy_ids = [row[0] for row in busy_result.all() if row[0]]
        
        # Get all faculty who are NOT in busy_ids
        if busy_ids:
            query = select(Profile).filter(Profile.role.in_(['faculty', 'admin']), ~Profile.id.in_(busy_ids))
        else:
            query = select(Profile).filter(Profile.role.in_(['faculty', 'admin']))
            
        free_result = await session.execute(query)
        free_faculty = free_result.scalars().all()
        
        if not free_faculty:
            return "No faculty members are free at this time."
            
        names = [f.full_name for f in free_faculty if f.full_name]
        return f"Free Faculty on day {day_of_week}, period {period_number}:\n" + ", ".join(names)

import uuid
from app.models.domain import FacultyAbsence, SubstituteAssignment

@tool
async def mark_faculty_absent(faculty_name: str, absence_date: str, day_of_week: int, reason: str = "Not specified") -> str:
    """Marks a faculty member absent for a specific date (e.g. '2026-07-21') and day_of_week (1=Mon, 5=Fri), and returns their scheduled slots that need substitutes."""
    async with SessionLocal() as session:
        # Find faculty
        result = await session.execute(
            select(Profile).filter(Profile.role.in_(['faculty', 'admin']), Profile.full_name.ilike(f"%{faculty_name}%"))
        )
        profile = result.scalar_one_or_none()
        if not profile:
            return f"Faculty '{faculty_name}' not found."
            
        # Create absence record
        absence_id = uuid.uuid4()
        absence = FacultyAbsence(id=absence_id, faculty_id=profile.id, absence_date=absence_date, reason=reason)
        session.add(absence)
        
        # Find slots that need covering
        result = await session.execute(
            select(TimetableSlot).filter(
                TimetableSlot.faculty_id == profile.id,
                TimetableSlot.day_of_week == day_of_week
            )
        )
        slots = result.scalars().all()
        
        await session.commit()
        
        if not slots:
            return f"Marked {profile.full_name} absent on {absence_date}. They have NO classes scheduled for this day, so no substitutes are needed."
            
        slot_info = []
        for s in slots:
            slot_info.append(f"SlotID: {s.id} | Period: {s.period_number} | SubjectID: {s.subject_id} | ClassID: {s.classroom_id}")
            
        return f"Marked {profile.full_name} absent on {absence_date}. AbsenceID: {absence_id}.\nThey have the following classes that need substitutes:\n" + "\n".join(slot_info)

@tool
async def assign_substitute(absence_id: str, original_slot_id: str, substitute_name: str) -> str:
    """Assigns a substitute faculty member to cover a specific missing slot."""
    async with SessionLocal() as session:
        from datetime import datetime
        from app.models.domain import Notification
        
        # Find substitute
        result = await session.execute(
            select(Profile).filter(Profile.role.in_(['faculty', 'admin']), Profile.full_name.ilike(f"%{substitute_name}%"))
        )
        substitute = result.scalar_one_or_none()
        if not substitute:
            return f"Substitute '{substitute_name}' not found."
            
        assignment = SubstituteAssignment(
            id=uuid.uuid4(),
            absence_id=uuid.UUID(absence_id),
            original_slot_id=uuid.UUID(original_slot_id),
            substitute_faculty_id=substitute.id,
            status="assigned"
        )
        session.add(assignment)
        
        # Add notification for the substitute faculty
        notif = Notification(
            id=uuid.uuid4(),
            user_id=substitute.id,
            title="Substitute Assigned",
            message=f"You have been assigned as a substitute for slot {original_slot_id}.",
            type="info",
            created_at=datetime.now().isoformat()
        )
        session.add(notif)
        
        await session.commit()
        
        return f"Successfully assigned {substitute.full_name} as a substitute for slot {original_slot_id} and notified them."

ALL_TOOLS = [get_faculty_info, check_faculty_availability, get_free_faculty, mark_faculty_absent, assign_substitute]
