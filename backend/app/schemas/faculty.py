from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from uuid import UUID

class FacultyBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    designation: str
    department_id: UUID
    max_lectures_per_week: int = 15
    is_active: bool = True

class FacultyCreate(FacultyBase):
    pass

class FacultyUpdate(FacultyBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    designation: Optional[str] = None
    department_id: Optional[UUID] = None
    max_lectures_per_week: Optional[int] = None

class FacultyResponse(FacultyBase):
    id: UUID
    user_id: Optional[UUID] = None
    model_config = ConfigDict(from_attributes=True)
