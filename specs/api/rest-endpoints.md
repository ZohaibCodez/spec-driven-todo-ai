# REST API Endpoints Specification

## Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://api.taskflow.app` (TBD)

## Authentication
**All endpoints require JWT token** in Authorization header:
```
Authorization: Bearer <jwt_token>
```

Tokens are issued by Better Auth on frontend after successful login/signup.

## Common Response Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (not resource owner) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Task Endpoints

### GET /api/{user_id}/tasks
**List all tasks for authenticated user**

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| status | string | No | "all" | Filter by status: "all", "pending", "completed" |
| sort | string | No | "created" | Sort by: "created", "title", "updated" |
| order | string | No | "desc" | Order: "asc", "desc" |

#### Response
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Complete project",
      "description": "Finish Phase II implementation",
      "completed": false,
      "user_id": 123,
      "created_at": "2025-12-14T10:00:00Z",
      "updated_at": "2025-12-14T10:00:00Z"
    }
  ],
  "total": 1
}
```

---

### POST /api/{user_id}/tasks
**Create a new task**

#### Request Body
```json
{
  "title": "Task title",
  "description": "Optional description"
}
```

#### Validation Rules
- `title`: Required, 1-200 characters
- `description`: Optional, max 1000 characters

#### Response (201 Created)
```json
{
  "id": 1,
  "title": "Task title",
  "description": "Optional description",
  "completed": false,
  "user_id": 123,
  "created_at": "2025-12-14T10:00:00Z",
  "updated_at": "2025-12-14T10:00:00Z"
}
```

---

### GET /api/{user_id}/tasks/{id}
**Get task details**

#### Response
```json
{
  "id": 1,
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "user_id": 123,
  "created_at": "2025-12-14T10:00:00Z",
  "updated_at": "2025-12-14T10:00:00Z"
}
```

#### Errors
- **404**: Task not found or doesn't belong to user

---

### PUT /api/{user_id}/tasks/{id}
**Update a task**

#### Request Body
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

#### Validation Rules
- `title`: Optional, 1-200 characters (if provided)
- `description`: Optional, max 1000 characters
- `completed`: Optional, boolean

#### Response
```json
{
  "id": 1,
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "user_id": 123,
  "created_at": "2025-12-14T10:00:00Z",
  "updated_at": "2025-12-14T14:30:00Z"
}
```

#### Errors
- **404**: Task not found or doesn't belong to user

---

### DELETE /api/{user_id}/tasks/{id}
**Delete a task**

#### Response
```json
{
  "message": "Task deleted successfully"
}
```

#### Errors
- **404**: Task not found or doesn't belong to user

---

### PATCH /api/{user_id}/tasks/{id}/complete
**Toggle task completion status**

#### Response
```json
{
  "id": 1,
  "completed": true,
  "updated_at": "2025-12-14T14:35:00Z"
}
```

---

## User Endpoints (Optional - managed by Better Auth)

### GET /api/users/me
**Get current user profile**

#### Response
```json
{
  "id": 123,
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2025-12-01T10:00:00Z"
}
```

---

## Security Notes

1. **User Scoping**: The `{user_id}` in URLs must match the authenticated user from JWT
2. **Ownership Verification**: Backend verifies user owns the resource before allowing operations
3. **JWT Expiry**: Tokens expire after 7 days (configurable in Better Auth)
4. **CORS**: Only frontend origin is allowed in production

---

## Error Response Format

All errors return:
```json
{
  "detail": "Error message description"
}
```

### Validation Errors (422)
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```
