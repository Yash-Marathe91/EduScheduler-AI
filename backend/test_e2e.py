import asyncio
import httpx

async def run_e2e_test():
    print("Starting E2E Test...")
    base_url = "http://localhost:8000/api/v1"
    
    async with httpx.AsyncClient(follow_redirects=True, headers={"Authorization": "Bearer dummy_token"}) as client:
        # 1. Create Department
        print("Creating Department...")
        res = await client.post(f"{base_url}/departments", json={
            "name": "Computer Science",
            "code": "CS",
            "description": "CS Dept"
        })
        assert res.status_code == 201, f"Failed to create department: {res.text}"
        dept_id = res.json()["id"]
        
        # 2. Create Faculty
        print("Creating Faculty...")
        res = await client.post(f"{base_url}/faculty", json={
            "first_name": "Alan",
            "last_name": "Turing",
            "email": "alan@cs.edu",
            "designation": "Professor",
            "department_id": dept_id,
            "max_lectures_per_week": 15
        })
        assert res.status_code == 201, f"Failed to create faculty: {res.text}"
        
        res = await client.post(f"{base_url}/faculty", json={
            "first_name": "Grace",
            "last_name": "Hopper",
            "email": "grace@cs.edu",
            "designation": "Assoc Professor",
            "department_id": dept_id,
            "max_lectures_per_week": 20
        })
        assert res.status_code == 201
        
        # 3. Create Subjects
        print("Creating Subjects...")
        res = await client.post(f"{base_url}/subjects", json={
            "name": "Data Structures",
            "code": "CS301",
            "department_id": dept_id,
            "credits": 4,
            "lectures_per_week": 4,
            "is_lab": False
        })
        assert res.status_code == 201
        
        res = await client.post(f"{base_url}/subjects", json={
            "name": "Algorithms Lab",
            "code": "CS302L",
            "department_id": dept_id,
            "credits": 2,
            "lectures_per_week": 2,
            "is_lab": True
        })
        assert res.status_code == 201
        
        # 4. Create Classrooms
        print("Creating Classrooms...")
        res = await client.post(f"{base_url}/classrooms", json={
            "name": "Lecture Hall 1",
            "capacity": 100,
            "is_lab": False
        })
        assert res.status_code == 201
        
        res = await client.post(f"{base_url}/classrooms", json={
            "name": "Computer Lab A",
            "capacity": 30,
            "is_lab": True
        })
        assert res.status_code == 201
        
        # 5. Create Semester and Batch
        print("Creating Semester and Batch...")
        res = await client.post(f"{base_url}/timetable/semesters", json={
            "name": "Fall 2026",
            "department_id": dept_id
        })
        assert res.status_code == 201
        sem_id = res.json()["id"]
        
        res = await client.post(f"{base_url}/timetable/batches", json={
            "name": "Batch A",
            "semester_id": sem_id,
            "student_count": 60
        })
        assert res.status_code == 201
        
        # 6. Generate Timetable!
        print("Generating Timetable via AI Engine...")
        res = await client.post(f"{base_url}/timetable/generate", json={
            "department_id": dept_id,
            "semester_id": sem_id,
            "days": 5,
            "periods_per_day": 8
        })
        assert res.status_code == 200, f"Failed to generate timetable: {res.text}"
        data = res.json()
        print(f"Success! Status: {data['status']}")
        print(f"Generated {len(data['schedule'])} timetable slots.")
        
        print("End-to-End Test Passed Automatically!")

if __name__ == "__main__":
    asyncio.run(run_e2e_test())
