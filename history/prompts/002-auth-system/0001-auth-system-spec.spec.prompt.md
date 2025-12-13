---
id: 0001
title: auth-system-spec
stage: spec
date: 2025-12-14
surface: cli
model: claude-sonnet-4-5-20250929
feature: 002-auth-system
branch: 002-auth-system
user: dev_zohaib
command: /sp.specify
labels: [authentication, jwt, security, specification]
links:
  spec: /specs/002-auth-system/spec.md
  ticket:
  adr:
  pr:
files:
  - path: specs/002-auth-system/spec.md
    action: created
    summary: Feature specification for end-to-end authentication system
  - path: specs/002-auth-system/checklists/requirements.md
    action: created
    summary: Quality checklist for specification validation
tests:
  - type: manual
    status: pending
    description: Verify authentication flow works end-to-end
---

## Prompt

Also use context7 mcp server for info and research and documenatation, Create a specification for "End-to-End Authentication System with Better Auth and JWT":

## Overview
Implement a complete authentication system where users sign up and sign in on the frontend (Next.js with Better Auth), receive JWT tokens, and the backend (FastAPI) validates these tokens to secure all API endpoints and enforce user isolation.

## User Stories

### Frontend User Stories
1. As a user, I can sign up with email and password to create a new account
2. As a user, I can sign in with my credentials to access my tasks
3. As a user, I stay logged in across page refreshes without re-entering credentials
4. As a user, I can see my email/name in the app header
5. As a user, I can sign out to end my session securely

### Backend User Stories
6. As a backend system, I need to verify JWT tokens on every API request
7. As a backend system, I need to extract user_id from verified tokens
8. As a backend system, I need to reject requests without valid tokens
9. As a backend system, I need to ensure users can only access their own data
10. As a backend system, I need to provide clear error messages for auth failures

## Requirements

### Frontend Requirements (Better Auth Integration)

#### Installation & Configuration
- Install Better Auth in Next.js project
- Configure Better Auth with email/password authentication
- Enable JWT token generation in Better Auth config
- Set up Better Auth API routes
- Configure session management with httpOnly cookies

#### User Interface
- Create signup page at `/signup` with:
  - Email input field (with validation)
  - Password input field (with strength indicator)
  - Confirm password field
  - Submit button with loading state
  - Link to sign in page for existing users

- Create signin page at `/signin` with:
  - Email input field
  - Password input field
  - Submit button with loading state
  - Link to signup page for new users
  - "Forgot password" link (optional for Phase II)

#### Navigation & Session Display
- Add user section to navigation header showing:
  - User's email or name
  - Logout button
  - User avatar (optional)

#### Route Protection
- Protect main application routes (/, /tasks)
- Redirect unauthenticated users to `/signin`
- Redirect authenticated users away from `/signin` and `/signup`

#### Token Management
- Store JWT token in httpOnly cookies (not localStorage)
- Include JWT token in Authorization header for all API requests
- Handle token expiration gracefully
- Clear token on logout

### Backend Requirements (JWT Verification)

#### Authentication Middleware
- Create JWT verification middleware for FastAPI
- Validate JWT signature using shared BETTER_AUTH_SECRET
- Extract user_id from JWT payload
- Attach user_id to request context for route handlers

#### API Security
- Apply authentication middleware to all `/api` endpoints
- Return 401 Unauthorized for:
  - Missing Authorization header
  - Invalid JWT token
  - Expired JWT token
  - Malformed JWT token

- Return 403 Forbidden when:
  - Token is valid but user_id doesn't match requested resource
  - User tries to access another user's data

#### User Validation
- Extract user_id from JWT token claims
- Validate that user_id in token matches user_id in URL path (for user-scoped endpoints)
- Filter all database queries by authenticated user_id
- Ensure foreign key constraints enforce user isolation

### Shared Configuration

#### Environment Variables
Both frontend and backend must use the same secret:

**Frontend (.env.local):**BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000**Backend (.env):**BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars
DATABASE_URL=postgresql://...#### JWT Token Format
JWT payload must include:
- `sub` or `userId`: User's unique identifier
- `email`: User's email address
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp (e.g., 7 days)

