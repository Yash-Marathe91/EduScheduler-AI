from pydantic import BaseModel, UUID4
from typing import List, Optional
from datetime import date

class SemesterBase(BaseModel):
    name: str
    department_id: UUID4
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class SemesterCreate(SemesterBase):
    pass

class SemesterResponse(SemesterBase):
    id: UUID4

    class Config:
        from_attributes = True

class BatchBase(BaseModel):
    name: str
    semester_id: UUID4
    student_count: int = 60
    is_active: bool = True

class BatchCreate(BatchBase):
    pass

class BatchResponse(BatchBase):
    id: UUID4

    class Config:
        from_attributes = True

class TimetableSlotBase(BaseModel):
    batch_id: UUID4
    subject_id: UUID4
    faculty_id: UUID4
    classroom_id: UUID4
    day_of_week: int
    start_time: int
    duration_minutes: int = 60
    is_lab: bool = False

class TimetableSlotCreate(TimetableSlotBase):
    pass

class TimetableSlotResponse(TimetableSlotBase):
    id: UUID4

    class Config:
        from_attributes = True

class GenerateTimetableRequest(BaseModel):
    department_id: UUID4
    semester_id: UUID4
    days: int = 5
    periods_per_day: int = 8
