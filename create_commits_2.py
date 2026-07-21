import os
import subprocess
import time

def run_git(args):
    try:
        subprocess.run(["git"] + args, check=True)
    except Exception as e:
        pass

def commit_batch(files, message):
    for f in files:
        if os.path.exists(f):
            subprocess.run(["git", "add", f])
    
    # Check if there's anything staged
    status = subprocess.run(["git", "diff", "--cached", "--name-only"], capture_output=True, text=True)
    if status.stdout.strip():
        subprocess.run(["git", "commit", "-m", message])
        print(f"Committed: {message}")
    else:
        print(f"Skipped (No changes): {message}")
    time.sleep(1)

def main():
    # 7
    commit_batch(["frontend/package.json", "frontend/tsconfig.json", "frontend/next.config.mjs", "frontend/postcss.config.mjs", "frontend/components.json"], "feat(frontend): Initialize Next.js 16 App Router configuration")
    
    # 8
    commit_batch(["frontend/src/app/globals.css", "frontend/src/app/layout.tsx", "frontend/tailwind.config.ts"], "style(frontend): Configure TailwindCSS and Premium UI themes")
    
    # 9
    commit_batch(["frontend/src/components", "frontend/src/lib", "frontend/src/providers", "frontend/src/hooks"], "feat(frontend): Build interactive UI components and GSAP animations")
    
    # 10
    commit_batch(["frontend/src/app/dashboard/timetable", "frontend/src/app/dashboard/layout.tsx"], "feat(frontend): Implement AI Timetable Generation Dashboard")
    
    # 11
    commit_batch(["frontend/src/app/dashboard/classrooms", "frontend/src/app/dashboard/faculty", "frontend/src/app/dashboard/departments", "frontend/src/app/dashboard/subjects"], "feat(frontend): Add entity management dashboards for Classrooms and Faculty")
    
    # 12
    commit_batch([
        "backend/app/api/endpoints/attendance.py",
        "backend/app/services/ocr_service.py",
        "backend/create_attendance_table.py",
        "frontend/src/app/dashboard/attendance"
    ], "feat(ai): Implement Gemini Vision OCR for automated attendance extraction")
    
    # 13
    commit_batch([
        "backend/app/api/endpoints/notifications.py",
        "backend/create_notifications_table.py",
        "frontend/src/components/notifications",
        "frontend/src/app/dashboard/layout.tsx",
        "backend/app/services/tools.py"
    ], "feat(core): Integrate real-time notification subsystem for absent alerts and substitutions")

    # 14
    commit_batch([
        "backend/app/api/timetable.py"
    ], "feat(export): Add CSV export capabilities for timetables and attendance records")

    # 15
    subprocess.run(["git", "add", "."])
    commit_batch(["."], "docs: Finalize production environment, advanced SQL schemas, and root configs")

if __name__ == "__main__":
    main()
