from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from app.db.database import get_db
from app.models.domain import Subject
from app.schemas.subject import SubjectCreate, SubjectUpdate, SubjectResponse
from app.api.deps import CurrentUser

router = APIRouter()

@router.get("/", response_model=List[SubjectResponse])
async def get_subjects(
    current_user: CurrentUser,
    skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Subject).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
async def create_subject(
    subject: SubjectCreate, current_user: CurrentUser, db: AsyncSession = Depends(get_db)
):
    new_subject = Subject(**subject.model_dump())
    db.add(new_subject)
    try:
        await db.commit()
        await db.refresh(new_subject)
        return new_subject
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Error creating subject, code may already exist.")

@router.put("/{subject_id}", response_model=SubjectResponse)
async def update_subject(subject_id: UUID, subject_update: SubjectUpdate, current_user: CurrentUser, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Subject).filter(Subject.id == subject_id))
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=404, detail="Subject not found")
    update_data = subject_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(sub, key, value)
    await db.commit()
    await db.refresh(sub)
    return sub

@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subject(subject_id: UUID, current_user: CurrentUser, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Subject).filter(Subject.id == subject_id))
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=404, detail="Subject not found")
    await db.delete(sub)
    await db.commit()
