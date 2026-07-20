from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Any
import uuid

from app.db.database import get_db
from app.models.domain import Profile, FacultyDetails, StudentDetails
from app.schemas.profile import ProfileResponse, ProfileUpdate
from app.api.deps import CurrentUser

router = APIRouter()

@router.get("/me", response_model=ProfileResponse)
async def get_my_profile(
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db)
):
    user_id = current_user.id
    
    # Fetch base profile
    result = await db.execute(select(Profile).filter(Profile.id == user_id))
    profile = result.scalar_one_or_none()
    
    if not profile:
        # Fallback if profile doesn't exist (though it should via the trigger)
        # We can create a dummy response or raise an error
        raise HTTPException(status_code=404, detail="Profile not found. Please re-register or contact support.")
        
    response_data = {
        "id": profile.id,
        "email": profile.email,
        "full_name": profile.full_name,
        "role": profile.role,
        "faculty_details": None,
        "student_details": None
    }

    if profile.role == 'faculty':
        fac_result = await db.execute(select(FacultyDetails).filter(FacultyDetails.id == user_id))
        fac_details = fac_result.scalar_one_or_none()
        if fac_details:
            response_data["faculty_details"] = {
                "department_id": fac_details.department_id,
                "designation": fac_details.designation,
                "employee_id": fac_details.employee_id,
                "is_verified": fac_details.is_verified
            }
    elif profile.role == 'student':
        stu_result = await db.execute(select(StudentDetails).filter(StudentDetails.id == user_id))
        stu_details = stu_result.scalar_one_or_none()
        if stu_details:
            response_data["student_details"] = {
                "enrollment_number": stu_details.enrollment_number,
                "batch_id": stu_details.batch_id,
                "current_semester_id": stu_details.current_semester_id,
                "phone": stu_details.phone
            }
            
    return response_data

@router.put("/me", response_model=ProfileResponse)
async def update_my_profile(
    profile_update: ProfileUpdate,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db)
):
    user_id = current_user.id
    
    result = await db.execute(select(Profile).filter(Profile.id == user_id))
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")
        
    if profile_update.full_name is not None:
        profile.full_name = profile_update.full_name
        
    # Handle Faculty Details
    if profile.role == 'faculty' and profile_update.faculty_details:
        fac_result = await db.execute(select(FacultyDetails).filter(FacultyDetails.id == user_id))
        fac_details = fac_result.scalar_one_or_none()
        if not fac_details:
            fac_details = FacultyDetails(id=user_id)
            db.add(fac_details)
            
        update_data = profile_update.faculty_details.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(fac_details, key, value)
            
    # Handle Student Details
    if profile.role == 'student' and profile_update.student_details:
        stu_result = await db.execute(select(StudentDetails).filter(StudentDetails.id == user_id))
        stu_details = stu_result.scalar_one_or_none()
        if not stu_details:
            stu_details = StudentDetails(id=user_id)
            db.add(stu_details)
            
        update_data = profile_update.student_details.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(stu_details, key, value)
            
    await db.commit()
    
    # Return updated profile
    return await get_my_profile(current_user=current_user, db=db)
