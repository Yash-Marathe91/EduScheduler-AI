from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
import io
import csv
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
import uuid

from app.db.database import get_db
from app.services.ocr_service import extract_attendance_from_image
from datetime import datetime
from app.models.domain import AttendanceRecord, TimetableSlot, StudentDetails, Notification

router = APIRouter()

@router.post("/upload")
async def upload_attendance_sheet(
    slot_id: str = Form(...),
    date: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Read image
        image_bytes = await file.read()
        
        # Verify slot exists
        slot_uuid = uuid.UUID(slot_id)
        result = await db.execute(select(TimetableSlot).filter(TimetableSlot.id == slot_uuid))
        slot = result.scalar_one_or_none()
        if not slot:
            raise HTTPException(status_code=404, detail="Timetable slot not found.")
            
        # Extract data using OCR
        extracted_data = await extract_attendance_from_image(image_bytes)

        # Save to database
        saved_records = []
        now_str = datetime.now().isoformat()
        for record in extracted_data:
            enrollment = record.get("student_enrollment")
            status = record.get("status", "absent").lower()
            
            if not enrollment:
                continue
                
            # Upsert logic (if record already exists for this date/slot/student, update it)
            existing_result = await db.execute(
                select(AttendanceRecord).filter(
                    AttendanceRecord.timetable_slot_id == slot_uuid,
                    AttendanceRecord.date == date,
                    AttendanceRecord.student_enrollment == enrollment
                )
            )
            existing_record = existing_result.scalar_one_or_none()
            
            if existing_record:
                existing_record.status = status
                saved_records.append(existing_record)
            else:
                new_record = AttendanceRecord(
                    id=uuid.uuid4(),
                    timetable_slot_id=slot_uuid,
                    date=date,
                    student_enrollment=enrollment,
                    status=status
                )
                db.add(new_record)
                saved_records.append(new_record)
                
            # Trigger Notification if student is absent
            if status == "absent":
                student_res = await db.execute(
                    select(StudentDetails.id).filter(StudentDetails.enrollment_number == enrollment)
                )
                student_id = student_res.scalar_one_or_none()
                if student_id:
                    notif = Notification(
                        id=uuid.uuid4(),
                        user_id=student_id,
                        title="Attendance Alert",
                        message=f"You have been marked ABSENT for your class on {date}.",
                        type="warning",
                        created_at=now_str
                    )
                    db.add(notif)
                
        await db.commit()
        
        return {
            "message": "Attendance successfully processed and saved.",
            "processed_count": len(saved_records),
            "data": extracted_data
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{slot_id}")
async def get_attendance(slot_id: str, date: str, db: AsyncSession = Depends(get_db)):
    try:
        slot_uuid = uuid.UUID(slot_id)
        result = await db.execute(
            select(AttendanceRecord).filter(
                AttendanceRecord.timetable_slot_id == slot_uuid,
                AttendanceRecord.date == date
            )
        )
        records = result.scalars().all()
        return records
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/export/{slot_id}")
async def export_attendance_csv(slot_id: str, date: str, db: AsyncSession = Depends(get_db)):
    try:
        slot_uuid = uuid.UUID(slot_id)
        result = await db.execute(
            select(AttendanceRecord).filter(
                AttendanceRecord.timetable_slot_id == slot_uuid,
                AttendanceRecord.date == date
            )
        )
        records = result.scalars().all()
        
        # Create CSV in memory
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Date", "Slot ID", "Student Enrollment", "Status"])
        for record in records:
            writer.writerow([record.date, str(record.timetable_slot_id), record.student_enrollment, record.status])
            
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]), 
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=attendance_{date}.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
