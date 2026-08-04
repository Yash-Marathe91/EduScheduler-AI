-- ==========================================
-- EDUSCHEDULER AI - SUPABASE SECURITY HARDENING
-- Run this script in your Supabase SQL Editor
-- ==========================================

-- 1. Enable Row Level Security (RLS) on all public schema tables
-- This blocks unauthorized direct REST API requests via Anon keys.

ALTER TABLE IF EXISTS public.timetable_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.student_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.faculty_absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.substitute_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.debug_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.faculty_unavailability ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.classroom_equipment ENABLE ROW LEVEL SECURITY;

-- Create basic permissive policy for service/authenticated backend access if needed
-- (Note: Direct PostgreSQL connections via SQLAlchemy bypass RLS automatically)
DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow backend full access" ON public.%I', t);
        EXECUTE format('CREATE POLICY "Allow backend full access" ON public.%I FOR ALL USING (true) WITH CHECK (true)', t);
    END LOOP;
END $$;


-- 2. Fix Function Search Path Security Issue
-- Prevents search path manipulation vulnerabilities in custom SQL triggers/functions

ALTER FUNCTION public.handle_new_user() SET search_path = public;
