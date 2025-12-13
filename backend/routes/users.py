from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from database import get_session
from models import User
from schemas import UserCreate, UserResponse
from services.user_service import UserService

router = APIRouter()

@router.post("/users", response_model=UserResponse, status_code=201)
def create_user(user_data: UserCreate, session: Session = Depends(get_session)):
    """
    Create a new user in the system.
    """
    try:
        # Create the user using the service
        user = UserService.create_user(user_data, session)

        # Convert to response model
        response = UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at
        )

        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: int, session: Session = Depends(get_session)):
    """
    Delete a user by ID. This will also delete all tasks associated with the user
    due to the cascade delete relationship.
    """
    # Delete the user using the service
    deleted = UserService.delete_user_by_id(user_id, session)

    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")

    # Return 204 No Content
    return