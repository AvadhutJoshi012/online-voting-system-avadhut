# Online Voting System - Complete Database Documentation

## 📋 Project Overview
This is a PG-DAC Online Voting System with separate admin and user dashboards. Users can register, verify their identity, vote in active elections, and view results. Admins manage elections, candidates, and generate reports.

---

## 🏗️ Database Architecture

### Core Entities and Relationships

```
users (voter & candidate base)
    ├── admins (separate admin accounts)
    ├── candidates (users standing for elections)
    │   └── elections
    │       ├── election_results
    │       ├── election_reports
    │       └── votes
    └── voter_election_status (voting history tracking)

Verification Tables (for user registration):
    ├── dummy_aadhar_records (PRIMARY - REQUIRED)
    ├── dummy_voter_id_records (PRIMARY - REQUIRED)
    ├── dummy_pan_records (SECONDARY - OPTIONAL)
    └── dummy_passport_records (SECONDARY - OPTIONAL)
```

---

## 📊 Table Details

### 1. **users** table
**Purpose**: Core user table for both voters and candidates

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| user_id | BIGINT | PK | Auto-increment |
| email | VARCHAR(255) | UNIQUE | User login email |
| password_hash | VARCHAR(255) | - | Bcrypt hashed password |
| full_name | VARCHAR(255) | - | Full name |
| phone_number | VARCHAR(20) | - | Contact number |
| date_of_birth | DATE | - | Required for verification |
| gender | ENUM | - | MALE, FEMALE, OTHER |
| address, city, state, pincode | TEXT/VARCHAR | - | Address details |
| id_proof_type | ENUM | FK | AADHAR or VOTER_ID (PRIMARY) |
| id_proof_number | VARCHAR(20) | - | Proof ID number |
| profile_image_url | VARCHAR(500) | - | Profile picture |
| is_active | BOOLEAN | - | Account active status |
| is_verified | BOOLEAN | - | Verification status (checked against dummy tables) |
| approved_at | TIMESTAMP | - | When admin approved user |
| created_at, updated_at | TIMESTAMP | - | Audit timestamps |

**Sample Data**: 20 test users (both male and female from different states)

---

### 2. **admins** table
**Purpose**: Separate admin accounts (NOT from users table)

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| admin_id | BIGINT | PK | Auto-increment |
| email | VARCHAR(255) | UNIQUE | Admin login email |
| password_hash | VARCHAR(255) | - | Bcrypt hashed password |
| full_name | VARCHAR(255) | - | Full name |
| phone_number | VARCHAR(20) | - | Contact number |
| is_active | BOOLEAN | - | Admin active status |
| created_at, updated_at | TIMESTAMP | - | Audit timestamps |

**Sample Data**: 2 admins (admin.primary@voting.com, admin.secondary@voting.com)

---

### 3. **elections** table
**Purpose**: Manage all elections (ongoing, scheduled, completed)

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| election_id | BIGINT | PK | Auto-increment |
| election_name | VARCHAR(255) | - | E.g., "Maharashtra State Assembly" |
| election_type | ENUM | - | GENERAL, STATE, LOCAL, SPECIAL |
| start_date | DATETIME | - | Election start time |
| end_date | DATETIME | - | Election end time |
| status | ENUM | - | DRAFT, SCHEDULED, ACTIVE, COMPLETED, CANCELLED |
| result_published | BOOLEAN | - | Results published flag |
| result_published_at | TIMESTAMP | - | When results were published |
| result_published_by | BIGINT | FK | Admin who published results |
| created_by | BIGINT | FK | Admin who created election |

**Sample Data**: 
- 2 ACTIVE elections (Maharashtra State, Mumbai Municipal)
- 2 COMPLETED elections (Karnataka State 2024, Delhi Municipal 2024)

---

### 4. **candidates** table
**Purpose**: Store candidates standing for specific elections

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| candidate_id | BIGINT | PK | Auto-increment |
| user_id | BIGINT | FK | References users (candidate IS a user) |
| election_id | BIGINT | FK | Which election they're standing for |
| party_name | VARCHAR(255) | - | Political party name |
| party_symbol | VARCHAR(255) | - | Party symbol name |
| candidate_photo | BLOB | - | Candidate photo |
| manifesto | TEXT | - | Candidate's election manifesto |
| created_at | TIMESTAMP | - | When candidate registered |

**Unique Constraint**: One user can be candidate in only one election (user_id + election_id)

**Sample Data**: 5 candidates per election (predefined by admins)

---

### 5. **votes** table
**Purpose**: Record all votes cast by users

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| vote_id | BIGINT | PK | Auto-increment |
| election_id | BIGINT | FK | Which election |
| user_id | BIGINT | FK | Who voted (voter) |
| candidate_id | BIGINT | FK | Who they voted for (candidate) |
| vote_hash | VARCHAR(255) | UNIQUE | Hash for vote anonymity |
| voted_at | TIMESTAMP | - | When vote was cast |

**Unique Constraint**: One user can vote only ONCE per election (election_id + user_id)

