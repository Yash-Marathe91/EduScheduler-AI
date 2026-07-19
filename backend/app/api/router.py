from fastapi import APIRouter
from app.api.endpoints import departments, faculty, subjects, classrooms
from app.api import timetable

api_router = APIRouter()

api_router.include_router(departments.router, prefix="/departments", tags=["Departments"])
api_router.include_router(faculty.router, prefix="/faculty", tags=["Faculty"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["Subjects"])
api_router.include_router(classrooms.router, prefix="/classrooms", tags=["Classrooms"])
api_router.include_router(timetable.router, prefix="", tags=["Timetable"])
