from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from database import get_session
from models import Task, User
from auth.security import get_current_user_id
import schemas

router = APIRouter()


@router.post("/{user_id}/tasks", response_model=schemas.TaskResponse, status_code=201)
def create_task(
    user_id: int = Path(..., description="User ID from URL"),
    task_data: schemas.TaskCreate = ...,
    current_user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """Create a new task for the authenticated user."""
    # Verify user_id in URL matches authenticated user
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to create tasks for this user")
    
    # Create a new task instance
    task = Task(
        title=task_data.title,
        description=task_data.description,
        completed=False,
        user_id=current_user_id
    )

    # Add to session and commit
    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.get("/{user_id}/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(
    user_id: int = Path(..., description="User ID from URL"),
    status: Optional[str] = Query("all", description="Filter by status: all, pending, completed"),
    sort: Optional[str] = Query("created", description="Sort by: created, title, updated"),
    order: Optional[str] = Query("desc", description="Order: asc, desc"),
    current_user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """List all tasks for the authenticated user."""
    # Verify user_id in URL matches authenticated user
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view tasks for this user")
    
    # Base query: only tasks for this user
    statement = select(Task).where(Task.user_id == current_user_id)
    
    # Apply status filter
    if status == "pending":
        statement = statement.where(Task.completed == False)
    elif status == "completed":
        statement = statement.where(Task.completed == True)
    
    # Apply sorting
    if sort == "title":
        statement = statement.order_by(Task.title.desc() if order == "desc" else Task.title.asc())
    elif sort == "updated":
        statement = statement.order_by(Task.updated_at.desc() if order == "desc" else Task.updated_at.asc())
    else:  # Default to created_at
        statement = statement.order_by(Task.created_at.desc() if order == "desc" else Task.created_at.asc())
    
    tasks = session.exec(statement).all()
    return tasks


@router.get("/{user_id}/tasks/{task_id}", response_model=schemas.TaskResponse)
def get_task(
    user_id: int = Path(..., description="User ID from URL"),
    task_id: int = Path(..., description="Task ID"),
    current_user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """Get a specific task for the authenticated user."""
    # Verify user_id in URL matches authenticated user
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view tasks for this user")
    
    # Query for the task
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Verify task belongs to user
    if task.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this task")

    return task


@router.put("/{user_id}/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(
    user_id: int = Path(..., description="User ID from URL"),
    task_id: int = Path(..., description="Task ID"),
    task_data: schemas.TaskUpdate = ...,
    current_user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """Update a task for the authenticated user."""
    # Verify user_id in URL matches authenticated user
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update tasks for this user")
    
    # Get the existing task
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Verify task belongs to user
    if task.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")

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

    return task


@router.delete("/{user_id}/tasks/{task_id}", status_code=200)
def delete_task(
    user_id: int = Path(..., description="User ID from URL"),
    task_id: int = Path(..., description="Task ID"),
    current_user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """Delete a task for the authenticated user."""
    # Verify user_id in URL matches authenticated user
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete tasks for this user")
    
    # Get the existing task
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Verify task belongs to user
    if task.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this task")

    # Delete the task
    session.delete(task)
    session.commit()

    return {"message": "Task deleted successfully"}


@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=schemas.TaskResponse)
def toggle_task_completion(
    user_id: int = Path(..., description="User ID from URL"),
    task_id: int = Path(..., description="Task ID"),
    current_user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """Toggle task completion status for the authenticated user."""
    # Verify user_id in URL matches authenticated user
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update tasks for this user")
    
    # Get the existing task
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Verify task belongs to user
    if task.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")

    # Toggle the completion status
    task.completed = not task.completed

    # Update the updated_at timestamp
    task.updated_at = datetime.utcnow()

    # Commit changes
    session.add(task)
    session.commit()
    session.refresh(task)

    return task
