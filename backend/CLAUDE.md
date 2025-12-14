# Backend Guidelines - FastAPI + SQLModel

## Stack
- **Framework**: FastAPI
- **ORM**: SQLModel (combines SQLAlchemy + Pydantic)
- **Database**: Neon Serverless PostgreSQL
- **Auth**: JWT verification (tokens from Better Auth)
- **Validation**: Pydantic v2

## Project Structure
```
backend/
├── main.py              # FastAPI app entry point
├── database.py          # Database connection and session
├── models.py            # SQLModel database models
├── schemas.py           # Pydantic request/response schemas
├── routes/             # API route handlers
│   ├── tasks.py        # Task CRUD endpoints
│   └── users.py        # User management endpoints
├── auth/               # Authentication
│   ├── security.py     # JWT verification
│   └── middleware.py   # Auth middleware
├── services/           # Business logic
│   ├── task_service.py
│   └── user_service.py
├── alembic/            # Database migrations
└── requirements.txt    # Python dependencies
```

## API Conventions

### All Routes Under `/api`
```python
# main.py
app.include_router(tasks.router, prefix="/api", tags=["tasks"])
app.include_router(users.router, prefix="/api", tags=["users"])
```

### RESTful Endpoint Structure
```
GET    /api/{user_id}/tasks          # List all tasks for user
POST   /api/{user_id}/tasks          # Create new task
GET    /api/{user_id}/tasks/{id}     # Get task details
PUT    /api/{user_id}/tasks/{id}     # Update task
DELETE /api/{user_id}/tasks/{id}     # Delete task
PATCH  /api/{user_id}/tasks/{id}/complete  # Toggle completion
```

### Response Models
- Use Pydantic schemas for all requests/responses
- Return JSON responses
- Include timestamps (`created_at`, `updated_at`)
- Use proper HTTP status codes

## Database Patterns

### SQLModel Models
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    user_id: int = Field(foreign_key="user.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationship
    user: Optional["User"] = Relationship(back_populates="tasks")
```

### Database Sessions
```python
from database import get_session
from sqlmodel import Session

@router.get("/tasks")
def get_tasks(session: Session = Depends(get_session)):
    # Use session for queries
    pass
```

### Querying Patterns
```python
from sqlmodel import select

# Get all
statement = select(Task).where(Task.user_id == user_id)
tasks = session.exec(statement).all()

# Get one
task = session.get(Task, task_id)
if not task:
    raise HTTPException(status_code=404, detail="Task not found")

# Create
task = Task(**task_data.dict())
session.add(task)
session.commit()
session.refresh(task)

# Update
task.title = new_title
task.updated_at = datetime.utcnow()
session.add(task)
session.commit()

# Delete
session.delete(task)
session.commit()
```

## Authentication & Authorization

### JWT Verification
```python
from auth.security import verify_token, get_current_user

@router.get("/tasks")
def get_tasks(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # current_user is automatically extracted from JWT
    tasks = session.exec(
        select(Task).where(Task.user_id == current_user.id)
    ).all()
    return tasks
```

### User Scoping (CRITICAL)
**EVERY endpoint must filter by authenticated user:**

```python
# ❌ WRONG - returns all tasks
tasks = session.exec(select(Task)).all()

# ✅ CORRECT - returns only user's tasks
tasks = session.exec(
    select(Task).where(Task.user_id == current_user.id)
).all()
```

### Verify User Owns Resource
```python
@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Verify ownership
    if task.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    session.delete(task)
    session.commit()
    return {"message": "Task deleted"}
```

## Error Handling

### HTTP Exceptions
```python
from fastapi import HTTPException

# 400 Bad Request
raise HTTPException(status_code=400, detail="Invalid input")

# 401 Unauthorized
raise HTTPException(status_code=401, detail="Not authenticated")

# 403 Forbidden
raise HTTPException(status_code=403, detail="Not authorized")

# 404 Not Found
raise HTTPException(status_code=404, detail="Task not found")

# 500 Internal Server Error
raise HTTPException(status_code=500, detail="Server error")
```

### Validation Errors
Pydantic automatically validates request bodies and returns 422 errors.

## Request/Response Schemas

### Create Request
```python
from pydantic import BaseModel, Field

class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
```

### Response Model
```python
class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    completed: bool
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True  # Allows creation from ORM models
```

## Environment Variables

```python
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET = os.getenv("BETTER_AUTH_SECRET")
```

### Required Environment Variables
- `DATABASE_URL`: Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Shared JWT secret with frontend
- `CORS_ORIGINS`: Allowed origins (production)

## CORS Configuration

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Database Migrations (Alembic)

```bash
# Create migration
alembic revision --autogenerate -m "Add new field"

# Run migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Running the Server

```bash
# Development with auto-reload
uvicorn main:app --reload --port 8000

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Testing Checklist
- [ ] Endpoint requires authentication
- [ ] User can only access their own data
- [ ] Validation works (400 errors for invalid input)
- [ ] Returns proper status codes
- [ ] Error messages are clear
- [ ] Database transactions commit/rollback properly
- [ ] Timestamps update correctly
- [ ] Foreign key constraints enforced
- [ ] No SQL injection vulnerabilities

## Code Style

- Use type hints for all function parameters and return values
- Use docstrings for complex functions
- Keep route handlers thin (move logic to services)
- Use dependency injection (`Depends()`)
- Follow PEP 8 style guide
- Use f-strings for string formatting

## Security Best Practices

1. **Never expose passwords** in responses
2. **Validate all inputs** with Pydantic
3. **Verify JWT tokens** on protected routes
4. **Scope data by user** - check ownership
5. **Use environment variables** for secrets
6. **Hash passwords** with bcrypt
7. **Use HTTPS** in production
8. **Set CORS** to specific origins

## Import Order
```python
# 1. Standard library
from typing import Optional, List
from datetime import datetime

# 2. Third-party
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

# 3. Local
from database import get_session
from models import Task, User
from schemas import TaskCreate, TaskResponse
from auth.security import get_current_user
```
