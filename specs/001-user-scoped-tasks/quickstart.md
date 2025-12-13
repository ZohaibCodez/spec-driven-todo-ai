# Quickstart Guide: User-Scoped Tasks

## Prerequisites
- Python 3.12+
- FastAPI
- SQLModel
- Neon Serverless PostgreSQL database

## Setup

1. **Database Migration**: Run the database migration to create the User table and update the Task table:
   ```bash
   # Run alembic migration to add User model and user_id to Task model
   alembic revision --autogenerate -m "Add User model and user_id to Task"
   alembic upgrade head
   ```

2. **Environment Variables**: Ensure your `.env` file includes the database connection string:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

## API Usage

### Creating a User
Before creating tasks, you need to have a user in the system:
```bash
# This would typically be done through a user registration endpoint
# For now, you can create users directly in the database
```

### Creating Tasks
To create a task for a specific user:
```bash
curl -X POST "http://localhost:8000/api/1/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Task",
    "description": "Task description"
  }'
```

### Retrieving User's Tasks
To get all tasks for a specific user:
```bash
curl -X GET "http://localhost:8000/api/1/tasks"
```

### Updating a Task
To update a specific task for a user:
```bash
curl -X PUT "http://localhost:8000/api/1/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task",
    "description": "Updated description",
    "completed": true
  }'
```

### Deleting a Task
To delete a specific task for a user:
```bash
curl -X DELETE "http://localhost:8000/api/1/tasks/1"
```

## Key Features
- Each user's tasks are isolated from other users
- All endpoints require user_id in the path
- Proper foreign key constraints ensure data integrity
- Tasks are automatically deleted when their user is deleted