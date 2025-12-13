# Backend API - Task Management

This is a FastAPI-based backend service for managing tasks with CRUD operations.

## Features

- Create, Read, Update, Delete (CRUD) operations for tasks
- Toggle task completion status
- RESTful API endpoints
- PostgreSQL database integration
- Automatic timestamp generation
- Input validation and error handling

## Tech Stack

- Python 3.12
- FastAPI
- SQLModel ORM
- Neon Serverless PostgreSQL
- Uvicorn ASGI server

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Configure environment variables in `.env`:
   - `DATABASE_URL`: PostgreSQL connection string
   - `SECRET_KEY`: Secret key for security
   - `DEBUG`: Debug mode (true/false)

3. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion status

## Project Structure

```
backend/
├── main.py              # FastAPI app entry point
├── models.py            # SQLModel database models
├── database.py          # Database connection
├── routes/
│   └── tasks.py         # Task CRUD endpoints
├── schemas.py           # Pydantic request/response models
├── .env                 # Environment variables
├── requirements.txt     # Python dependencies
└── README.md            # Project documentation
```