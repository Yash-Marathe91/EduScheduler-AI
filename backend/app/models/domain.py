from sqlalchemy import Column, String, Text, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from sqlalchemy.types import Uuid as UUID
from sqlalchemy.dialects.postgresql import JSONB
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
    
class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=True) # Added for local auth
    role = Column(String(50), default="student")
    
class FacultyDetails(Base):
    __tablename__ = "faculty_details"

    id = Column(UUID(as_uuid=True), primary_key=True) # Matches profiles.id
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=True)
    designation = Column(String(100), nullable=True)
    employee_id = Column(String(50), nullable=True)
    id_card_url = Column(String(255), nullable=True)
    is_verified = Column(Boolean, default=False)
    extended_preferences = Column(JSONB, default={}, nullable=True)
    
class StudentDetails(Base):
    __tablename__ = "student_details"

    id = Column(UUID(as_uuid=True), primary_key=True) # Matches profiles.id
    enrollment_number = Column(String(50), unique=True, nullable=True)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("batches.id"), nullable=True)
    current_semester_id = Column(UUID(as_uuid=True), ForeignKey("semesters.id"), nullable=True)
    phone = Column(String(20), nullable=True)
    extended_preferences = Column(JSONB, default={}, nullable=True)

class TimetableSettings(Base):
    __tablename__ = "timetable_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), unique=True)
    max_consecutive_lectures = Column(Integer, default=3)
    lunch_break_start = Column(Integer, default=750) # 12:30 PM in minutes
    lunch_break_duration = Column(Integer, default=60)
    allow_saturday_classes = Column(Boolean, default=False)

class FacultyAbsence(Base):
    __tablename__ = "faculty_absences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    faculty_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    absence_date = Column(String(20), nullable=False) # ISO format date
    reason = Column(Text, nullable=True)
    status = Column(String(20), default="pending") # pending, covered, cancelled

class SubstituteAssignment(Base):
    __tablename__ = "substitute_assignments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    absence_id = Column(UUID(as_uuid=True), ForeignKey("faculty_absences.id"), nullable=False)
    original_slot_id = Column(UUID(as_uuid=True), ForeignKey("timetable_slots.id"), nullable=False)
    substitute_faculty_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    status = Column(String(20), default="assigned") # assigned, notified, accepted, rejected

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    timetable_slot_id = Column(UUID(as_uuid=True), ForeignKey("timetable_slots.id"), nullable=False)
    date = Column(String(20), nullable=False) # ISO format date
    student_enrollment = Column(String(50), nullable=False) # Student enrollment number
    status = Column(String(20), nullable=False) # present, absent, late
    marked_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=True) # Faculty who uploaded the sheet
    confidence_score = Column(String(20), nullable=True) # OCR confidence score if extracted via AI

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    title = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="info") # info, warning, alert, success
    is_read = Column(Boolean, default=False)
    created_at = Column(String(30), nullable=True) # ISO format datetime
