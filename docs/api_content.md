# Content API

## Content Section Types

Content can have multiple sections, each with one of these types:

- `text`: Plain text or markdown content
- `media`: Image or video URL
- `code`: Code snippet with language specification

## 1. Create Content

### Feature

Create content for a lesson. Only the topic owner can create content. Each lesson can only have one content document with multiple sections.

### Endpoint

- Method: `POST`
- Path: `/lessons/:slug/content`
- Full URL: `http://localhost:8046/api/v1/lessons/:slug/content`

### Request

Headers:

- `Content-Type: application/json`
- `Authorization: Bearer <token>`

Path Parameters:

- `slug` (required): The unique slug identifier of the lesson

Body:

```json
{
  "sections": [
    {
      "type": "text",
      "content": "This is an introduction to Go programming..."
    },
    {
      "type": "code",
      "content": "package main\n\nfunc main() {\n  fmt.Println(\"Hello, World!\")\n}",
      "language": "go"
    },
    {
      "type": "media",
      "url": "https://example.com/image.png"
    }
  ]
}
```

### Validation Rules

- `sections`: required, minimum 1 section
- `sections[].type`: required, must be "text", "media", or "code"
- For `text` type:
  - `content`: required
- For `code` type:
  - `content`: required
  - `language`: required
- For `media` type:
  - `url`: required

### Responses

#### 201 Created

```json
{
  "success": true,
  "message": "Content created successfully"
}
```

#### 400 Bad Request

```json
{
  "success": false,
  "message": "Invalid request format: <validation error details>"
}
```

OR

```json
{
  "success": false,
  "message": "section 2: code language is required"
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
  "message": "You don't have permission to add content to this lesson"
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Lesson not found"
}
```

#### 409 Conflict

```json
{
  "success": false,
  "message": "Content already exists for this lesson"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to create content"
}
```

## 2. Get Content

### Feature

Get content for a specific lesson.

### Endpoint

- Method: `GET`
- Path: `/lessons/:slug/content`
- Full URL: `http://localhost:8046/api/v1/lessons/:slug/content`

### Request

Path Parameters:

- `slug` (required): The unique slug identifier of the lesson

Example: `/lessons/introduction-to-go-1234567890/content`

### Responses

#### 200 OK

```json
{
  "success": true,
  "message": "Content retrieved successfully",
  "data": {
    "id": "65f8c3a2b1234567890abcde",
    "lessonId": "65f8c3a2b1234567890abcdf",
    "sections": [
      {
        "id": 1,
        "type": "text",
        "content": "This is an introduction to Go programming..."
      },
      {
        "id": 2,
        "type": "code",
        "content": "package main\n\nfunc main() {\n  fmt.Println(\"Hello, World!\")\n}",
        "language": "go"
      },
      {
        "id": 3,
        "type": "media",
        "url": "https://example.com/image.png"
      }
    ],
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

OR

```json
{
  "success": false,
  "message": "Content not found"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to get content"
}
```

## 3. Update Content

### Feature

Update content for a lesson. Only the topic owner can update content. This replaces all sections.

### Endpoint

- Method: `PUT`
- Path: `/lessons/:slug/content`
- Full URL: `http://localhost:8046/api/v1/lessons/:slug/content`

### Request

Headers:

- `Content-Type: application/json`
- `Authorization: Bearer <token>`

Path Parameters:

- `slug` (required): The unique slug identifier of the lesson

Body:

```json
{
  "sections": [
    {
      "type": "text",
      "content": "Updated introduction to Go programming..."
    },
    {
      "type": "code",
      "content": "package main\n\nfunc main() {\n  fmt.Println(\"Hello, Go!\")\n}",
      "language": "go"
    }
  ]
}
```

### Validation Rules

Same as Create Content.

### Responses

#### 200 OK

```json
{
  "success": true,
  "message": "Content updated successfully"
}
```

#### 400 Bad Request

```json
{
  "success": false,
  "message": "Invalid request format: <validation error details>"
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
  "message": "You don't have permission to update this content"
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Lesson not found"
}
```

OR

```json
{
  "success": false,
  "message": "Content not found"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to update content"
}
```

## 4. Delete Content

### Feature

Delete content for a lesson. Only the topic owner can delete content.

### Endpoint

- Method: `DELETE`
- Path: `/lessons/:slug/content`
- Full URL: `http://localhost:8046/api/v1/lessons/:slug/content`

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
  "message": "Content deleted successfully"
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
  "message": "You don't have permission to delete this content"
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Lesson not found"
}
```

OR

```json
{
  "success": false,
  "message": "Content not found"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to delete content"
}
```

## Error Handling

### Validation Errors

The service validates sections based on their type:

- **Text sections**: Must have `content` field
- **Code sections**: Must have both `content` and `language` fields
- **Media sections**: Must have `url` field

Invalid section types or missing required fields will return a 400 Bad Request with a descriptive error message.

### Ownership Validation

All CUD operations (Create, Update, Delete) validate that:

1. The lesson exists
2. The lesson belongs to a topic
3. The topic is owned by the authenticated user

If any of these checks fail, appropriate error codes are returned (404 for not found, 403 for forbidden).
