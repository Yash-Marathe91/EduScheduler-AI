from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List, Dict, Any
import uuid

from app.db.database import get_db
from app.models.domain import Notification

router = APIRouter()

# Normally we'd use current_user from auth, but for demo we will pass user_id explicitly or fetch all
@router.get("/{user_id}")
async def get_notifications(user_id: str, db: AsyncSession = Depends(get_db)):
    try:
        user_uuid = uuid.UUID(user_id)
        result = await db.execute(
            select(Notification)
            .filter(Notification.user_id == user_uuid)
            .order_by(Notification.created_at.desc())
            .limit(50)
        )
        notifications = result.scalars().all()
        return notifications
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{notification_id}/read")
async def mark_notification_read(notification_id: str, db: AsyncSession = Depends(get_db)):
    try:
        notif_uuid = uuid.UUID(notification_id)
        
        # Check if notification exists
        result = await db.execute(select(Notification).filter(Notification.id == notif_uuid))
        notification = result.scalar_one_or_none()
        
        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found")
            
        notification.is_read = True
        await db.commit()
        return {"status": "success", "message": "Marked as read"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
