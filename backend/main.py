from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="EduScheduler AI API",
    description="Backend API for EduScheduler AI - College Timetable Management System",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Must be specific when credentials=True
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.router import api_router
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Welcome to EduScheduler AI API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
