from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID

# Shared properties
class DepartmentBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    is_active: bool = True

# Properties to receive on item creation
class DepartmentCreate(DepartmentBase):
    pass

# Properties to receive on item update
class DepartmentUpdate(DepartmentBase):
    name: Optional[str] = None
    code: Optional[str] = None

# Properties to return to client
class DepartmentResponse(DepartmentBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)
