from fastapi import APIRouter
from app.api.endpoints import auth, classrooms, departments, faculty, subjects, profiles, settings, semesters
from app.api import timetable

api_router = APIRouter()

api_router.include_router(departments.router, prefix="/departments", tags=["Departments"])
api_router.include_router(faculty.router, prefix="/faculty", tags=["Faculty"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["Subjects"])
api_router.include_router(classrooms.router, prefix="/classrooms", tags=["Classrooms"])
api_router.include_router(timetable.router, prefix="", tags=["Timetable"])
from app.api.endpoints import profiles, settings
api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(semesters.router, prefix="/semesters", tags=["semesters"])
