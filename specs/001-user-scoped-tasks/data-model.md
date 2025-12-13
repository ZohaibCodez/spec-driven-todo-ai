# Data Model: User-Scoped Tasks

## User Entity

### Fields
- **id**: Integer (Primary Key, Auto-increment)
- **email**: String (Unique, Not Null)
- **name**: String (Not Null)
- **created_at**: DateTime (Not Null)

### Relationships
- **tasks**: One-to-Many relationship with Task entity (cascade delete)

### Constraints
- Email must be unique across all users
- Email and name fields are required

## Task Entity

### Fields
- **id**: Integer (Primary Key, Auto-increment)
- **title**: String (Not Null)
- **description**: String (Optional)
- **completed**: Boolean (Default: False)
- **created_at**: DateTime (Not Null)
- **updated_at**: DateTime (Not Null)
- **user_id**: Integer (Foreign Key to User.id, Not Null)

### Relationships
- **user**: Many-to-One relationship with User entity

### Constraints
- user_id must reference a valid User record (foreign key constraint)
- Tasks cannot be transferred between users after creation
- When a User is deleted, all associated Tasks are also deleted (cascade delete)

## Validation Rules
- User email must be in valid email format
- User email must be unique
- Task title must not be empty
- Task user_id must reference an existing user