import os
import subprocess
import time

def run_git_command(command):
    try:
        result = subprocess.run(command, check=True, capture_output=True, text=True, shell=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error executing '{command}':")
        print(e.stderr)
        return None

def commit_phase(message, files):
    for f in files:
        run_git_command(f"git add {f}")
    if files:
        stdout = run_git_command(f'git commit -m "{message}"')
        if stdout:
            print(f"Committed: {message}")
        else:
            print(f"Skipped (No changes): {message}")
    else:
        print(f"Skipped (No files): {message}")
    time.sleep(1)

def main():
    print("Starting Git history generation for Phase 5...")
    
    commits = [
        {
            "message": "feat(auth): Implement Role-Based Access Control in Next.js middleware",
            "files": ["frontend/src/middleware.ts", "frontend/src/app/dashboard/layout.tsx"]
        },
        {
            "message": "feat(faculty): Wire Gemini Vision OCR to Faculty Onboarding ID parser",
            "files": ["backend/app/api/endpoints/faculty.py", "backend/app/services/ocr_service.py"]
        },
        {
            "message": "docs: Phase 5 UI polish and test scripts",
            "files": ["frontend/src/components/layout/premium-background.tsx", "frontend/src/components/notifications/notification-dropdown.tsx", "backend/test_db.py", "backend/test_gemini.py"]
        }
    ]
    
    for c in commits:
        commit_phase(c["message"], c["files"])
        
    # Catch any remaining untracked/modified files
    run_git_command("git add .")
    run_git_command('git commit -m "chore: Final project stabilization and cleanup"')
    
    print("\nPhase 5 Git history formalization complete!")

if __name__ == "__main__":
    main()
