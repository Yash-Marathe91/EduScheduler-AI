# API Routers

from fastapi import APIRouter
from app.api.endpoints import departments, subjects, classrooms, faculty, profiles, settings
from app.api.timetable import router as timetable_router

api_router = APIRouter()
api_router.include_router(departments.router, prefix="/departments", tags=["Departments"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["Subjects"])
api_router.include_router(classrooms.router, prefix="/classrooms", tags=["Classrooms"])
api_router.include_router(faculty.router, prefix="/faculty", tags=["Faculty"])
api_router.include_router(profiles.router, prefix="/profiles", tags=["Profiles"])
api_router.include_router(settings.router, prefix="/settings", tags=["Settings"])
api_router.include_router(timetable_router)
