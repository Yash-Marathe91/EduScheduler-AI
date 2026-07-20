from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Any
import uuid

from app.db.database import get_db
from app.models.domain import TimetableSettings
from app.schemas.settings import SettingsResponse, SettingsUpdate
from app.api.deps import CurrentUser

router = APIRouter()

@router.get("/", response_model=SettingsResponse)
async def get_settings(
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db)
):
    # Only one global settings config for now, or match it by department
    # Let's get the first available settings (global for demo)
    result = await db.execute(select(TimetableSettings).limit(1))
    settings = result.scalar_one_or_none()
    
    if not settings:
        # Create default if not exists
        settings = TimetableSettings(id=uuid.uuid4())
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
        
    return settings

@router.put("/", response_model=SettingsResponse)
async def update_settings(
    settings_update: SettingsUpdate,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db)
):
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Only admins can modify settings")
        
    result = await db.execute(select(TimetableSettings).limit(1))
    settings = result.scalar_one_or_none()
    
    if not settings:
        settings = TimetableSettings(id=uuid.uuid4())
        db.add(settings)
        
    update_data = settings_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
        
    await db.commit()
    await db.refresh(settings)
    
    return settings
