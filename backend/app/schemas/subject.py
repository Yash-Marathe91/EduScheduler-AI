from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID

class SubjectBase(BaseModel):
    name: str
    code: str
    department_id: UUID
    credits: int = 3
    lectures_per_week: int = 4
    is_lab: bool = False
    is_active: bool = True

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(SubjectBase):
    name: Optional[str] = None
    code: Optional[str] = None
    department_id: Optional[UUID] = None
    credits: Optional[int] = None
    lectures_per_week: Optional[int] = None
    is_lab: Optional[bool] = None
    is_active: Optional[bool] = None

class SubjectResponse(SubjectBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)
