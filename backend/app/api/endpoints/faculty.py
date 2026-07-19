from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from app.db.database import get_db
from app.models.domain import Faculty
from app.schemas.faculty import FacultyCreate, FacultyUpdate, FacultyResponse
from app.api.deps import CurrentUser

router = APIRouter()

@router.get("/", response_model=List[FacultyResponse])
async def get_faculties(
    current_user: CurrentUser,
    skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Faculty).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=FacultyResponse, status_code=status.HTTP_201_CREATED)
async def create_faculty(
    faculty: FacultyCreate, current_user: CurrentUser, db: AsyncSession = Depends(get_db)
):
    new_faculty = Faculty(**faculty.model_dump())
    db.add(new_faculty)
    try:
        await db.commit()
        await db.refresh(new_faculty)
        return new_faculty
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Error creating faculty, possibly duplicate email.")

@router.put("/{faculty_id}", response_model=FacultyResponse)
async def update_faculty(faculty_id: UUID, faculty_update: FacultyUpdate, current_user: CurrentUser, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Faculty).filter(Faculty.id == faculty_id))
    fac = result.scalar_one_or_none()
    if not fac:
        raise HTTPException(status_code=404, detail="Faculty not found")
    update_data = faculty_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(fac, key, value)
    await db.commit()
    await db.refresh(fac)
    return fac

@router.delete("/{faculty_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_faculty(faculty_id: UUID, current_user: CurrentUser, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Faculty).filter(Faculty.id == faculty_id))
    fac = result.scalar_one_or_none()
    if not fac:
        raise HTTPException(status_code=404, detail="Faculty not found")
    await db.delete(fac)
    await db.commit()
