from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class FacultyDetailsSchema(BaseModel):
    department_id: Optional[UUID] = None
    designation: Optional[str] = None
    employee_id: Optional[str] = None
    is_verified: Optional[bool] = None

class StudentDetailsSchema(BaseModel):
    enrollment_number: Optional[str] = None
    batch_id: Optional[UUID] = None
    current_semester_id: Optional[UUID] = None
    phone: Optional[str] = None

class ProfileResponse(BaseModel):
    id: UUID
    email: str
    full_name: Optional[str] = None
    role: str
    faculty_details: Optional[FacultyDetailsSchema] = None
    student_details: Optional[StudentDetailsSchema] = None

    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    faculty_details: Optional[FacultyDetailsSchema] = None
    student_details: Optional[StudentDetailsSchema] = None
