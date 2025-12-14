# End-to-End Authentication System with Better Auth and JWT

This feature implements a complete end-to-end authentication system with Better Auth on the frontend and JWT token validation on the backend. The system allows users to register, authenticate, maintain sessions, and securely access their data with proper user isolation.

## Architecture Overview

The authentication system follows a full-stack approach with:
- **Frontend**: Next.js 15+ with TypeScript, using Better Auth for user-facing authentication flows
- **Backend**: FastAPI with Python 3.12, validating JWT tokens on all protected API endpoints
- **Database**: Neon Serverless PostgreSQL for user and session data storage

## Key Features

### User Registration and Authentication (P1)
- User registration with email and password
- Secure password hashing using bcrypt with 12 rounds
- Password validation with complexity requirements (8+ chars, uppercase, lowercase, number, special char)
- JWT token generation with 7-day expiration

### Secure API Access (P1)
- JWT token validation on all protected endpoints
- User isolation - users can only access their own data
- 401/403 error responses for authentication failures
- Proper extraction of user identity from JWT token claims

### Session Management and Logout (P2)
- Secure logout functionality
- Token refresh capability (optional feature)
- Session persistence across page refreshes

## Implementation Details

### Backend Components

#### Models
- `User` model with email, hashed password, name, timestamps, email verification status, and active status
- Proper foreign key relationships to maintain data integrity

#### Security
- Passwords hashed using bcrypt with 12 rounds
- JWT tokens created and validated using python-jose
- Rate limiting implemented with SlowAPI (5 attempts per IP per minute)
- Authentication middleware to validate tokens on protected endpoints

#### Routes
- `/auth/signup` - Register new users
- `/auth/signin` - Authenticate users
- `/auth/logout` - End user sessions
- `/auth/refresh` - Refresh access tokens (optional feature)

### Frontend Components

#### Authentication Forms
- `SignupForm.tsx` - Registration form with validation
- `SigninForm.tsx` - Login form with validation
- Proper error handling and user feedback

#### State Management
- `AuthContext.tsx` - Centralized authentication state management
- `api.ts` - API client with authentication headers

#### User Interface
- `/signup` - Registration page
- `/signin` - Login page
- `UserMenu.tsx` - Header component showing authenticated user information and logout button

## Security Considerations

### Password Security
- Passwords are hashed using bcrypt with 12 rounds
- Password strength requirements enforced (minimum 8 characters with uppercase, lowercase, number, and special character)
- No plaintext passwords stored in the database

### Token Security
- JWT tokens expire after 7 days
- Tokens validated on every protected API request
- User isolation ensures users can only access their own data
- Rate limiting prevents brute force attacks

### Session Security
- Secure HTTP-only cookies for token storage (planned enhancement)
- Proper CORS configuration for frontend integration
- Logging of authentication events for security monitoring

## API Endpoints

### Authentication Endpoints
- `POST /auth/signup` - Register a new user
- `POST /auth/signin` - Authenticate user with credentials
- `POST /auth/logout` - End user session
- `POST /auth/refresh` - Refresh access token (optional feature)

### Protected Task Endpoints
- `GET /api/{user_id}/tasks` - Get tasks for authenticated user
- `POST /api/{user_id}/tasks` - Create task for authenticated user
- `GET /api/{user_id}/tasks/{task_id}` - Get specific task for user
- `PUT /api/{user_id}/tasks/{task_id}` - Update specific task for user
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete specific task for user
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle task completion for user

## Environment Configuration

### Backend (.env)
```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/todo_auth

# Authentication Configuration
BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-for-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days in minutes

# Rate Limiting
RATELIMIT_STORAGE_URL=memory://
RATELIMIT_DEFAULT=5/minute;100/hour
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_DEFAULT_SESSION_DAYS=30
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

## Testing

To test the authentication system:
1. Start the backend server: `uvicorn main:app --reload`
2. Navigate to `/signup` to create a new account
3. Verify account creation and automatic login
4. Test protected endpoints with valid/invalid tokens
5. Use the logout functionality to end sessions

## Dependencies

### Backend
- FastAPI
- SQLModel
- python-jose[cryptography]
- bcrypt
- passlib[bcrypt]
- slowapi
- python-multipart
- python-dotenv
- psycopg2-binary
- uvicorn[standard]

### Frontend
- Next.js 15+
- React 19+
- Better Auth
- TypeScript 5.0+
- Tailwind CSS 3.4+

## Error Handling

The system provides clear error messages for:
- Invalid credentials during sign-in
- Password strength requirements not met
- Email already registered during sign-up
- Rate limit exceeded
- Invalid/expired JWT tokens
- Insufficient permissions for resources