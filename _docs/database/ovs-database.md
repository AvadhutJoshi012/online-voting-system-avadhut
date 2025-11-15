---
title: "OVS Database"
permalink: /docs/database/ovs-database/
excerpt: "Overview of the OVS database structure"
last_modified_at: 2025-11-15
toc: true
---

# OVS Database Overview

## Database Schema

The Online Voting System uses a relational database to store all system data.

## Main Tables

### Users Table

Stores user information and credentials.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| username | VARCHAR(50) | Unique username |
| email | VARCHAR(100) | User email |
| password_hash | VARCHAR(255) | Hashed password |
| role | ENUM | User role (admin/voter) |
| created_at | TIMESTAMP | Account creation time |

### Elections Table

Stores election information.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| title | VARCHAR(200) | Election title |
| description | TEXT | Election description |
| start_date | DATETIME | Election start time |
| end_date | DATETIME | Election end time |
| status | ENUM | Election status |

### Votes Table

Stores cast votes (encrypted).

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| election_id | INT | Foreign key to elections |
| user_id | INT | Foreign key to users |
| candidate_id | INT | Foreign key to candidates |
| vote_hash | VARCHAR(255) | Encrypted vote |
| timestamp | TIMESTAMP | Vote cast time |

## Relationships

- One election has many candidates
- One election has many votes
- One user can cast one vote per election
- Each vote is linked to one candidate
