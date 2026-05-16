# Lessons API

## 1. Create Lesson

### Feature

Create a new lesson within a topic. Only the topic owner can create lessons.

### Endpoint

- Method: `POST`
- Path: `/lessons`
- Full URL: `http://localhost:8046/api/v1/lessons`

### Request

Headers:

- `Content-Type: application/json`
- `Authorization: Bearer <token>`

Body:

```json
{
  "topicSlug": "string",
  "title": "string",
  "orderIndex": 1
}
```

### Validation Rules

- `topicSlug`: required (the slug of the parent topic)
- `title`: required
- `orderIndex`: required, minimum value is 1

### Responses

#### 201 Created

```json
{
  "success": true,
  "message": "Lesson created successfully"
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
  "message": "You don't have permission to add lessons to this topic"
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
  "message": "Failed to create lesson"
}
```

## 2. Get Lesson by Slug

### Feature

Get detailed information about a specific lesson.

### Endpoint

- Method: `GET`
- Path: `/lessons/:slug`
- Full URL: `http://localhost:8046/api/v1/lessons/:slug`

### Request

Path Parameters:

- `slug` (required): The unique slug identifier of the lesson

Example: `/lessons/introduction-to-go-1234567890`

### Responses

#### 200 OK

```json
{
  "success": true,
  "message": "Lesson retrieved successfully",
  "data": {
    "id": "string",
    "topicId": "string",
    "slug": "string",
    "title": "string",
    "orderIndex": 1,
    "createdAt": "2026-03-18T10:00:00Z",
    "updatedAt": "2026-03-18T10:00:00Z"
  }
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Lesson not found"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to get lesson"
}
```

## 3. Update Lesson

### Feature

Update an existing lesson. Only the topic owner can update lessons.

### Endpoint

- Method: `PUT`
- Path: `/lessons/:slug`
- Full URL: `http://localhost:8046/api/v1/lessons/:slug`

### Request

Headers:

- `Content-Type: application/json`
- `Authorization: Bearer <token>`

Path Parameters:

- `slug` (required): The unique slug identifier of the lesson

Body:

```json
{
  "title": "string",
  "orderIndex": 1
}
```

### Validation Rules

- `title`: required
- `orderIndex`: required, minimum value is 1

### Responses

#### 200 OK

```json
{
  "success": true,
  "message": "Lesson updated successfully"
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
  "message": "You don't have permission to update this lesson"
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Lesson not found"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to update lesson"
}
```

## 4. Delete Lesson

### Feature

Delete a lesson and its associated content (if exists). Only the topic owner can delete lessons. This operation will:

1. Check if content exists for the lesson and delete it first
2. Delete the lesson itself

If content deletion fails, the lesson will not be deleted to ensure data consistency.

### Endpoint

- Method: `DELETE`
- Path: `/lessons/:slug`
- Full URL: `http://localhost:8046/api/v1/lessons/:slug`

### Request

Headers:

- `Authorization: Bearer <token>`

Path Parameters:

- `slug` (required): The unique slug identifier of the lesson

### Responses

#### 200 OK

```json
{
  "success": true,
  "message": "Lesson deleted successfully"
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
  "message": "You don't have permission to delete this lesson"
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Lesson not found"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to delete lesson"
}
```
