from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str
    name: Optional[str] = None

class UserCreate(UserBase):
    email: str
    name: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    email_verified: bool
    is_active: bool

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    completed: bool
    created_at: datetime
    updated_at: datetime
    user_id: int

class SignupRequest(BaseModel):
    email: str
    password: str  # Must meet complexity requirements (minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
    confirm_password: str
    name: Optional[str] = None

class SigninRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    user: UserResponse
    access_token: str
    token_type: str
    expires_in: int

class ErrorResponse(BaseModel):
    error: str
    message: str
    details: Optional[dict] = None