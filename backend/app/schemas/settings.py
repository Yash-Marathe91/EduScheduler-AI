from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class SettingsResponse(BaseModel):
    id: UUID
    department_id: Optional[UUID] = None
    max_consecutive_lectures: int
    lunch_break_start: int
    lunch_break_duration: int
    allow_saturday_classes: bool

    class Config:
        from_attributes = True

class SettingsUpdate(BaseModel):
    department_id: Optional[UUID] = None
    max_consecutive_lectures: Optional[int] = None
    lunch_break_start: Optional[int] = None
    lunch_break_duration: Optional[int] = None
    allow_saturday_classes: Optional[bool] = None
