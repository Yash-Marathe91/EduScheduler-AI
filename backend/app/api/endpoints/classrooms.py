from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from app.db.database import get_db
from app.models.domain import Classroom
from app.schemas.classroom import ClassroomCreate, ClassroomUpdate, ClassroomResponse
from app.api.deps import CurrentUser

router = APIRouter()

@router.get("/", response_model=List[ClassroomResponse])
async def get_classrooms(
    current_user: CurrentUser,
    skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Classroom).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=ClassroomResponse, status_code=status.HTTP_201_CREATED)
async def create_classroom(
    classroom: ClassroomCreate, current_user: CurrentUser, db: AsyncSession = Depends(get_db)
):
    new_classroom = Classroom(**classroom.model_dump())
    db.add(new_classroom)
    try:
        await db.commit()
        await db.refresh(new_classroom)
        return new_classroom
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Error creating classroom, name may already exist.")

@router.put("/{classroom_id}", response_model=ClassroomResponse)
async def update_classroom(classroom_id: UUID, classroom_update: ClassroomUpdate, current_user: CurrentUser, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Classroom).filter(Classroom.id == classroom_id))
    cls = result.scalar_one_or_none()
    if not cls:
        raise HTTPException(status_code=404, detail="Classroom not found")
    update_data = classroom_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(cls, key, value)
    await db.commit()
    await db.refresh(cls)
    return cls

@router.delete("/{classroom_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_classroom(classroom_id: UUID, current_user: CurrentUser, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Classroom).filter(Classroom.id == classroom_id))
    cls = result.scalar_one_or_none()
    if not cls:
        raise HTTPException(status_code=404, detail="Classroom not found")
    await db.delete(cls)
    await db.commit()