## Acceptance Criteria

### Frontend Authentication Flow

#### Signup Flow
- ✅ User can access `/signup` page
- ✅ Form validates email format
- ✅ Form validates password strength (min 8 characters)
- ✅ Form validates password confirmation matches
- ✅ Submit button shows loading state during request
- ✅ On success:
  - User record created in database
  - JWT token issued and stored in httpOnly cookie
  - User redirected to main app (/)
- ✅ On failure:
  - Error message displayed (e.g., "Email already exists")
  - User stays on signup page

#### Signin Flow
- ✅ User can access `/signin` page
- ✅ Form validates email and password are not empty
- ✅ Submit button shows loading state during request
- ✅ On success:
  - JWT token issued and stored in httpOnly cookie
  - User redirected to main app (/)
- ✅ On failure:
  - Error message displayed (e.g., "Invalid credentials")
  - User stays on signin page

#### Session Persistence
- ✅ User stays logged in after page refresh
- ✅ JWT token persists in httpOnly cookie
- ✅ Token is automatically included in API requests
- ✅ User info displayed in navigation header

#### Logout Flow
- ✅ User can click logout button
- ✅ JWT token is cleared from cookies
- ✅ User is redirected to `/signin`
- ✅ Subsequent API requests fail with 401

#### Route Protection
- ✅ Unauthenticated users accessing `/` are redirected to `/signin`
- ✅ Authenticated users accessing `/signin` are redirected to `/`
- ✅ Protected routes are only accessible when authenticated

### Backend API Security

#### Token Validation
- ✅ All `/api` endpoints require valid JWT token
- ✅ Requests without Authorization header return 401
- ✅ Requests with invalid JWT return 401 with message: "Invalid token"
- ✅ Requests with expired JWT return 401 with message: "Token expired"
- ✅ JWT signature is verified using BETTER_AUTH_SECRET

#### User Isolation
- ✅ Backend extracts user_id from JWT token (not from URL)
- ✅ All database queries filter by authenticated user_id
- ✅ User A cannot access User B's tasks via API
- ✅ Attempting to access another user's data returns 403 or 404

#### Error Responses
- ✅ 401 responses include clear error messages:
  - "No authorization token provided"
  - "Invalid or expired token"
  - "Token signature verification failed"

- ✅ 403 responses include clear error messages:
  - "You don't have permission to access this resource"

