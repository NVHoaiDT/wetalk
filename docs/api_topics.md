# Topics API

## Common Response Envelope

All endpoints return this top-level structure:

```json
{
  "success": true,
  "message": "string",
  "data": {},
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "nextUrl": "string"
  }
}
```

Notes:

- `data` is omitted when not needed.
- `pagination` is only returned for list endpoints.
- `nextUrl` is optional.

## 1. Create Topic

### Feature

Create a new topic.

### Endpoint

- Method: `POST`
- Path: `/topics`
- Full URL: `http://localhost:8046/api/v1/topics`

### Request

Headers:

- `Content-Type: application/json`

Body:

```json
{
  "title": "string",
  "description": "string",
  "author": {
    "userId": 123,
    "avatar": "string",
    "name": "string"
  }
}
```

### Validation Rules

- `title`: required
- `description`: required
- `author`: required
- `author.userId`: required
- `author.name`: required
- `author.avatar`: optional

### Responses

#### 201 Created

```json
{
  "success": true,
  "message": "Topic created successfully"
}
```

#### 400 Bad Request

```json
{
  "success": false,
  "message": "Invalid request format: <binding or validation error details>"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to create topic"
}
```

## 2. Get Topic List

### Feature

Get a paginated topic list.

### Endpoint

- Method: `GET`
- Path: `/topics`
- Full URL: `http://localhost:8046/api/v1/topics`

### Request

Query Parameters:

- `page` (optional, default: `1`)
- `limit` (optional, default: `10`)

Example:

- `/topics?page=1&limit=10`

### Service Behavior

- If `page < 1`, the system uses `1`.
- If `limit < 1` or `limit > 50`, the system uses `10`.

### Responses

#### 200 OK

```json
{
  "success": true,
  "message": "Topics retrieved successfully",
  "data": [
    {
      "id": "string",
      "slug": "string",
      "title": "string",
      "description": "string",
      "author": {
        "userId": 123,
        "avatar": "string",
        "name": "string"
      },
      "createdAt": "2026-03-18T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to get topics"
}
```

## 3. Get Topic by Slug

### Feature

Get detailed information about a specific topic.

### Endpoint

- Method: `GET`
- Path: `/topics/:slug`
- Full URL: `http://localhost:8046/api/v1/topics/:slug`

### Request

Path Parameters:

- `slug` (required): The unique slug identifier of the topic

Example: `/topics/go-programming-1234567890`

### Responses

#### 200 OK

```json
{
  "success": true,
  "message": "Topic retrieved successfully",
  "data": {
    "id": "string",
    "slug": "string",
    "title": "string",
    "description": "string",
    "author": {
      "userId": 123,
      "avatar": "string",
      "name": "string"
    },
    "createdAt": "2026-03-18T10:00:00Z"
  }
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Topic not found"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to get topic"
}
```

## 4. Update Topic

### Feature

Update an existing topic. Only the topic owner can update it.

### Endpoint

- Method: `PUT`
- Path: `/topics/:slug`
- Full URL: `http://localhost:8046/api/v1/topics/:slug`

### Request

Headers:

- `Content-Type: application/json`
- `Authorization: Bearer <token>`

Path Parameters:

- `slug` (required): The unique slug identifier of the topic

Body:

```json
{
  "title": "string",
  "description": "string"
}
```

### Validation Rules

- `title`: required
- `description`: required

### Responses

#### 200 OK

```json
{
  "success": true,
  "message": "Topic updated successfully"
}
```

#### 400 Bad Request

```json
{
  "success": false,
  "message": "Invalid request format: <binding or validation error details>"
}
```

#### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

#### 403 Forbidden

```json
{
  "success": false,
  "message": "You don't have permission to update this topic"
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Topic not found"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to update topic"
}
```

## 5. Delete Topic

### Feature

Delete a topic. Only the topic owner can delete it. Cannot delete a topic that has lessons.

### Endpoint

- Method: `DELETE`
- Path: `/topics/:slug`
- Full URL: `http://localhost:8046/api/v1/topics/:slug`

### Request

Headers:

- `Authorization: Bearer <token>`

Path Parameters:

- `slug` (required): The unique slug identifier of the topic

### Responses

#### 200 OK

```json
{
  "success": true,
  "message": "Topic deleted successfully"
}
```

#### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

#### 403 Forbidden

```json
{
  "success": false,
  "message": "You don't have permission to delete this topic"
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Topic not found"
}
```

#### 409 Conflict

```json
{
  "success": false,
  "message": "Cannot delete topic with existing lessons"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to delete topic"
}
```

## 6. Get Lessons in Topic

### Feature

Get a paginated list of lessons within a specific topic, sorted by order index.

### Endpoint

- Method: `GET`
- Path: `/topics/:slug/lessons`
- Full URL: `http://localhost:8046/api/v1/topics/:slug/lessons`

### Request

Path Parameters:

- `slug` (required): The unique slug identifier of the topic

Query Parameters:

- `page` (optional, default: `1`)
- `limit` (optional, default: `10`)

Example: `/topics/go-programming-1234567890/lessons?page=1&limit=10`

### Service Behavior

- If `page < 1`, the system uses `1`.
- If `limit < 1` or `limit > 100`, the system uses `10`.
- Lessons are sorted by `order_index` in ascending order.

### Responses

#### 200 OK

```json
{
  "success": true,
  "message": "Lessons retrieved successfully",
  "data": [
    {
      "id": "string",
      "topicId": "string",
      "slug": "string",
      "title": "string",
      "orderIndex": 1,
      "createdAt": "2026-03-18T10:00:00Z",
      "updatedAt": "2026-03-18T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Topic not found"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to get lessons"
}
```
