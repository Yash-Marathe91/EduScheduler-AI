-- EduScheduler AI - Supabase PostgreSQL Schema
-- Run this in the Supabase SQL Editor to set up your production database.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Departments Table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);
CREATE INDEX idx_departments_name ON departments(name);
CREATE INDEX idx_departments_code ON departments(code);

-- 2. Faculty Table
CREATE TABLE faculty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE, -- Can link to auth.users later
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    designation VARCHAR(50) NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    max_lectures_per_week INTEGER DEFAULT 15,
    is_active BOOLEAN DEFAULT TRUE
);
CREATE INDEX idx_faculty_email ON faculty(email);

-- 3. Subjects Table
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    credits INTEGER DEFAULT 3,
    lectures_per_week INTEGER DEFAULT 4,
    is_lab BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);
CREATE INDEX idx_subjects_code ON subjects(code);

-- 4. Classrooms Table
CREATE TABLE classrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    is_lab BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);
CREATE INDEX idx_classrooms_name ON classrooms(name);

-- 5. Semesters Table
CREATE TABLE semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    start_date VARCHAR(20),
    end_date VARCHAR(20)
);

-- 6. Batches Table
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
    student_count INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE
);

-- 7. Timetable Slots Table
CREATE TABLE timetable_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculty(id) ON DELETE CASCADE,
    classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0=Mon, 1=Tue, etc.
    start_time INTEGER NOT NULL,  -- Minutes from midnight
    duration_minutes INTEGER DEFAULT 60,
    is_lab BOOLEAN DEFAULT FALSE
);

-- Optional: Insert Demo Data
INSERT INTO departments (name, code, description) 
VALUES ('Electronics & Computer Engineering', 'ECE', 'Department of Electronics and Computer Engineering');

-- Fetch the department ID to insert more data (Requires PL/pgSQL block or manual UUID copying in raw SQL)