**Sample Data**: 
- Election 1: 17 votes cast (users 1-17), users 18-20 did NOT vote
- Election 2: 18 votes cast (users 1-18), users 19-20 did NOT vote

---

### 6. **voter_election_status** table
**Purpose**: Track voting participation and history

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| status_id | BIGINT | PK | Auto-increment |
| election_id | BIGINT | FK | Which election |
| user_id | BIGINT | FK | Which user |
| has_voted | BOOLEAN | - | TRUE if user voted, FALSE if not |
| voted_at | TIMESTAMP | - | When they voted (NULL if not voted) |

**Unique Constraint**: One record per user per election

---

### 7. **election_results** table
**Purpose**: Store computed election results for display

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| result_id | BIGINT | PK | Auto-increment |
| election_id | BIGINT | FK | Which election |
| candidate_id | BIGINT | FK | Which candidate |
| vote_count | BIGINT | - | Total votes received |
| vote_percentage | DECIMAL(5,2) | - | Percentage of votes (XX.XX) |
| rank_position | INT | - | Ranking (1st, 2nd, 3rd, etc.) |
| last_updated | TIMESTAMP | - | When results were last updated |

**Unique Constraint**: One result record per candidate per election

**Sample Data**:
- Election 1: Candidate 2 leads with 6 votes (35.29%), Candidate 1 has 5 votes (29.41%)
- Election 2: Candidates 6 & 7 tied with 6 votes each (33.33%)

---

### 8. **election_reports** table
**Purpose**: Comprehensive election statistics and analysis

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| report_id | BIGINT | PK | Auto-increment |
| election_id | BIGINT | FK | Which election |
| total_registered_voters | BIGINT | - | Total voters eligible |
| total_votes_cast | BIGINT | - | Actual votes received |
| voter_turnout_percentage | DECIMAL(5,2) | - | (votes_cast / registered) * 100 |
| total_candidates | INT | - | Number of candidates |
| winning_candidate_id | BIGINT | FK | ID of winning candidate |
| winning_margin | BIGINT | - | Difference between 1st & 2nd |
| report_generated_by | BIGINT | FK | Admin who generated report |
| report_generated_at | TIMESTAMP | - | When report was created |

**Sample Data**:
- Election 1: 17/20 voters (85% turnout), winner: Candidate 2 with margin of 1
- Election 2: 18/20 voters (90% turnout), winner: Candidates 6 & 7 tied (margin 0)

---

### 9. **dummy_aadhar_records** table (PRIMARY VERIFICATION)
**Purpose**: Verify user identity using Aadhar cards

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| aadhar_id | BIGINT | PK | Auto-increment |
| aadhar_number | VARCHAR(12) | UNIQUE | 12-digit Aadhar |
| full_name | VARCHAR(255) | - | Name on Aadhar |
| date_of_birth | DATE | - | DOB from Aadhar |
| address | TEXT | - | Address from Aadhar |
| is_valid | BOOLEAN | - | Whether this Aadhar is valid |
| created_at | TIMESTAMP | - | Record creation date |

**Usage**: When user registers with AADHAR as id_proof_type, match aadhar_number + full_name + date_of_birth

---

### 10. **dummy_voter_id_records** table (PRIMARY VERIFICATION)
**Purpose**: Verify user identity using Voter IDs

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| voter_record_id | BIGINT | PK | Auto-increment |
| voter_id_number | VARCHAR(20) | UNIQUE | Voter ID number |
| full_name | VARCHAR(255) | - | Name on Voter ID |
| date_of_birth | DATE | - | DOB from Voter ID |
| is_valid | BOOLEAN | - | Whether this Voter ID is valid |
| created_at | TIMESTAMP | - | Record creation date |

**Usage**: When user registers with VOTER_ID as id_proof_type, match voter_id_number + full_name + date_of_birth

---

### 11. **dummy_pan_records** table (SECONDARY VERIFICATION - OPTIONAL)
**Purpose**: Additional identity verification using PAN cards

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| pan_id | BIGINT | PK | Auto-increment |
| pan_number | VARCHAR(10) | UNIQUE | PAN card number |
| full_name | VARCHAR(255) | - | Name on PAN |
| date_of_birth | DATE | - | DOB from PAN |
| is_valid | BOOLEAN | - | Whether this PAN is valid |
| created_at | TIMESTAMP | - | Record creation date |

---

### 12. **dummy_passport_records** table (SECONDARY VERIFICATION - OPTIONAL)
**Purpose**: Additional identity verification using Passports

| Column | Type | Key | Notes |
|--------|------|-----|-------|
| passport_record_id | BIGINT | PK | Auto-increment |
| passport_number | VARCHAR(20) | UNIQUE | Passport number |
| full_name | VARCHAR(255) | - | Name on Passport |
| date_of_birth | DATE | - | DOB from Passport |
| is_valid | BOOLEAN | - | Whether this Passport is valid |
| created_at | TIMESTAMP | - | Record creation date |

---

## 🔄 Application Flow

