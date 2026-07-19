import os
import subprocess
import time

def run_git(args):
    subprocess.run(["git"] + args, check=True)

def commit_batch(files, message):
    for f in files:
        if os.path.exists(f):
            run_git(["add", f])
    
    # Check if there's anything to commit
    status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
    if status.stdout.strip():
        run_git(["commit", "-m", message])
        print(f"Committed: {message}")
    else:
        print(f"Skipped (No changes): {message}")
    time.sleep(1)

def main():
    if not os.path.exists(".git"):
        run_git(["init"])
        run_git(["branch", "-M", "main"])

    # 1
    commit_batch(["package.json", ".gitignore", "README.md"], "chore: Initialize EduScheduler AI monorepo structure")
    
    # 2
    commit_batch(["backend/app/models", "backend/app/db", "backend/app/schemas", "backend/requirements.txt"], "feat(backend): Setup FastAPI core architecture and DB models")
    
    # 3
    commit_batch(["backend/app/api"], "feat(backend): Implement basic CRUD API endpoints for departments, faculty, subjects")
    
    # 4
    commit_batch(["backend/app/services/scheduler_engine.py", "backend/test_e2e.py"], "feat(backend): Integrate AI Timetable Scheduling Engine using OR-Tools")
    
    # 5
    commit_batch(["backend/app/core/security.py", "backend/.env"], "feat(backend): Add JWT Security and Supabase Authentication")
    
    # 6
    commit_batch(["backend/alembic", "backend/alembic.ini", "backend/seed_ece_demo.py"], "chore(backend): Add Database Migrations and DB Seed scripts")
    
    # 7
    commit_batch(["frontend/package.json", "frontend/tsconfig.json", "frontend/next.config.mjs", "frontend/postcss.config.js"], "feat(frontend): Initialize Next.js 16 App Router configuration")
    
    # 8
    commit_batch(["frontend/src/app/globals.css", "frontend/src/app/layout.tsx", "frontend/tailwind.config.ts"], "style(frontend): Configure TailwindCSS and Premium UI themes")
    
    # 9
    commit_batch(["frontend/src/components", "frontend/src/lib", "frontend/src/providers", "frontend/src/hooks"], "feat(frontend): Build interactive UI components and GSAP animations")
    
    # 10
    commit_batch(["frontend/src/app/dashboard/timetable", "frontend/src/app/dashboard/layout.tsx"], "feat(frontend): Implement AI Timetable Generation Dashboard")
    
    # 11
    commit_batch(["frontend/src/app/dashboard/classrooms", "frontend/src/app/dashboard/faculty", "frontend/src/app/dashboard/departments", "frontend/src/app/dashboard/subjects"], "feat(frontend): Add entity management dashboards for Classrooms and Faculty")
    
    # 12
    run_git(["add", "."])
    commit_batch(["."], "docs: Finalize production environment, advanced SQL schemas, and root configs")

if __name__ == "__main__":
    main()
