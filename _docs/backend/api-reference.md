---
title: "API Reference"
permalink: /docs/backend/api-reference/
excerpt: "Complete API documentation"
last_modified_at: 2025-11-15
toc: true
---

# API Reference

## Base URL
```
http://localhost:8080/api
```

## Authentication

All API requests require authentication using JWT tokens.

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "user@example.com",
    "role": "voter"
  }
}
```

## Elections API

### Get All Elections
```http
GET /api/elections
Authorization: Bearer {token}
```

### Create Election
```http
POST /api/elections
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Student Council Election 2025",
  "description": "Annual student council election",
  "startDate": "2025-12-01T09:00:00",
  "endDate": "2025-12-01T17:00:00"
}
```

### Get Election Details
```http
GET /api/elections/{id}
Authorization: Bearer {token}
```

## Voting API

### Cast Vote
```http
POST /api/votes
Authorization: Bearer {token}
Content-Type: application/json

{
  "electionId": 1,
  "candidateId": 5
}
```

### Get Vote Results
```http
GET /api/elections/{id}/results
Authorization: Bearer {token}
```

## Error Responses
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "status": 401
}
```
