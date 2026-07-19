-- EduScheduler AI - Advanced Customization & Features Schema
-- Run this in your Supabase SQL Editor to expand your database capabilities.

-- 1. Roles & Permissions (For advanced access control)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL, -- 'SUPER_ADMIN', 'HOD', 'FACULTY', 'STUDENT'
    permissions JSONB DEFAULT '{}'::jsonb -- Stores granular permissions like {"can_generate_timetable": true}
);

-- Insert Default Roles
INSERT INTO roles (name, permissions) VALUES 
('SUPER_ADMIN', '{"all": true}'),
('HOD', '{"can_generate_timetable": true, "can_manage_faculty": true}'),
('FACULTY', '{"can_view_own": true, "can_set_availability": true}');

-- 2. User Profiles (Extending Supabase Auth)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY, -- This will match auth.users.id
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL, -- Null for super admins
    theme_preference VARCHAR(20) DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to automatically create a user profile when a new user signs up in Supabase Auth
-- (You can run this safely, it binds to Supabase's native auth system)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role_id)
  VALUES (new.id, (SELECT id FROM roles WHERE name = 'FACULTY' LIMIT 1));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Faculty Unavailability (AI Engine Constraint Data)
-- Allows faculty to block out specific times (e.g., meetings, half-days)
CREATE TABLE faculty_unavailability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID REFERENCES faculty(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL,
    start_time INTEGER NOT NULL, -- minutes from midnight
    end_time INTEGER NOT NULL,
    reason TEXT,
    is_approved BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_faculty_unavail_faculty ON faculty_unavailability(faculty_id);

-- 4. Classroom Equipment (AI Engine Matching Data)
-- Allows the AI to schedule a subject requiring a "Projector" only in rooms that have one.
CREATE TABLE classroom_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    equipment_name VARCHAR(100) NOT NULL, -- 'Smartboard', 'Projector', 'High-End PCs'
    quantity INTEGER DEFAULT 1
);

-- 5. Timetable Global Settings (Customizability)
-- Allows admins to tweak the AI's behavior via the UI without touching code
CREATE TABLE timetable_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE UNIQUE,
    max_consecutive_lectures INTEGER DEFAULT 3,
    lunch_break_start INTEGER DEFAULT 750, -- 12:30 PM
    lunch_break_duration INTEGER DEFAULT 60,
    allow_saturday_classes BOOLEAN DEFAULT FALSE
);