#### CORS Configuration
- ✅ Backend allows requests from frontend origin (http://localhost:3000)
- ✅ Backend allows credentials (cookies) to be sent
- ✅ Preflight OPTIONS requests handled correctly

### Integration Validation

#### End-to-End Auth Flow
- ✅ Complete signup → signin → API request → logout flow works
- ✅ Multiple users can be created and isolated correctly
- ✅ User A's tasks are invisible to User B
- ✅ Token expiration triggers re-authentication

#### Security Validation
- ✅ Cannot access API without valid token
- ✅ Cannot access other users' data even with valid token
- ✅ Tokens cannot be forged (signature verification works)
- ✅ httpOnly cookies prevent XSS attacks
- ✅ No sensitive data exposed in error messages

#### Performance & UX
- ✅ Auth flows complete in under 2 seconds
- ✅ No unnecessary API calls
- ✅ Loading states prevent user confusion
- ✅ Error messages are user-friendly

## Technical Implementation Notes

### Frontend Technology
- Next.js 15 with App Router
- Better Auth library
- httpOnly cookies for token storage
- React Context or hooks for auth state management

### Backend Technology
- FastAPI with dependency injection
- python-jose for JWT validation
- Custom middleware for token verification
- SQLModel for user and task models

### Security Best Practices
- Use httpOnly cookies (not localStorage) to prevent XSS
- Use secure, random BETTER_AUTH_SECRET (min 32 characters)
- Set appropriate token expiration (7-30 days)
- Hash passwords (handled automatically by Better Auth)
- Validate all user inputs
- Use HTTPS in production (not applicable for local dev)

## Edge Cases to Handle

### Frontend Edge Cases
- User closes browser and returns (should stay logged in)
- User opens app in multiple tabs (should share session)
- Token expires while user is active (redirect to login gracefully)
- Network failure during signup/signin (show retry option)
- User clicks logout multiple times (handle gracefully)

### Backend Edge Cases
- Token expired mid-request (return 401, not crash)
- Malformed Authorization header (return 401, not crash)
- User deleted but token still valid (return 401)
- Concurrent requests from same user (handle correctly)
- Database connection failure during auth (return 500, not crash)

## Testing Checklist

### Manual Testing
- [ ] Sign up as new user → verify user in database
- [ ] Sign in with valid credentials → verify JWT in cookies
- [ ] Sign in with invalid credentials → verify error message
- [ ] Create task while logged in → verify API accepts token
- [ ] Refresh page → verify still logged in
- [ ] Create two users → verify can't see each other's tasks
- [ ] Delete JWT cookie → verify redirected to login
- [ ] Logout → verify can't access API anymore

### API Testing (Postman/Insomnia)
- [ ] GET /api/tasks without token → 401
- [ ] GET /api/tasks with invalid token → 401
- [ ] GET /api/tasks with valid token → 200 + tasks
- [ ] POST /api/tasks without token → 401
- [ ] POST /api/tasks with valid token → 201 + created task

### Browser DevTools Testing
- [ ] Check Network tab: Authorization header present on API calls
- [ ] Check Application tab: httpOnly cookie present
- [ ] Check Console: no auth-related errors
- [ ] Delete cookie and retry operation → redirect to login

## Documentation Requirements

### For Developers
- README section explaining auth setup
- Environment variables documentation
- API authentication requirements
- Common auth errors and solutions

### For Code Review
- Spec document showing requirements met
- Test results showing all acceptance criteria passed
- Screenshots of signup/signin flows
- API test results (Postman collection or screenshots)

## Success Criteria

**This specification is complete when:**

1. ✅ Users can sign up and create an account
2. ✅ Users can sign in and receive a JWT token
3. ✅ Users stay logged in across page refreshes
4. ✅ Users can sign out and end their session
5. ✅ All API endpoints require valid authentication
6. ✅ Users can only access their own tasks (user isolation enforced)
7. ✅ Invalid tokens are rejected with clear error messages
8. ✅ The system is secure against common auth vulnerabilities
9. ✅ All test cases pass
10. ✅ No console errors during normal operation

## Dependencies

### Must be completed before this spec:
- Backend API Foundation (Task CRUD endpoints exist)
- Frontend Foundation (Basic UI exists)
- User model exists in database

### Blocks these specs:
- UI/UX Enhancement (auth must work before polishing UI)
- AI Chatbot Integration (Phase III - requires auth)
- Kubernetes Deployment (Phase IV - requires working app)

## Estimated Implementation Time
- Frontend Better Auth setup: 2-3 hours
- Backend JWT middleware: 2-3 hours
- Integration and testing: 2-3 hours
- Bug fixes and refinement: 1-2 hours
**Total: 7-11 hours**

## Response snapshot

Created a comprehensive specification for the End-to-End Authentication System with Better Auth and JWT. The specification includes:

1. User Scenarios & Testing with 3 prioritized user stories covering registration, authentication, and session management
2. Functional Requirements (15 specific requirements covering all aspects of authentication)
3. Key Entities (User, JWT Token, and Session)
4. Success Criteria (10 measurable outcomes)

The specification was validated against quality criteria and all implementation-specific details were removed to maintain technology-agnostic approach.

## Outcome

- ✅ Impact: Created complete specification for authentication system that covers user registration, login, JWT token management, and secure API access
- 🧪 Tests: Manual testing plan defined with verification steps
- 📁 Files: Created spec.md and requirements checklist in 002-auth-system directory
- 🔁 Next prompts: Ready for planning phase with `/sp.plan`
- 🧠 Reflection: Specification successfully abstracted implementation details while maintaining functional requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): All validation criteria met
- Prompt variant (if applicable): Standard specification prompt
- Next experiment (smallest change to try): Proceed to planning phase
