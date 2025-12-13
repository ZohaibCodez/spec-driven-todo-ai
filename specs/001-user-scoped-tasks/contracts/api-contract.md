# API Contract: User-Scoped Tasks

## Base Path
`/api/{user_id}`

## Endpoints

### GET /api/{user_id}/tasks
**Description**: Retrieve all tasks for a specific user

**Path Parameters**:
- `user_id` (integer, required): The numeric ID of the user

**Response**:
- `200 OK`: Array of task objects
  ```json
  [
    {
      "id": 1,
      "title": "Sample Task",
      "description": "Sample Description",
      "completed": false,
      "created_at": "2025-12-14T10:00:00Z",
      "updated_at": "2025-12-14T10:00:00Z",
      "user_id": 1
    }
  ]
  ```
- `404 Not Found`: When user_id does not exist

### POST /api/{user_id}/tasks
**Description**: Create a new task for a specific user

**Path Parameters**:
- `user_id` (integer, required): The numeric ID of the user

**Request Body**:
```json
{
  "title": "Task Title",
  "description": "Task Description"
}
```

**Response**:
- `201 Created`: Created task object
  ```json
  {
    "id": 1,
    "title": "Task Title",
    "description": "Task Description",
    "completed": false,
    "created_at": "2025-12-14T10:00:00Z",
    "updated_at": "2025-12-14T10:00:00Z",
    "user_id": 1
  }
  ```
- `400 Bad Request`: Invalid request body
- `404 Not Found`: When user_id does not exist

### GET /api/{user_id}/tasks/{task_id}
**Description**: Retrieve a specific task for a user

**Path Parameters**:
- `user_id` (integer, required): The numeric ID of the user
- `task_id` (integer, required): The ID of the task

**Response**:
- `200 OK`: Task object
- `404 Not Found`: When user_id or task_id does not exist

### PUT /api/{user_id}/tasks/{task_id}
**Description**: Update a specific task for a user

**Path Parameters**:
- `user_id` (integer, required): The numeric ID of the user
- `task_id` (integer, required): The ID of the task

**Request Body**:
```json
{
  "title": "Updated Task Title",
  "description": "Updated Task Description",
  "completed": true
}
```

**Response**:
- `200 OK`: Updated task object
- `400 Bad Request`: Invalid request body
- `404 Not Found`: When user_id or task_id does not exist

### DELETE /api/{user_id}/tasks/{task_id}
**Description**: Delete a specific task for a user

**Path Parameters**:
- `user_id` (integer, required): The numeric ID of the user
- `task_id` (integer, required): The ID of the task

**Response**:
- `204 No Content`: Task successfully deleted
- `404 Not Found`: When user_id or task_id does not exist

### PATCH /api/{user_id}/tasks/{task_id}/complete
**Description**: Toggle completion status of a specific task

**Path Parameters**:
- `user_id` (integer, required): The numeric ID of the user
- `task_id` (integer, required): The ID of the task

**Response**:
- `200 OK`: Updated task object with toggled completion status
- `404 Not Found`: When user_id or task_id does not exist