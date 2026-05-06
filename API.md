# API Documentation

Complete API reference for Team Task Manager

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.railway.app/api`

## Authentication

Include JWT token in Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Response Format

All responses are JSON:

```json
{
  "message": "Success message",
  "data": {},
  "errors": []
}
```

---

## Authentication Endpoints

### Sign Up

Create a new user account.

```
POST /auth/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

**Status Codes:**
- `201` - User created successfully
- `400` - User already exists or validation error

---

### Login

Authenticate with email and password.

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Invalid credentials

---

### Get Current User

Get authenticated user details.

```
GET /auth/me
```

**Required Headers:**
- `Authorization: Bearer YOUR_TOKEN`

**Response:**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member",
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid or expired token

---

## Projects Endpoints

### Create Project

Create a new project.

```
POST /projects
```

**Required Headers:**
- `Authorization: Bearer YOUR_TOKEN`

**Request Body:**
```json
{
  "name": "Q1 Planning",
  "description": "First quarter planning and execution"
}
```

**Response:**
```json
{
  "message": "Project created successfully",
  "project": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Q1 Planning",
    "description": "First quarter planning and execution",
    "owner": {
      "id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "members": [
      {
        "id": "507f1f77bcf86cd799439012",
        "name": "John Doe",
        "email": "john@example.com"
      }
    ],
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

**Status Codes:**
- `201` - Project created
- `400` - Validation error
- `401` - Unauthorized

---

### Get All Projects

Get all projects user is member of.

```
GET /projects
```

**Required Headers:**
- `Authorization: Bearer YOUR_TOKEN`

**Response:**
```json
{
  "projects": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Project Name",
      "description": "Description",
      "owner": { "id": "...", "name": "...", "email": "..." },
      "members": [ ... ]
    }
  ]
}
```

---

### Get Project Details

Get specific project information.

```
GET /projects/:projectId
```

**Response:**
```json
{
  "project": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Project Name",
    "description": "Description",
    "owner": { ... },
    "members": [ ... ]
  }
}
```

---

### Update Project

Update project details (owner only).

```
PUT /projects/:projectId
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Status Codes:**
- `200` - Success
- `403` - Not project owner
- `404` - Project not found

---

### Delete Project

Delete a project (owner only).

```
DELETE /projects/:projectId
```

**Status Codes:**
- `200` - Success
- `403` - Not project owner
- `404` - Project not found

---

### Add Member to Project

Add a user to project (owner only).

```
POST /projects/:projectId/members
```

**Request Body:**
```json
{
  "memberId": "507f1f77bcf86cd799439012"
}
```

**Status Codes:**
- `200` - Success
- `400` - User already member
- `403` - Not project owner
- `404` - Project not found

---

### Remove Member from Project

Remove user from project (owner only).

```
DELETE /projects/:projectId/members
```

**Request Body:**
```json
{
  "memberId": "507f1f77bcf86cd799439012"
}
```

---

## Tasks Endpoints

### Create Task

Create a new task in project.

```
POST /tasks/:projectId
```

**Request Body:**
```json
{
  "title": "Design Homepage",
  "description": "Create mockups for homepage",
  "assignedTo": "507f1f77bcf86cd799439012",
  "priority": "high",
  "dueDate": "2024-02-01"
}
```

**Priority Options:** `low`, `medium`, `high`

**Response:**
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Design Homepage",
    "description": "Create mockups for homepage",
    "project": { ... },
    "assignedTo": { ... },
    "status": "todo",
    "priority": "high",
    "dueDate": "2024-02-01T00:00:00Z",
    "createdBy": { ... },
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

---

### Get Project Tasks

Get all tasks for a project.

```
GET /tasks/:projectId
```

**Response:**
```json
{
  "tasks": [ ... ]
}
```

---

### Get Task Details

Get specific task information.

```
GET /tasks/task/:taskId
```

---

### Update Task

Update task details.

```
PUT /tasks/:taskId
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "status": "in_progress",
  "priority": "medium",
  "dueDate": "2024-02-15",
  "assignedTo": "507f1f77bcf86cd799439012"
}
```

**Status Options:** `todo`, `in_progress`, `completed`

---

### Delete Task

Delete a task.

```
DELETE /tasks/:taskId
```

---

### Get Dashboard

Get user dashboard with statistics.

```
GET /tasks/dashboard
```

**Response:**
```json
{
  "tasks": [ ... ],
  "stats": {
    "total": 15,
    "todo": 5,
    "inProgress": 7,
    "completed": 3,
    "overdue": 2
  }
}
```

---

## Error Responses

### 400 - Bad Request

```json
{
  "errors": [
    {
      "msg": "Invalid email format",
      "param": "email"
    }
  ]
}
```

### 401 - Unauthorized

```json
{
  "message": "Authorization token not found"
}
```

### 403 - Forbidden

```json
{
  "message": "You do not have permission to perform this action"
}
```

### 404 - Not Found

```json
{
  "message": "Resource not found"
}
```

### 500 - Server Error

```json
{
  "message": "Server error",
  "error": "Error details"
}
```

---

## Rate Limiting

- No rate limiting implemented (add in production)
- Recommended: 100 requests per 15 minutes per IP

---

## Pagination

Not implemented yet. Recommended for future versions:

```
GET /projects?page=1&limit=10
GET /tasks?page=1&limit=20
```

---

## Filtering

Recommended future enhancements:

```
GET /tasks?status=in_progress&priority=high
GET /projects?search=quarterly
```

---

## Data Types

### User
```json
{
  "id": "string (MongoDB ObjectId)",
  "name": "string",
  "email": "string",
  "role": "enum: admin|member"
}
```

### Project
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "owner": "User",
  "members": "User[]",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

### Task
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "project": "Project",
  "assignedTo": "User",
  "status": "enum: todo|in_progress|completed",
  "priority": "enum: low|medium|high",
  "dueDate": "ISO 8601 timestamp (optional)",
  "createdBy": "User",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

---

## Example Workflows

### 1. Create and Manage Project

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"User","email":"user@example.com","password":"pass123"}'

# Save token from response
TOKEN="..."

# Create project
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Project","description":"Description"}'

# Get projects
curl http://localhost:5000/api/projects \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Create and Assign Tasks

```bash
# Create task
curl -X POST http://localhost:5000/api/tasks/PROJECT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Task 1",
    "description":"Description",
    "assignedTo":"USER_ID",
    "priority":"high"
  }'

# Update task status
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'
```

---

## Support

For issues or questions about the API, refer to:
- [README.md](./README.md) - Full documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide

---

**Last Updated:** January 2024
