---
title: "Database ER Diagram"
permalink: /docs/database/databaseer/
excerpt: "Entity-Relationship diagram and explanation"
last_modified_at: 2025-11-15
toc: true
---

# Database ER Diagram

## Entity-Relationship Diagram
```mermaid
erDiagram
    USERS ||--o{ ELECTIONS : creates
    USERS ||--o{ CANDIDATES : "becomes"
    USERS ||--o{ VOTES : casts
    ELECTIONS ||--o{ CANDIDATES : contains
    ELECTIONS ||--o{ VOTES : receives
    CANDIDATES ||--o{ VOTES : receives

    USERS {
        int id PK
        string username UK
        string email UK
        string password_hash
        string role
        boolean is_active
        timestamp created_at
    }

    ELECTIONS {
        int id PK
        string title
        text description
        datetime start_date
        datetime end_date
        string status
        int created_by FK
        timestamp created_at
    }

    CANDIDATES {
        int id PK
        int election_id FK
        int user_id FK
        string party
        text manifesto
        string photo_url
    }

    VOTES {
        int id PK
        int election_id FK
        int user_id FK
        int candidate_id FK
        string vote_hash
        timestamp timestamp
    }
```

## Relationships Explained

### Users to Elections (One-to-Many)
- One user (admin) can create multiple elections
- Each election is created by one user

### Users to Candidates (One-to-Many)
- One user can be a candidate in multiple elections
- Each candidate entry is linked to one user

### Users to Votes (One-to-Many)
- One user can cast multiple votes (in different elections)
- Each vote is cast by one user

### Elections to Candidates (One-to-Many)
- One election can have multiple candidates
- Each candidate belongs to one election

### Elections to Votes (One-to-Many)
- One election can receive multiple votes
- Each vote belongs to one election

### Candidates to Votes (One-to-Many)
- One candidate can receive multiple votes
- Each vote is for one candidate

## Cardinality Rules

1. **One vote per user per election**: Enforced by unique constraint `(election_id, user_id)`
2. **Active elections only**: Status field restricts voting to active elections
3. **Date validation**: Start date must be before end date
4. **Role-based access**: Only admins can create elections
