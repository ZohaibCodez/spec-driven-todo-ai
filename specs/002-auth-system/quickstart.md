# Quickstart Guide: End-to-End Authentication System

## Prerequisites

- Python 3.12+
- Node.js 18+ (for frontend development)
- PostgreSQL (or Neon Serverless PostgreSQL for cloud deployment)
- Redis (for rate limiting - optional, can use in-memory store)

## Backend Setup

### 1. Environment Configuration
```bash
# Create backend/.env file
BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://username:password@localhost:5432/auth_system
REDIS_URL=redis://localhost:6379/0  # Optional, for rate limiting
```

### 2. Install Dependencies
```bash
cd backend
pip install fastapi sqlmodel python-jose[cryptography] bcrypt passlib[bcrypt] slowapi python-multipart python-dotenv
```

### 3. Database Setup
```bash
# Create database tables
python -c "
from database import create_db_and_tables
create_db_and_tables()
"
```

### 4. Run the Backend Server
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install next react react-dom typescript @types/react @types/node
npm install better-auth
```

### 2. Environment Configuration
```bash
# Create frontend/.env.local file
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Run the Frontend Server
```bash
cd frontend
npm run dev
```

## API Endpoints

### Authentication Endpoints
- `POST /auth/signup` - Create a new user account
- `POST /auth/signin` - Authenticate user with credentials
- `POST /auth/logout` - End user session
- `POST /auth/refresh` - Refresh access token

### Protected Endpoints
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Development Workflow

### 1. Running Tests
```bash
# Backend tests
cd backend
python -m pytest tests/

# Frontend tests
cd frontend
npm test
```

### 2. API Documentation
- Backend API docs available at: http://localhost:8000/docs
- Backend ReDoc available at: http://localhost:8000/redoc

## Security Considerations

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Rate Limiting
- Authentication endpoints limited to 5 attempts per IP per minute
- Implemented using SlowAPI with Redis backend

### Token Configuration
- JWT tokens expire after 7 days
- Tokens use HS256 algorithm
- Secret key should be at least 32 characters

## Troubleshooting

### Common Issues
1. **Environment variables not loaded**: Ensure .env files are properly configured
2. **Database connection errors**: Verify DATABASE_URL is correct
3. **CORS issues**: Check backend CORS configuration matches frontend URL
4. **JWT validation failures**: Verify shared secrets match between frontend and backend