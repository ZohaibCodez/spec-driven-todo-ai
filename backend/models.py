from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    """
    User model representing a user in the system.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, min_length=1, max_length=255)  # Email must be unique
    password: str  # Hashed password using bcrypt with 12 rounds
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    email_verified: bool = Field(default=False)
    is_active: bool = Field(default=True)

    # Relationship to tasks
    tasks: list["Task"] = Relationship(back_populates="user")

class Task(SQLModel, table=True):
    """
    Task model representing a task in the system.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    user_id: int = Field(foreign_key="user.id", nullable=False)  # Foreign key to User

    # Relationship to user
    user: Optional["User"] = Relationship(back_populates="tasks")