from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from datetime import datetime
from backend.database import get_session
from backend.models import Task
from backend import schemas

router = APIRouter()

@router.post("/tasks", response_model=schemas.TaskResponse, status_code=201)
def create_task(task_data: schemas.TaskCreate, session: Session = Depends(get_session)):
    # Create a new task instance
    task = Task(
        title=task_data.title,
        description=task_data.description,
        completed=task_data.completed
    )

    # Add to session and commit
    session.add(task)
    session.commit()
    session.refresh(task)

    # Convert to response model
    response = schemas.TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        created_at=task.created_at,
        updated_at=task.updated_at
    )

    return response

@router.get("/tasks/{task_id}", response_model=schemas.TaskResponse)
def get_task(task_id: int, session: Session = Depends(get_session)):
    # Query for the task
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Convert to response model
    response = schemas.TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        created_at=task.created_at,
        updated_at=task.updated_at
    )

    return response

@router.get("/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(session: Session = Depends(get_session)):
    # Query for all tasks
    statement = select(Task)
    tasks = session.exec(statement).all()

    # Convert to response models
    responses = []
    for task in tasks:
        response = schemas.TaskResponse(
            id=task.id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            created_at=task.created_at,
            updated_at=task.updated_at
        )
        responses.append(response)

    return responses

@router.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task_data: schemas.TaskUpdate, session: Session = Depends(get_session)):
    # Get the existing task
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update task fields if provided
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.completed is not None:
        task.completed = task_data.completed

    # Update the updated_at timestamp
    task.updated_at = datetime.utcnow()

    # Commit changes
    session.add(task)
    session.commit()
    session.refresh(task)

    # Convert to response model
    response = schemas.TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        created_at=task.created_at,
        updated_at=task.updated_at
    )

    return response

@router.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, session: Session = Depends(get_session)):
    # Get the existing task
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Delete the task
    session.delete(task)
    session.commit()

    # Return 204 No Content
    return

@router.patch("/tasks/{task_id}/complete", response_model=schemas.TaskResponse)
def toggle_task_completion(task_id: int, session: Session = Depends(get_session)):
    # Get the existing task
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Toggle the completion status
    task.completed = not task.completed

    # Update the updated_at timestamp
    task.updated_at = datetime.utcnow()

    # Commit changes
    session.add(task)
    session.commit()
    session.refresh(task)

    # Convert to response model
    response = schemas.TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        created_at=task.created_at,
        updated_at=task.updated_at
    )

    return response