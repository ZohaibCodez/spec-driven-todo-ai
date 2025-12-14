# Feature Specification: Integration Validation & End-to-End Testing

**Feature Branch**: `001-integration-validation`
**Created**: 2025-12-14
**Status**: Draft
**Input**: User description: "Create a specification for \"Phase II Integration Validation & End-to-End Testing\":

## Purpose
Validate that all separately implemented features (Backend API, Frontend UI, Authentication) are correctly integrated and working together as a complete system.

## User Stories

1. As a new user, I can sign up, and my user record is created in the database
2. As a returning user, I can sign in and receive a valid JWT token
3. As an authenticated user, I can add a task and it's stored with my user_id
4. As an authenticated user, I can see only MY tasks (not other users' tasks)
5. As an authenticated user, I can update my tasks
6. As an authenticated user, I can delete my tasks
7. As an authenticated user, I can mark tasks complete/incomplete
8. As an authenticated user, if my token expires, I'm redirected to login
9. As an authenticated user, I can sign out and my session is cleared

## Integration Points to Validate

### 1. Frontend ↔ Backend Connection
- Frontend API client can reach backend endpoints
- CORS is configured correctly
- Request/response formats match expectations
- Error handling works across the boundary

### 2. Authentication Flow
- Better Auth (frontend) issues JWT tokens correctly
- JWT tokens are stored securely in cookies
- Frontend includes JWT token in all API requests
- Backend validates JWT tokens on every request
- Token expiration is handled gracefully
- Refresh token mechanism works (if implemented)

### 3. User Isolation
- Backend filters tasks by authenticated user_id
- Users cannot access other users' tasks
- API returns 401 for missing/invalid tokens
- API returns 403 if user_id in URL doesn't match token

### 4. Database Consistency
- User records are created correctly during signup
- Tasks are associated with correct user_id
- Foreign key constraints are enforced
- Database schema matches both frontend and backend expectations

### 5. Environment Configuration
- BETTER_AUTH_SECRET is shared between frontend and backend
- DATABASE_URL is correctly configured
- All required environment variables are set
- Frontend knows correct backend URL
- Backend allows frontend origin in CORS

## Validation Test Cases

### Test Case 1: New User Signup Flow
**Steps:**
1. Navigate to /signup
2. Enter email and password
3. Submit form
4. Verify user is created in database
5. Verify user is redirected to main app
6. Verify JWT token is issued

**Expected Results:**
- ✅ User record exists in database
- ✅ JWT token is stored in cookies
- ✅ User is redirected to /tasks or main app
- ✅ No console errors

### Test Case 2: User Login Flow
**Steps:**
1. Navigate to /signin
2. Enter valid credentials
3. Submit form
4. Verify JWT token is issued
5. Verify user is redirected to main app

**Expected Results:**
- ✅ JWT token is stored in cookies
- ✅ User is redirected successfully
- ✅ Backend accepts the token

### Test Case 3: Create Task (Authenticated)
**Steps:**
1. Login as User A
2. Create a new task with title and description
3. Verify API request includes JWT token
4. Verify backend receives and validates token
5. Verify task is saved with User A's user_id

**Expected Results:**
- ✅ Task appears in frontend immediately
- ✅ Task is in database with correct user_id
- ✅ API returns 201 status
- ✅ Response includes created task data

### Test Case 4: View Tasks (User Isolation)
**Steps:**
1. Login as User A
2. Create 3 tasks
3. Logout
4. Login as User B
5. Create 2 tasks
6. Verify User B only sees their 2 tasks

**Expected Results:**
- ✅ User B sees only their own tasks
- ✅ User B cannot see User A's tasks
- ✅ API filtered correctly by user_id

### Test Case 5: Update Task (Authenticated)
**Steps:**
1. Login as User A
2. Create a task
3. Edit the task title
4. Verify update request includes JWT token
5. Verify backend validates token and user ownership

**Expected Results:**
- ✅ Task updates in frontend immediately
- ✅ Database reflects the change
- ✅ API returns updated task data

### Test Case 6: Delete Task (Authenticated)
**Steps:**
1. Login as User A
2. Create a task
3. Delete the task
4. Verify delete request includes JWT token

**Expected Results:**
- ✅ Task disappears from frontend
- ✅ Task is deleted from database
- ✅ API returns 204 status

### Test Case 7: Mark Task Complete (Authenticated)
**Steps:**
1. Login as User A
2. Create a task (status: pending)
3. Click complete checkbox
4. Verify PATCH request with JWT token

**Expected Results:**
- ✅ Checkbox updates immediately
- ✅ Database shows completed: true
- ✅ API returns updated task

### Test Case 8: Unauthorized Access
**Steps:**
1. Open browser DevTools
2. Delete JWT token from cookies
3. Try to create a task

**Expected Results:**
- ✅ API returns 401 Unauthorized
- ✅ Frontend redirects to /signin
- ✅ User sees \"Please login\" message

### Test Case 9: Token Expiration
**Steps:**
1. Login as User A
2. Wait for token to expire (or manually expire it)
3. Try to perform any action

**Expected Results:**
- ✅ API returns 401 Unauthorized
- ✅ Frontend detects expired token
- ✅ User is redirected to /signin

### Test Case 10: Cross-User Security
**Steps:**
1. Login as User A
2. Get task_id of User A's task
3. Logout and login as User B
4. Try to access User A's task via direct API call

**Expected Results:**
- ✅ API returns 403 Forbidden or 404 Not Found
- ✅ User B cannot access User A's task
- ✅ Backend validates user ownership

## Integration Issues to Check

### Backend Issues
- [ ] CORS configuration allows frontend origin
- [ ] JWT secret matches frontend secret
- [ ] All endpoints require authentication
- [ ] User_id is extracted from JWT token correctly
- [ ] Database queries filter by user_id
- [ ] Error responses are consistent (401 vs 403)
- [ ] Database connection is stable

### Frontend Issues
- [ ] API client includes JWT token in headers
- [ ] API client handles 401 responses (redirect to login)
- [ ] API client handles network errors gracefully
- [ ] Better Auth is configured with correct backend URL
- [ ] JWT tokens are stored in httpOnly cookies
- [ ] Token refresh logic works (if implemented)
- [ ] Forms show validation errors from backend

### Database Issues
- [ ] User table exists with correct schema
- [ ] Tasks table has user_id foreign key
- [ ] Foreign key constraints are enforced
- [ ] Indexes exist on user_id column
- [ ] Connection string is correct
- [ ] Database is accessible from backend

### Environment Issues
- [ ] All .env files have required variables
- [ ] BETTER_AUTH_SECRET is same in frontend and backend
- [ ] DATABASE_URL is correct
- [ ] Frontend knows backend URL (not hardcoded localhost)
- [ ] No secrets committed to git

## Acceptance Criteria

### Functional Integration
- ✅ All 10 test cases pass without errors
- ✅ Users can sign up, login, and logout successfully
- ✅ Authenticated users can perform all CRUD operations
- ✅ User isolation is enforced (users only see their tasks)
- ✅ Token validation works on every request

### Error Handling
- ✅ Invalid credentials show appropriate error message
- ✅ Expired tokens trigger re-authentication
- ✅ Network errors show user-friendly messages
- ✅ Backend validation errors display in frontend
- ✅ Database errors are caught and logged

### Security
- ✅ JWT tokens are httpOnly cookies (not localStorage)
- ✅ All API endpoints require valid authentication
- ✅ Users cannot access other users' data
- ✅ Passwords are hashed (handled by Better Auth)
- ✅ No sensitive data in browser console

### Performance
- ✅ API responses are fast (< 500ms)
- ✅ Frontend doesn't make unnecessary API calls
- ✅ Database queries are optimized with indexes
- ✅ No console errors or warnings

## Deliverables

1. **Integration Test Report** - Document showing all test cases passed
2. **Environment Variables Checklist** - List of all required env vars
3. **Known Issues Log** - Any integration bugs found and their status
4. **API Contract Documentation** - Confirm frontend and backend agree on:
   - Endpoint URLs
   - Request/response formats
   - Error codes and messages
   - Authentication header format

## Tools for Testing

- Browser DevTools (Network tab, Console, Application/Cookies)
- Postman or Insomnia for API testing
- Database client (pgAdmin, TablePlus) to verify data
- Multiple browser profiles for testing multiple users"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete User Registration Flow (Priority: P1)

As a new user, I can sign up with my email and password, and my user record is created in the database with proper authentication setup.

**Why this priority**: This is the foundation of the entire system - without user registration, no other functionality can be accessed by new users.

**Independent Test**: Can be fully tested by navigating to the signup page, entering valid credentials, and verifying that a user account is created in the database with a valid JWT token issued to the client.

**Acceptance Scenarios**:

1. **Given** user is on the signup page, **When** user enters valid email and password and submits the form, **Then** a user account is created in the database and the user is redirected to the main application with a valid JWT token
2. **Given** user enters invalid email format, **When** user submits the form, **Then** appropriate validation errors are shown without creating an account

---

### User Story 2 - Complete User Authentication Flow (Priority: P1)

As a returning user, I can sign in with my credentials and receive a valid JWT token that grants access to authenticated functionality.

**Why this priority**: Essential for returning users to access their data and use the system. Without authentication, no protected functionality can be accessed.

**Independent Test**: Can be fully tested by navigating to the login page, entering valid credentials, and verifying that a valid JWT token is issued and the user is granted access to protected functionality.

**Acceptance Scenarios**:

1. **Given** user has a valid account and is on the login page, **When** user enters correct credentials and submits, **Then** a valid JWT token is issued and user is redirected to the main application
2. **Given** user enters incorrect credentials, **When** user attempts to log in, **Then** appropriate error message is displayed and no token is issued

---

### User Story 3 - Create and Manage Personal Tasks (Priority: P2)

As an authenticated user, I can add tasks that are stored with my user_id, and I can only see and manage my own tasks, not other users' tasks.

**Why this priority**: This is the core functionality of the todo application - users need to be able to create and manage their personal tasks securely.

**Independent Test**: Can be fully tested by logging in as a user, creating tasks, and verifying that tasks are properly associated with the user's account and only visible to that user.

**Acceptance Scenarios**:

1. **Given** user is authenticated, **When** user creates a new task, **Then** the task is saved with the user's user_id and appears in their task list
2. **Given** multiple users exist with their own tasks, **When** each user views their tasks, **Then** each user only sees their own tasks and not tasks belonging to other users

---

### User Story 4 - Complete Task Lifecycle Operations (Priority: P2)

As an authenticated user, I can perform all CRUD operations on my tasks including creating, reading, updating, deleting, and marking tasks as complete/incomplete.

**Why this priority**: Provides the complete task management experience that users expect from a todo application.

**Independent Test**: Can be fully tested by logging in as a user and performing all task operations (create, read, update, delete, mark complete/incomplete) to verify the full lifecycle works properly.

**Acceptance Scenarios**:

1. **Given** user has created tasks, **When** user updates a task, **Then** the task is updated in both the frontend display and the database
2. **Given** user has tasks, **When** user deletes a task, **Then** the task is removed from both the frontend and the database
3. **Given** user has an incomplete task, **When** user marks it as complete, **Then** the task status is updated in both the frontend and the database

---

### User Story 5 - Session Management and Security (Priority: P3)

As an authenticated user, I can securely manage my session including signing out, and if my token expires, I'm properly redirected to login with appropriate security measures in place.

**Why this priority**: Ensures security and proper session management, preventing unauthorized access and ensuring proper cleanup of user sessions.

**Independent Test**: Can be fully tested by logging in, performing actions, then testing token expiration and logout functionality to verify proper security measures.

**Acceptance Scenarios**:

1. **Given** user has a valid session, **When** user token expires or is removed, **Then** user is redirected to the login page with appropriate security measures
2. **Given** user is logged in, **When** user signs out, **Then** session is properly cleared and user cannot access protected functionality without re-authenticating

---

### Edge Cases

- What happens when a user tries to access another user's tasks directly via URL or API call? The system should return 403 Forbidden or 404 Not Found.
- How does the system handle concurrent sessions across multiple devices? Each session should be managed independently.
- What happens when the database connection fails during authentication? The system should provide appropriate error handling and not expose sensitive information.
- How does the system handle malformed JWT tokens? The system should reject invalid tokens and not grant unauthorized access.
- What happens when network connectivity is lost during a task operation? The system should handle network errors gracefully and provide appropriate feedback to the user.

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users via JWT tokens with proper validation on all protected endpoints
- **FR-002**: System MUST ensure user data isolation by filtering tasks based on authenticated user_id
- **FR-003**: System MUST provide complete CRUD operations for tasks with proper authentication and authorization
- **FR-004**: System MUST validate all API requests for proper authentication before processing
- **FR-005**: System MUST handle token expiration and invalidation with appropriate user redirection
- **FR-006**: System MUST implement secure session management including proper logout functionality
- **FR-007**: System MUST validate CORS configuration to allow only approved frontend origins
- **FR-008**: System MUST store JWT tokens securely using httpOnly cookies (not localStorage)
- **FR-009**: System MUST provide appropriate error responses (401, 403, 404) for unauthorized access attempts
- **FR-010**: System MUST validate that users can only access resources they own or have permission to access

### Key Entities

- **User**: Represents a registered user of the system with unique identification, authentication credentials, and personal data
- **Task**: Represents a task item associated with a specific user, containing title, description, completion status, and timestamps
- **Authentication Session**: Represents a user's authenticated state with JWT token validation and session management

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 10 defined integration test cases pass without errors, demonstrating complete system integration
- **SC-002**: Users can complete the full registration and authentication flow with 95% success rate
- **SC-003**: Authenticated users can perform all task CRUD operations with 98% success rate
- **SC-004**: User isolation is enforced with 100% accuracy - users cannot access other users' tasks
- **SC-005**: API response times remain under 500ms for 95% of requests during normal operation
- **SC-006**: Security vulnerabilities related to authentication and authorization are eliminated
- **SC-007**: Error handling works properly across frontend-backend boundary with appropriate user feedback
- **SC-008**: System handles unauthorized access attempts gracefully with proper redirection to login
