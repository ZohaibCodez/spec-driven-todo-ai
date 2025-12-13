# Data Model: CLI Todo Application

## Task Entity

### Fields
- **id**: `int` - Unique sequential identifier starting from 1
- **title**: `str` - Required task title (1-100 characters)
- **description**: `str` - Optional task description (0-500 characters)
- **completed**: `bool` - Task completion status (default: False)

### Relationships
- No relationships - Task is an independent entity

### Validation Rules
- `id`: Must be a positive integer, assigned sequentially starting from 1
- `title`: Required field, 1-100 characters, no special restrictions
- `description`: Optional field, 0-500 characters if provided
- `completed`: Boolean value, defaults to False when creating new tasks

### State Transitions
- `incomplete` → `completed`: When task is marked as complete
- `completed` → `incomplete`: When task is marked as incomplete

## TaskList Entity

### Fields
- **tasks**: `dict[int, Task]` - Dictionary mapping task IDs to Task objects
- **next_id**: `int` - Next available ID for new tasks (starts at 1)

### Relationships
- Contains multiple Task entities

### Validation Rules
- Task IDs must be unique within the list
- Task IDs must be sequential starting from 1
- No two tasks can have the same ID

### Operations
- Add task: Creates a new task with the next available ID
- Get task: Retrieves a task by its ID
- Update task: Modifies an existing task's title or description
- Delete task: Removes a task by its ID
- Toggle completion: Changes a task's completion status
- List all tasks: Returns all tasks in the list