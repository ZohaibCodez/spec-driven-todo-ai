# Data Model: Frontend Foundation - Todo UI

## Task Entity

**Definition**: Represents a user's todo item with attributes: title, description, completion status, creation date, update date, due date, category, tags

### Fields
- `id: string` - Unique identifier for the task (UUID or similar)
- `title: string` - Task title (required, max 200 characters)
- `description: string` - Task description (optional, max 1000 characters)
- `completed: boolean` - Completion status (default: false)
- `createdAt: Date` - Creation timestamp
- `updatedAt: Date` - Last update timestamp
- `dueDate: Date | null` - Optional due date for the task
- `category: string | null` - Category for organization (optional)
- `tags: string[]` - Array of tags for flexible filtering

### Validation Rules
- Title must not be empty or only whitespace
- Title must be less than 200 characters
- Description must be less than 1000 characters if provided
- Due date must be a valid future date if provided
- Category must be less than 50 characters if provided
- Tags array must not exceed 10 tags per task
- Each tag must be less than 30 characters

### State Transitions
- `pending` → `completed`: When user marks task as complete
- `completed` → `pending`: When user marks task as incomplete

## Anonymous Session Entity

**Definition**: Represents an anonymous user context that maintains task data persistence and isolation between different users

### Fields
- `sessionId: string` - Unique identifier for the anonymous session
- `tasks: Task[]` - Array of tasks associated with this session
- `createdAt: Date` - Session creation timestamp
- `lastAccessed: Date` - Last access timestamp (for cleanup)

### Validation Rules
- Session ID must be unique across all sessions
- Tasks array must not exceed 1000 tasks per session
- Session must be cleaned up after 30 days of inactivity

## Category Entity

**Definition**: Represents a user-defined grouping for organizing related tasks

### Fields
- `name: string` - Category name (unique per user session)
- `createdAt: Date` - Creation timestamp

### Validation Rules
- Category name must be unique within the session
- Category name must be less than 50 characters
- Category name must not be empty

## Tag Entity

**Definition**: Represents a keyword or label that can be applied to tasks for filtering and organization

### Fields
- `name: string` - Tag name (used across tasks)
- `usageCount: number` - Number of tasks using this tag (for suggestions)

### Validation Rules
- Tag name must be less than 30 characters
- Tag name must not be empty
- Tags are case-insensitive and normalized (lowercase, trimmed)