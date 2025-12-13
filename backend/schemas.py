from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    email: str
    name: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    user_id: int  # Required for creating tasks

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