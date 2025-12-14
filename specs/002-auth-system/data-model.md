# Data Model: End-to-End Authentication System

## User Entity

### Fields
- **id** (Primary Key): UUID/string - Unique identifier for the user
- **email**: String - User's email address (unique, validated format)
- **password**: String - Hashed password using bcrypt with 12 rounds
- **name**: String (optional) - User's display name
- **created_at**: DateTime - Timestamp when user account was created
- **updated_at**: DateTime - Timestamp when user account was last updated
- **email_verified**: Boolean - Whether the email address has been verified
- **is_active**: Boolean - Whether the account is active/enabled

### Relationships
- **Tasks**: One-to-many relationship with Task entities (a user can have multiple tasks)
- **Sessions**: One-to-many relationship with Session entities (a user can have multiple active sessions)

### Validation Rules
- Email must be unique across all users
- Email must follow standard email format validation
- Password must meet complexity requirements (minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
- Email must be required and not empty
- Password must be hashed using bcrypt with minimum 12 rounds before storage

## JWT Token Structure

### Claims
- **sub** (Subject): User's unique identifier (user.id)
- **email**: User's email address
- **exp** (Expiration): Token expiration timestamp (7 days from creation)
- **iat** (Issued At): Token creation timestamp
- **jti** (JWT ID): Unique identifier for the token (optional, for revocation)

### Validation
- Token signature must be verified using the shared secret
- Token must not be expired (check exp claim)
- User referenced in token must exist in the database
- Token should be validated on every protected API request

## Session Entity (Database Session Tracking)

### Fields
- **id** (Primary Key): UUID/string - Unique identifier for the session
- **user_id** (Foreign Key): References User.id
- **token_id**: String - Reference to the JWT ID (jti) if implemented
- **created_at**: DateTime - Timestamp when session was created
- **expires_at**: DateTime - Timestamp when session expires
- **is_active**: Boolean - Whether the session is currently active
- **ip_address**: String (optional) - IP address of the user when session was created
- **user_agent**: String (optional) - User agent string for additional security

### Relationships
- **User**: Many-to-one relationship with User entity (many sessions per user)

### Validation Rules
- Session must be linked to an active user account
- Session must not be expired when validating requests
- Session can be invalidated independently of JWT expiration for immediate logout

## Authentication Request/Response Models

### Signup Request
- **email**: String - User's email address
- **password**: String - User's password (must meet complexity requirements)
- **confirm_password**: String - Password confirmation (must match password)

### Signin Request
- **email**: String - User's email address
- **password**: String - User's password

### Authentication Response
- **user**: Object - User information (id, email, name)
- **access_token**: String - JWT access token
- **token_type**: String - Type of token (e.g., "bearer")
- **expires_in**: Number - Time until token expiration in seconds

### Error Response
- **error**: String - Error code or type
- **message**: String - Human-readable error message
- **details**: Object (optional) - Additional error details for debugging