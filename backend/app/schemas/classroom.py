from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID

class ClassroomBase(BaseModel):
    name: str
    capacity: int
    is_lab: bool = False
    is_active: bool = True

class ClassroomCreate(ClassroomBase):
    pass

class ClassroomUpdate(ClassroomBase):
    name: Optional[str] = None
    capacity: Optional[int] = None
    is_lab: Optional[bool] = None
    is_active: Optional[bool] = None

class ClassroomResponse(ClassroomBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)
