# Quickstart Guide: Backend API Foundation

## Prerequisites
- Python 3.12 or higher
- UV package manager
- Neon PostgreSQL database account

## Setup Instructions

### 1. Clone and Navigate
```bash
cd /path/to/project
cd backend
```

### 2. Install Dependencies
```bash
uv venv  # Create virtual environment
source .venv/bin/activate  # Activate virtual environment
uv pip install fastapi sqlmodel uvicorn python-dotenv psycopg2-binary pytest
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname
SECRET_KEY=your-secret-key-here
DEBUG=true
```

### 4. Initialize Database
```bash
# The application will automatically create tables on startup
# Or manually run database migrations if implemented
```

### 5. Run the Application
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### List All Tasks
- `GET /api/tasks`
- Returns: Array of task objects

### Create Task
- `POST /api/tasks`
- Request Body: `{ "title": "Task title", "description": "Task description", "completed": false }`
- Returns: Created task object

### Get Task by ID
- `GET /api/tasks/{id}`
- Returns: Single task object

### Update Task
- `PUT /api/tasks/{id}`
- Request Body: `{ "title": "Updated title", "description": "Updated description", "completed": true }`
- Returns: Updated task object

### Delete Task
- `DELETE /api/tasks/{id}`
- Returns: 204 No Content

### Toggle Task Completion
- `PATCH /api/tasks/{id}/complete`
- Returns: Updated task object with toggled completion status

## Testing
```bash
# Run unit tests
python -m pytest tests/unit/

# Run integration tests
python -m pytest tests/integration/

# Run all tests
python -m pytest
```