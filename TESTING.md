# Testing Instructions

## Prerequisites
1. **Java 21** installed.
2. **Node.js** (v18+ recommended) installed.
3. **MySQL** installed and running.

## Database Setup
1. Create a database named `devovs` in MySQL.
   ```sql
   CREATE DATABASE devovs;
   ```
2. Ensure your MySQL user is `root` with password `password`. If different, update `backend/onlinevotingsystem/src/main/resources/application.properties`.

## Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend/onlinevotingsystem
   ```
2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   (On Windows, use `mvnw spring-boot:run`)

   *The application will start on port 8080.*

## Running the Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at http://localhost:5173*

## Testing the Flow

### 1. Admin Login
- Go to http://localhost:5173/login
- Login with:
  - Email: `admin@voting.com`
  - Password: `admin123`
- You will be redirected to the **Admin Dashboard**.
- **Actions**:
  - Create a new Election (e.g., "General Election 2024").
  - Change status to `SCHEDULED` then `ACTIVE`.
  - **Add Candidates**: You need a valid User ID to add a candidate. You must register a user first to make them a candidate.

### 2. User Registration & Verification
- Go to http://localhost:5173/register
- Fill in the details.
- **Verification**:
  - Use ID Proof: `AADHAR`
  - Number: `123456789012`
  - Full Name: `John Doe`
  - DOB: `01-01-1990` (Select in date picker)
- Click Register. If details match the seeded dummy data, registration succeeds.

### 3. User Login & Voting
- Login with the newly registered user credentials.
- You will be redirected to the **User Dashboard**.
- You should see the Active Election you created as Admin.
- Click **Vote Now**.
- Select a candidate and confirm.
- Once voted, the button changes to "You Voted".

### 4. Viewing Results
- **As User**: Click "View Live Results" on the election card.
- **As Admin**: Go to dashboard, click "Calc Results" then "View Results".

## Seeded Data
- **Admin**: `admin@voting.com` / `admin123`
- **Dummy Aadhar**: `123456789012`, Name: `John Doe`, DOB: `1990-01-01`
- **Dummy Voter ID**: `ABC1234567`, Name: `Jane Doe`, DOB: `1992-02-02`


### User Credentials

| # | Email Address | Password |
|---|---|---|
| 1 | rajesh.kumar@email.com | rajesh |
| 2 | priya.sharma@email.com | prive |
| 3 | amit.patel@email.com | amit |
| 4 | sneha.desai@email.com | sneha |
| 5 | vikram.singh@email.com | pasworvikram |
| 6 | anita.verma@email.com | passwordanita |
| 7 | rahul.mehta@email.com | passwordrahul |
| 8 | kavita.nair@email.com | passwo |
| 9 | suresh.reddy@email.com | paswosu |
| 10 | meena.iyer@email.com | passwome |
| 11 | anil.gupta@email.com | passwomn |
| 12 | pooja.joshi@email.com | passwopo |
| 13 | deepak.saxena@email.com | passwode |
| 14 | neha.kapoor@email.com | passwonela |
| 15 | ravi.krishnan@email.com | passworavi |
| 16 | shalini.das@email.com | passwoshala |
| 17 | manish.yadav@email.com | passwomina |
| 18 | divya.menon@email.com | passwodivya |
| 19 | arjun.pandey@email.com | passoarjun |
| 20 | ritika.singh@email.com | passwrit |

### Admin Credentials

| # | Email Address | Password |
|---|---|---|
| 1 | admin@voting.com | admin123 |
| 2 | admin.secondary@voting.com | admin123 |