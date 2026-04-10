# Quizzes API

## 1. Create Quiz

### Feature

Create a new quiz for a specific lesson. Only the topic owner (the user who created the topic containing that lesson) can create a quiz. Each lesson can only have one quiz.

### Endpoint

- Method: `POST`
- Path: `/quizzes`
- Full URL: `http://localhost:8046/api/v1/quizzes`

### Request

Headers:

- `Content-Type: application/json`
- `Authorization: Bearer <token>`

Body:

```json
{
  "lessonSlug": "string",
  "title": "string",
  "questions": [
    {
      "question": "string",
      "point": 10,
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    }
  ],
  "timeLimit": 30
}
```

### Validation Rules

- `lessonSlug`: required (slug of the lesson to attach the quiz to)
- `title`: required
- `questions`: required, minimum 1 item
  - `question`: required
  - `point`: required, minimum value is 1
  - `options`: required, minimum 2 items
  - `correctAnswer`: required
- `timeLimit`: required, minimum value is 1 (in minutes)

### Responses

#### 201 Created

```json
{
  "success": true,
  "message": "Quiz created successfully"
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
  "message": "You don't have permission to create a quiz for this lesson"
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
  "message": "A quiz already exists for this lesson"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to create quiz"
}
```

---

## 2. Get Quizzes by Lesson Slug

### Feature

Retrieve all quizzes associated with a specific lesson. Returns a lightweight summary list (id, title, timeLimit). This is a public endpoint.

### Endpoint

- Method: `GET`
- Path: `/lessons/:slug/quiz`
- Full URL: `http://localhost:8046/api/v1/lessons/:slug/quiz`

### Request

Path Parameters:

- `slug` (required): The unique slug identifier of the lesson

Example: `/lessons/introduction-to-go-1234567890/quiz`

### Responses

#### 200 OK

```json
{
  "success": true,
  "message": "Quizzes retrieved successfully",
  "data": [
    {
      "id": "string",
      "title": "string",
      "timeLimit": 30
    }
  ]
}
```

> Returns an empty array `[]` if the lesson has no quizzes yet.

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
  "message": "Failed to get quizzes"
}
```

---

## 3. Get Quiz by ID

### Feature

Retrieve the full details of a quiz by its ID, including all questions, options, correct answers, and time limit. This is a public endpoint — no authentication required.

### Endpoint

- Method: `GET`
- Path: `/quizzes/:id`
- Full URL: `http://localhost:8046/api/v1/quizzes/:id`

### Request

Path Parameters:

- `id` (required): The MongoDB ObjectID of the quiz

Example: `/quizzes/660a1b2c3d4e5f6a7b8c9d0e`

### Responses

#### 200 OK

```json
{
  "success": true,
  "message": "Quiz retrieved successfully",
  "data": {
    "id": "string",
    "lessonId": "string",
    "title": "string",
    "questions": [
      {
        "question": "string",
        "point": 10,
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option A"
      }
    ],
    "timeLimit": 30,
    "createdAt": "2026-03-26T10:00:00Z",
    "updatedAt": "2026-03-26T10:00:00Z"
  }
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Quiz not found"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to get quiz"
}
```

---

## 4. Update Quiz

### Feature

Update an existing quiz by its ID. Only the topic owner can update the quiz.

### Endpoint

- Method: `PUT`
- Path: `/quizzes/:id`
- Full URL: `http://localhost:8046/api/v1/quizzes/:id`

### Request

Headers:

- `Content-Type: application/json`
- `Authorization: Bearer <token>`

Path Parameters:

- `id` (required): The MongoDB ObjectID of the quiz

Body:

```json
{
  "title": "string",
  "questions": [
    {
      "question": "string",
      "point": 10,
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    }
  ],
  "timeLimit": 30
}
```

### Validation Rules

- `title`: required
- `questions`: required, minimum 1 item
  - `question`: required
  - `point`: required, minimum value is 1
  - `options`: required, minimum 2 items
  - `correctAnswer`: required
- `timeLimit`: required, minimum value is 1 (in minutes)

### Responses

#### 200 OK

```json
{
  "success": true,
  "message": "Quiz updated successfully"
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
  "message": "You don't have permission to update this quiz"
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Quiz not found"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to update quiz"
}
```

---

## 5. Delete Quiz

### Feature

Delete a quiz by its ID. Only the topic owner can delete the quiz.

### Endpoint

- Method: `DELETE`
- Path: `/quizzes/:id`
- Full URL: `http://localhost:8046/api/v1/quizzes/:id`

### Request

Headers:

- `Authorization: Bearer <token>`

Path Parameters:

- `id` (required): The MongoDB ObjectID of the quiz

### Responses

#### 200 OK

```json
{
  "success": true,
  "message": "Quiz deleted successfully"
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
  "message": "You don't have permission to delete this quiz"
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Quiz not found"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to delete quiz"
}
```

---

## 6. Submit Quiz

### Feature

Submit answers for a quiz. The server automatically calculates `totalScore` as a percentage based on correct answers and their point weights. Requires authentication.

### Endpoint

- Method: `POST`
- Path: `/quizzes/submit`
- Full URL: `http://localhost:8046/api/v1/quizzes/submit`

### Request

Headers:

- `Content-Type: application/json`
- `Authorization: Bearer <token>`

Body:

```json
{
  "quizId": "string",
  "answers": ["Option A", "Option C", "Option B"],
  "totalTime": 120
}
```

### Field Descriptions

- `quizId`: MongoDB ObjectID of the quiz being submitted
- `answers`: ordered list of answers corresponding to each question (by index)
- `totalTime`: time taken to complete the quiz in seconds

### Validation Rules

- `quizId`: required
- `answers`: required
- `totalTime`: required, minimum value is 0

### Score Calculation

The score is calculated as:

```
totalScore = (sum of points for correct answers / total points) * 100
```

Example: if quiz has 3 questions with points [10, 20, 10] and user answers 2 correctly (q1 and q3), score = (10 + 10) / 40 * 100 = 50.0

### Responses

#### 201 Created

```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "id": "string",
    "quizId": "string",
    "userId": "string",
    "answers": ["Option A", "Option C", "Option B"],
    "totalTime": 120,
    "totalScore": 66.67,
    "submittedAt": "2026-03-26T10:00:00Z"
  }
}
```

#### 400 Bad Request

```json
{
  "success": false,
  "message": "Invalid request format: <binding or validation error details>"
}
```

```json
{
  "success": false,
  "message": "Invalid quiz ID"
}
```

#### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Quiz not found"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to submit quiz"
}
```