### User Registration Flow
```
1. User fills registration form
2. User selects id_proof_type: AADHAR or VOTER_ID (required)
3. Backend validates against dummy_aadhar_records OR dummy_voter_id_records
   - Match: aadhar_number/voter_id_number + full_name + date_of_birth
4. If match found AND is_valid = TRUE:
   - User created in users table with is_verified = TRUE
   - If admin approves: approved_at timestamp set
5. User can optionally add PAN or PASSPORT (secondary verification)
```

### Voting Flow
```
1. User logs in to http://localhost:5173/user
2. System fetches ACTIVE elections only
3. User can vote in only ONE active election at a time
4. When user votes:
   - Check: has user already voted in this election? (votes table)
   - If NO: Create vote record with vote_hash
   - Update voter_election_status: has_voted = TRUE, voted_at = NOW()
5. Vote cannot be changed or deleted
```

### Admin Dashboard Flow
```
1. Admin logs in to http://localhost:5173/admin
2. Admin can:
   a) Manage Elections:
      - Create new election (status = DRAFT)
      - Change status: DRAFT → SCHEDULED → ACTIVE → COMPLETED
      - Cancel elections
   
   b) Manage Candidates:
      - Add candidates (predefined by developers/higher authority)
      - Edit party name, symbol, manifesto
      - Delete if needed
   
   c) View Live Results:
      - Fetch from election_results table
      - Show real-time vote counts and percentages
   
   d) Generate Reports:
      - Fetch from election_reports table
      - Show voter turnout, winner info, winning margin
      - Publish results (result_published = TRUE)
   
   e) Manage Users:
      - View all users with verification status
      - Edit user details if needed
      - Approve/reject user accounts
```

---

## 📊 Current Test Data Summary

### Users: 20 total
- All users are verified (is_verified = TRUE)
- All users are approved (approved_at has timestamp)
- 10 used AADHAR as id_proof, 10 used VOTER_ID

### Elections: 4 total
- **2 ACTIVE Elections** (users can vote NOW):
  - Election 1: Maharashtra State Assembly (5 candidates, 17 votes cast)
  - Election 2: Mumbai Municipal Corporation (5 candidates, 18 votes cast)
- **2 COMPLETED Elections** (past elections, results published):
  - Election 3: Karnataka State Assembly 2024
  - Election 4: Delhi Municipal Corporation 2024

### Candidates: 10 total
- 5 candidates in each active election
- Each candidate is a unique user
- Each has party name, symbol, and manifesto

### Votes: 35 total
- Election 1: 17 votes (users 1-17 voted, 18-20 abstained)
- Election 2: 18 votes (users 1-18 voted, 19-20 abstained)

---

## 🔐 Key Constraints & Business Rules

1. **One Vote Per User Per Election**: UNIQUE(election_id, user_id) in votes table
2. **One Candidate Per Election Per User**: UNIQUE(user_id, election_id) in candidates table
3. **Cannot Delete Active Election**: Foreign key constraints prevent deletion if votes exist
4. **Permanent Vote Record**: Votes cannot be modified or deleted (ON DELETE RESTRICT)
5. **Users Can Be Both Voters And Candidates**: Same user can vote in one election and be a candidate in another
6. **Primary ID Proof Required**: Either AADHAR or VOTER_ID must be valid
7. **Secondary ID Proof Optional**: PAN and PASSPORT are for additional verification only
8. **One Active Election At A Time**: System design allows only 1 active election per user session

---

## 🔗 API Query Examples

### Get Active Elections
```
SELECT * FROM elections WHERE status = 'ACTIVE'
```

### Check If User Already Voted
```
SELECT * FROM votes 
WHERE election_id = ? AND user_id = ?
```

### Get Candidates For An Election
```
SELECT c.*, u.full_name, u.profile_image_url 
FROM candidates c
JOIN users u ON c.user_id = u.user_id
WHERE c.election_id = ?
```

### Get Election Results
```
SELECT er.*, u.full_name, u.profile_image_url, c.party_name, c.party_symbol
FROM election_results er
JOIN candidates c ON er.candidate_id = c.candidate_id
JOIN users u ON c.user_id = u.user_id
WHERE er.election_id = ?
ORDER BY er.rank_position ASC
```

### Get Election Report
```
SELECT * FROM election_reports WHERE election_id = ?
```

### Verify User Identity (Registration)
```
SELECT * FROM dummy_aadhar_records 
WHERE aadhar_number = ? AND full_name = ? AND date_of_birth = ? AND is_valid = TRUE
```

---

## 📝 Important Notes for AI Agent

1. **Candidates ARE Users**: When creating candidates, their data comes from the users table (user_id foreign key)
2. **Vote Anonymity**: vote_hash ensures vote anonymity but can track if a user voted
3. **Admin Separate from Users**: Admins have completely separate authentication (admins table)
4. **Verification on Registration**: Use dummy verification tables to validate before user approval
5. **Real-time Results**: election_results table is updated as votes come in (or computed after election closes)
6. **No Vote Modification**: Once cast, votes cannot be changed (enforce at application level too)
7. **Turnout Calculation**: voter_turnout_percentage = (total_votes_cast / total_registered_voters) * 100
