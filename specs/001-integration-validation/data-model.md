# Data Model: Integration Validation & End-to-End Testing

## Overview
This data model represents the entities and their relationships relevant to the integration validation and end-to-end testing procedures. While the validation process itself doesn't introduce new data entities, it validates the existing data model used by the integrated system.

## Existing Entities (Being Validated)

### User
Represents a registered user of the system with unique identification, authentication credentials, and personal data.

**Fields**:
- `id` (string/UUID): Unique identifier for the user
- `email` (string): User's email address (unique)
- `created_at` (timestamp): When the user account was created
- `updated_at` (timestamp): When the user account was last updated

**Relationships**:
- One-to-many with Task (one user can have many tasks)
- Validated during registration, authentication, and task association

**Validation Rules**:
- Email must be unique across all users
- Email must follow standard email format
- User ID must be unique and non-modifiable after creation

### Task
Represents a task item associated with a specific user, containing title, description, completion status, and timestamps.

**Fields**:
- `id` (string/UUID): Unique identifier for the task
- `title` (string): Task title (required)
- `description` (string): Task description (optional)
- `completed` (boolean): Whether the task is completed (default: false)
- `user_id` (string/UUID): Reference to the owning user
- `created_at` (timestamp): When the task was created
- `updated_at` (timestamp): When the task was last updated

**Relationships**:
- Many-to-one with User (many tasks belong to one user)
- Validated during creation, update, and access control

**Validation Rules**:
- Title is required and cannot be empty
- user_id must reference a valid existing user
- Only the owning user can access, modify, or delete the task
- Completion status can only be modified by the owning user

### Authentication Session
Represents a user's authenticated state with JWT token validation and session management.

**Fields**:
- `user_id` (string/UUID): Reference to the authenticated user
- `token` (string): JWT token identifier (for tracking)
- `expires_at` (timestamp): When the token expires
- `created_at` (timestamp): When the session was created

**Validation Rules**:
- Token must be valid and not expired
- Session must be associated with a valid user
- Session data must be securely stored (httpOnly cookies)

## Integration Validation Data Flows

### User Registration Flow
1. Input: User provides email and password
2. Validation: Email format, uniqueness in database
3. Storage: User record created in database
4. Output: JWT token issued to client

### Task Creation Flow
1. Input: Authenticated user provides task details
2. Validation: JWT token validity, user_id extraction from token
3. Storage: Task record created with user_id association
4. Output: Task data returned to client

### Task Access Flow
1. Input: Authenticated user requests task list
2. Validation: JWT token validity, user_id extraction from token
3. Retrieval: Filter tasks by user_id in database query
4. Output: Only user's tasks returned to client

## Data Integrity Constraints

### Foreign Key Constraints
- Task.user_id must reference a valid User.id
- Enforced at the database level by Neon PostgreSQL

### Access Control Constraints
- Users can only access tasks where user_id matches their authenticated user_id
- Enforced at the application level in backend API endpoints
- Validated during integration testing

### Data Consistency Requirements
- Timestamps (created_at, updated_at) automatically managed by the system
- User isolation maintained across all operations
- Authentication state properly validated for all protected operations

## Validation Scenarios

### User Isolation Validation
- Verify that User A cannot access Task X if Task X.user_id belongs to User B
- Validate database queries properly filter by authenticated user_id
- Confirm API responses only contain authorized data

### Authentication Validation
- Verify JWT tokens properly identify the authenticated user
- Validate token expiration and invalidation mechanisms
- Confirm secure token storage using httpOnly cookies

### Data Integrity Validation
- Verify foreign key constraints are enforced
- Validate that task creation properly associates with the authenticated user
- Confirm that updates and deletions respect user ownership