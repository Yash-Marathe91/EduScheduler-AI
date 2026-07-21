from fastapi import APIRouter
from app.api.endpoints import classrooms, departments, faculty, subjects, profiles, settings, semesters, ai_chat
from app.api import timetable

api_router = APIRouter()

api_router.include_router(departments.router, prefix="/departments", tags=["Departments"])
api_router.include_router(faculty.router, prefix="/faculty", tags=["Faculty"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["Subjects"])
api_router.include_router(classrooms.router, prefix="/classrooms", tags=["Classrooms"])
api_router.include_router(timetable.router, prefix="", tags=["Timetable"])
from app.api.endpoints import profiles, settings, attendance, notifications
api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(semesters.router, prefix="/semesters", tags=["semesters"])
api_router.include_router(ai_chat.router, prefix="/ai/chat", tags=["ai"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["attendance"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
