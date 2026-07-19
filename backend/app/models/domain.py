from sqlalchemy import Column, String, Text, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from sqlalchemy.types import Uuid as UUID
from app.db.database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    code = Column(String(20), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

    # Relationships
    faculty = relationship("Faculty", back_populates="department")

class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=True, unique=True) # Link to Supabase Auth User
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    designation = Column(String(50), nullable=False)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    max_lectures_per_week = Column(Integer, default=15)
    is_active = Column(Boolean, default=True)

    # Relationships
    department = relationship("Department", back_populates="faculty")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(100), nullable=False)
    code = Column(String(20), unique=True, index=True, nullable=False)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    credits = Column(Integer, default=3)
    lectures_per_week = Column(Integer, default=4)
    is_lab = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

class Classroom(Base):
    __tablename__ = "classrooms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(50), unique=True, index=True, nullable=False) # e.g., "Room 304", "Lab 1"
    capacity = Column(Integer, nullable=False)
    is_lab = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

class Semester(Base):
    __tablename__ = "semesters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(50), nullable=False) # e.g., "Fall 2026", "Semester 5"
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    start_date = Column(String(20), nullable=True) # ISO format date
    end_date = Column(String(20), nullable=True)

class Batch(Base):
    __tablename__ = "batches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(50), nullable=False) # e.g., "Div A", "Batch A1"
    semester_id = Column(UUID(as_uuid=True), ForeignKey("semesters.id"))
    student_count = Column(Integer, default=60)
    is_active = Column(Boolean, default=True)

class TimetableSlot(Base):
    __tablename__ = "timetable_slots"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("batches.id"))
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"))
    faculty_id = Column(UUID(as_uuid=True), ForeignKey("faculty.id"))
    classroom_id = Column(UUID(as_uuid=True), ForeignKey("classrooms.id"))
    
    day_of_week = Column(Integer, nullable=False) # 0 = Monday, 1 = Tuesday, etc.
    start_time = Column(Integer, nullable=False) # Minutes from midnight, e.g., 540 = 9:00 AM
    duration_minutes = Column(Integer, default=60)
    
    is_lab = Column(Boolean, default=False)
