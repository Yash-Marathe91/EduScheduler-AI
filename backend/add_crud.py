import os

endpoints_dir = "app/api/endpoints"

additions = {
    "departments.py": """
@router.put("/{dept_id}", response_model=DepartmentResponse)
async def update_department(dept_id: UUID, dept_update: DepartmentUpdate, current_user: CurrentUser, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Department).filter(Department.id == dept_id))
    dept = result.scalar_one_or_none()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    update_data = dept_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(dept, key, value)
    await db.commit()
    await db.refresh(dept)
    return dept

@router.delete("/{dept_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_department(dept_id: UUID, current_user: CurrentUser, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Department).filter(Department.id == dept_id))
    dept = result.scalar_one_or_none()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    await db.delete(dept)
    await db.commit()
""",
    "faculty.py": """
@router.put("/{faculty_id}", response_model=FacultyResponse)
async def update_faculty(faculty_id: UUID, faculty_update: FacultyUpdate, current_user: CurrentUser, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Faculty).filter(Faculty.id == faculty_id))
    fac = result.scalar_one_or_none()
    if not fac:
        raise HTTPException(status_code=404, detail="Faculty not found")
    update_data = faculty_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(fac, key, value)
    await db.commit()
    await db.refresh(fac)
    return fac

@router.delete("/{faculty_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_faculty(faculty_id: UUID, current_user: CurrentUser, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Faculty).filter(Faculty.id == faculty_id))
    fac = result.scalar_one_or_none()
    if not fac:
        raise HTTPException(status_code=404, detail="Faculty not found")
    await db.delete(fac)
    await db.commit()
""",
    "subjects.py": """
@router.put("/{subject_id}", response_model=SubjectResponse)
async def update_subject(subject_id: UUID, subject_update: SubjectUpdate, current_user: CurrentUser, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Subject).filter(Subject.id == subject_id))
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=404, detail="Subject not found")
    update_data = subject_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(sub, key, value)
    await db.commit()
    await db.refresh(sub)
    return sub

@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subject(subject_id: UUID, current_user: CurrentUser, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Subject).filter(Subject.id == subject_id))
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=404, detail="Subject not found")
    await db.delete(sub)
    await db.commit()
""",
    "classrooms.py": """
@router.put("/{classroom_id}", response_model=ClassroomResponse)
async def update_classroom(classroom_id: UUID, classroom_update: ClassroomUpdate, current_user: CurrentUser, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Classroom).filter(Classroom.id == classroom_id))
    cls = result.scalar_one_or_none()
    if not cls:
        raise HTTPException(status_code=404, detail="Classroom not found")
    update_data = classroom_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(cls, key, value)
    await db.commit()
    await db.refresh(cls)
    return cls

@router.delete("/{classroom_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_classroom(classroom_id: UUID, current_user: CurrentUser, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Classroom).filter(Classroom.id == classroom_id))
    cls = result.scalar_one_or_none()
    if not cls:
        raise HTTPException(status_code=404, detail="Classroom not found")
    await db.delete(cls)
    await db.commit()
"""
}

for filename, content in additions.items():
    filepath = os.path.join(endpoints_dir, filename)
    with open(filepath, "a") as f:
        f.write(content)
    print(f"Updated {filename}")
