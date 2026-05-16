Base URL: `http://localhost:8046/api/v1`

# API Endpoints Overview

## Topics

- Create topic: POST `/topics`
- Get topics: GET `/topics?page=1&limit=10`
- Get topic by slug: GET `/topics/:slug`
- Update topic: PUT `/topics/:slug`
- Delete topic: DELETE `/topics/:slug`
- Get lessons in topic: GET `/topics/:slug/lessons?page=1&limit=10`

## Lessons

- Create lesson: POST `/lessons`
- Get lesson by slug: GET `/lessons/:slug`
- Update lesson: PUT `/lessons/:slug`
- Delete lesson: DELETE `/lessons/:slug`

## Content

- Create content: POST `/lessons/:slug/content`
- Get content: GET `/lessons/:slug/content`
- Update content: PUT `/lessons/:slug/content`
- Delete content: DELETE `/lessons/:slug/content`

## Quizzes

- Create quiz: POST `/quizzes`
- Get quiz by id: GET `/quizzes/:id`
- Get quiz by lesson slug: GET `/lessons/:slug/quiz`
- Update quiz: PUT `/quizzes/:id`
- Delete quiz: DELETE `/quizzes/:id`
- Submit quiz: POST `/quizzes/submit`

## Judge0

- Submit code: POST `/judge0/submit`
