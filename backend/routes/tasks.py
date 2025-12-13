from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session
from typing import List
from datetime import datetime
from database import get_session
from models import Task
import schemas
from services.task_service import TaskService
from auth.middleware import require_valid_token, validate_user_owns_resource

router = APIRouter()

# Original endpoints (for backward compatibility and system-wide operations)
@router.post("/tasks", response_model=schemas.TaskResponse, status_code=201)
def create_task(task_data: schemas.TaskCreate, session: Session = Depends(get_session)):
    """
    Create a new task for a user. This endpoint requires user_id to be specified in the request body.
    """
    # Create task for user using the service
    task = TaskService.create_task_for_user(task_data, session)

    # Convert to response model
    response = schemas.TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        created_at=task.created_at,
        updated_at=task.updated_at,
        user_id=task.user_id
    )

    return response

@router.get("/tasks/{task_id}", response_model=schemas.TaskResponse)
def get_task(task_id: int, session: Session = Depends(get_session)):
    """
    Get a specific task. This endpoint retrieves any task regardless of user ownership.
    For user-scoped access, use the /{user_id}/tasks endpoints.
    NOTE: This endpoint allows access to any task and should be used carefully.
    """
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
        updated_at=task.updated_at,
        user_id=task.user_id
    )

    return response

@router.get("/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(session: Session = Depends(get_session)):
    """
    Get all tasks. This endpoint retrieves all tasks in the system.
    For user-scoped access, use the /{user_id}/tasks endpoints.
    """
    from sqlmodel import select
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
            updated_at=task.updated_at,
            user_id=task.user_id
        )
        responses.append(response)

    return responses

@router.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task_data: schemas.TaskUpdate, session: Session = Depends(get_session)):
    """
    Update a specific task. This endpoint updates any task regardless of user ownership.
    For user-scoped access, use the /{user_id}/tasks endpoints.
    """
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
        updated_at=task.updated_at,
        user_id=task.user_id
    )

    return response

@router.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, session: Session = Depends(get_session)):
    """
    Delete a specific task. This endpoint deletes any task regardless of user ownership.
    For user-scoped access, use the /{user_id}/tasks endpoints.
    """
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
    """
    Toggle completion status of a specific task. This endpoint affects any task regardless of user ownership.
    For user-scoped access, use the /{user_id}/tasks endpoints.
    """
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
        updated_at=task.updated_at,
        user_id=task.user_id
    )

    return response

# New user-scoped endpoints (User Story 3)
@router.get("/{user_id}/tasks", response_model=List[schemas.TaskResponse])
def get_user_tasks(user_id: int, request: Request, session: Session = Depends(get_session)):
    """
    Get all tasks for a specific user.
    """
    # Validate that the user is authenticated
    token_data = require_valid_token(request)

    # Validate that the user_id in the token matches the requested user_id
    if token_data.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to access this resource"
        )

    # Get tasks for the specified user
    tasks = TaskService.get_tasks_for_user(user_id, session)

    # Convert to response models
    responses = []
    for task in tasks:
        response = schemas.TaskResponse(
            id=task.id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            created_at=task.created_at,
            updated_at=task.updated_at,
            user_id=task.user_id
        )
        responses.append(response)

    return responses

@router.post("/{user_id}/tasks", response_model=schemas.TaskResponse, status_code=201)
def create_user_task(user_id: int, task_data: schemas.TaskCreate, request: Request, session: Session = Depends(get_session)):
    """
    Create a new task for a specific user.
    """
    # Validate that the user is authenticated
    token_data = require_valid_token(request)

    # Verify the user_id in the path matches the one in the request body and token
    if task_data.user_id != user_id or token_data.user_id != user_id:
        raise HTTPException(status_code=403, detail="You don't have permission to create tasks for this user")

    # Create task for user using the service
    task = TaskService.create_task_for_user(task_data, session)

    # Convert to response model
    response = schemas.TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        created_at=task.created_at,
        updated_at=task.updated_at,
        user_id=task.user_id
    )

    return response

@router.get("/{user_id}/tasks/{task_id}", response_model=schemas.TaskResponse)
def get_user_task(user_id: int, task_id: int, request: Request, session: Session = Depends(get_session)):
    """
    Get a specific task for a specific user.
    """
    # Validate that the user is authenticated
    token_data = require_valid_token(request)

    # Validate that the user_id in the token matches the requested user_id
    if token_data.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to access this resource"
        )

    # Get the specific task for the user
    task = TaskService.get_task_for_user(task_id, user_id, session)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found or does not belong to user")

    # Convert to response model
    response = schemas.TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        created_at=task.created_at,
        updated_at=task.updated_at,
        user_id=task.user_id
    )

    return response

@router.put("/{user_id}/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_user_task(user_id: int, task_id: int, task_data: schemas.TaskUpdate, request: Request, session: Session = Depends(get_session)):
    """
    Update a specific task for a specific user.
    """
    # Validate that the user is authenticated
    token_data = require_valid_token(request)

    # Validate that the user_id in the token matches the requested user_id
    if token_data.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to access this resource"
        )

    # Update the task for the user
    updated_task = TaskService.update_task_for_user(task_id, user_id, task_data, session)

    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found or does not belong to user")

    # Convert to response model
    response = schemas.TaskResponse(
        id=updated_task.id,
        title=updated_task.title,
        description=updated_task.description,
        completed=updated_task.completed,
        created_at=updated_task.created_at,
        updated_at=updated_task.updated_at,
        user_id=updated_task.user_id
    )

    return response

@router.delete("/{user_id}/tasks/{task_id}", status_code=204)
def delete_user_task(user_id: int, task_id: int, request: Request, session: Session = Depends(get_session)):
    """
    Delete a specific task for a specific user.
    """
    # Validate that the user is authenticated
    token_data = require_valid_token(request)

    # Validate that the user_id in the token matches the requested user_id
    if token_data.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to access this resource"
        )

    # Delete the task for the user
    deleted = TaskService.delete_task_for_user(task_id, user_id, session)

    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found or does not belong to user")

    # Return 204 No Content
    return

@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=schemas.TaskResponse)
def toggle_user_task_completion(user_id: int, task_id: int, request: Request, session: Session = Depends(get_session)):
    """
    Toggle completion status of a specific task for a specific user.
    """
    # Validate that the user is authenticated
    token_data = require_valid_token(request)

    # Validate that the user_id in the token matches the requested user_id
    if token_data.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to access this resource"
        )

    # Toggle the completion status for the user's task
    updated_task = TaskService.toggle_task_completion_for_user(task_id, user_id, session)

    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found or does not belong to user")

    # Convert to response model
    response = schemas.TaskResponse(
        id=updated_task.id,
        title=updated_task.title,
        description=updated_task.description,
        completed=updated_task.completed,
        created_at=updated_task.created_at,
        updated_at=updated_task.updated_at,
        user_id=updated_task.user_id
    )

    return response