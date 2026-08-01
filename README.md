# EduScheduler AI Campus OS

EduScheduler AI is a next-generation academic scheduling and campus management system. It features an intelligent timetable generation algorithm, OCR-based document processing, and a comprehensive role-based access control (RBAC) dashboard for Admins, Faculty, and Students.

## Architecture

This project is built using a decoupled architecture:
*   **Frontend**: Next.js 14, React, Tailwind CSS, deployed on Vercel.
*   **Backend**: Python, FastAPI, SQLAlchemy, deployed on Render.
*   **Database & Auth**: Supabase (PostgreSQL).

---

## 🚀 Running the Project Locally

Because this project is decoupled into two separate directories (`frontend` and `backend`), you need to run two separate terminals to start both servers.

### 1. Start the Backend (FastAPI)
The backend runs on Python and serves the REST API.

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate your virtual environment (if you are using one):
   ```bash
   # On Windows:
   .venv\Scripts\activate
   ```
3. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
The backend will now be running at `http://localhost:8000`.

### 2. Start the Frontend (Next.js)
The frontend powers the beautiful dashboard and user interface.

1. Open a **second** terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
The frontend will now be running at `http://localhost:3000`.

---

## 🔐 Environment Variables

For the project to work, you must have your environment variables set correctly in both directories.

### Backend (`backend/.env`)
```env
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_KEY=<your-supabase-service-role-key>
DATABASE_URL=postgresql://postgres.<your-project-id>:<your-password>@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
GEMINI_API_KEY=<your-google-gemini-key>
OPENAI_API_KEY=<your-openai-key>
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-public-key>
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

*(Note: In production on Vercel, `NEXT_PUBLIC_API_URL` should point to your live Render backend URL).*

---

## 🚀 Production Deployment
*   **Frontend**: Deployed to Vercel (Root Directory set to `frontend`).
*   **Backend**: Deployed to Render (Web Service running `uvicorn main:app --host 0.0.0.0 --port $PORT`).
