from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from app.db.database import get_db
from app.models.domain import Department
from app.schemas.department import DepartmentCreate, DepartmentUpdate, DepartmentResponse
from app.api.deps import CurrentUser

router = APIRouter()

@router.get("/", response_model=List[DepartmentResponse])
async def get_departments(
    current_user: CurrentUser,
    skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Department).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
async def create_department(
    department: DepartmentCreate, current_user: CurrentUser, db: AsyncSession = Depends(get_db)
):
    new_dept = Department(**department.model_dump())
    db.add(new_dept)
    try:
        await db.commit()
        await db.refresh(new_dept)
        return new_dept
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Department with this code or name may already exist.")

@router.put("/{dept_id}", response_model=DepartmentResponse)
async def update_department(dept_id: UUID, dept_update: DepartmentUpdate, current_user: CurrentUser, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Department).filter(Department.id == dept_id))
    dept = result.scalar_one_or_none()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    update_data = dept_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(dept, key, value)
    await db.commit()
    await db.refresh(dept)
    return dept

@router.delete("/{dept_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_department(dept_id: UUID, current_user: CurrentUser, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Department).filter(Department.id == dept_id))
    dept = result.scalar_one_or_none()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    await db.delete(dept)
    await db.commit()
