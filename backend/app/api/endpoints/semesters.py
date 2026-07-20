from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.database import get_db
from app.models.domain import Semester
from app.schemas.timetable import SemesterResponse

router = APIRouter()

@router.get("/", response_model=List[SemesterResponse])
async def get_semesters(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Semester))
    return result.scalars().all()
