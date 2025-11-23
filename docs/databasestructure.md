```sql

CREATE DATABASE devovs;

USE devovs;

-- ============================================
-- ONLINE VOTING SYSTEM - FINAL SCHEMA
-- PG-DAC Project - Group 06
-- ============================================

-- 1. Create users table first (no dependencies)
-- Users can be both VOTERS and CANDIDATES
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    date_of_birth DATE NOT NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    id_proof_type ENUM('AADHAR', 'VOTER_ID') NOT NULL,
    id_proof_number VARCHAR(20) NOT NULL,
    profile_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_id_proof (id_proof_type, id_proof_number)
);

-- 2. Create admins table (separate admin accounts)
-- Admins have their own independent accounts
CREATE TABLE admins (
    admin_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_admin_email (email)
);

-- 3. Create elections table
CREATE TABLE elections (
    election_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    election_name VARCHAR(255) NOT NULL,
    election_type ENUM('GENERAL', 'STATE', 'LOCAL', 'SPECIAL') NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status ENUM('DRAFT', 'SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'DRAFT',
    result_published BOOLEAN DEFAULT FALSE,
    result_published_at TIMESTAMP NULL,
    result_published_by BIGINT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admins(admin_id) ON DELETE RESTRICT,
    FOREIGN KEY (result_published_by) REFERENCES admins(admin_id) ON DELETE SET NULL
);

-- 4. Create candidates table
-- Candidates are users standing for elections
-- Candidate data is hardcoded/predefined by admins
CREATE TABLE candidates (
    candidate_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    election_id BIGINT NOT NULL,
    party_name VARCHAR(255) NOT NULL,
    party_symbol VARCHAR(255) NOT NULL,
    candidate_photo BLOB,
    manifesto TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (election_id) REFERENCES elections(election_id) ON DELETE CASCADE,
    UNIQUE KEY unique_candidate_per_election (user_id, election_id),
    INDEX idx_election (election_id)
);

-- 5. Create votes table
-- Each user can vote only once per election
CREATE TABLE votes (
    vote_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    election_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    candidate_id BIGINT NOT NULL,
    vote_hash VARCHAR(255) UNIQUE NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (election_id) REFERENCES elections(election_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id) ON DELETE RESTRICT,
    UNIQUE KEY unique_vote_per_election (election_id, user_id),
    INDEX idx_election_votes (election_id)
);

-- 6. Create voter_election_status table
-- Track which users have voted in which elections
CREATE TABLE voter_election_status (
    status_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    election_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    has_voted BOOLEAN DEFAULT FALSE,
    voted_at TIMESTAMP NULL,
    FOREIGN KEY (election_id) REFERENCES elections(election_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_voter_election (election_id, user_id)
);

-- 7. Create election_results table
-- Admin generates and displays results here
CREATE TABLE election_results (
    result_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    election_id BIGINT NOT NULL,
    candidate_id BIGINT NOT NULL,
    vote_count BIGINT DEFAULT 0,
    vote_percentage DECIMAL(5,2),
    rank_position INT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (election_id) REFERENCES elections(election_id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id) ON DELETE RESTRICT,
    UNIQUE KEY unique_election_candidate (election_id, candidate_id)
);

-- 8. Create election_reports table
-- Admin generates comprehensive election reports
CREATE TABLE election_reports (
    report_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    election_id BIGINT NOT NULL,
    total_registered_voters BIGINT DEFAULT 0,
    total_votes_cast BIGINT DEFAULT 0,
    voter_turnout_percentage DECIMAL(5,2),
    total_candidates INT DEFAULT 0,
    winning_candidate_id BIGINT NULL,
    winning_margin BIGINT NULL,
    report_generated_by BIGINT NOT NULL,
    report_generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (election_id) REFERENCES elections(election_id) ON DELETE CASCADE,
    FOREIGN KEY (winning_candidate_id) REFERENCES candidates(candidate_id) ON DELETE SET NULL,
    FOREIGN KEY (report_generated_by) REFERENCES admins(admin_id) ON DELETE RESTRICT
);

-- 9. Create dummy verification tables
-- Primary verification: AADHAR and VOTER_ID (required)
CREATE TABLE dummy_aadhar_records (
    aadhar_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    aadhar_number VARCHAR(12) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT,
    is_valid BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_aadhar (aadhar_number)
);

CREATE TABLE dummy_voter_id_records (
    voter_record_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    voter_id_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_voter_id (voter_id_number)
);

-- Secondary verification: PAN and PASSPORT (optional)
CREATE TABLE dummy_pan_records (
    pan_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    pan_number VARCHAR(10) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pan (pan_number)
);

CREATE TABLE dummy_passport_records (
    passport_record_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    passport_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_passport (passport_number)
);

-- Insert sample data for Aadhar (Primary)
INSERT INTO dummy_aadhar_records (aadhar_number, full_name, date_of_birth, address) VALUES
('123456789012', 'Rajesh Kumar', '1995-01-15', '123 MG Road, Mumbai, Maharashtra'),
('234567890123', 'Priya Sharma', '1990-05-20', '456 CP Avenue, Delhi'),
('345678901234', 'Amit Patel', '1988-08-10', '789 Brigade Road, Bangalore, Karnataka'),
('456789012345', 'Sneha Desai', '1992-03-25', '321 Park Street, Pune, Maharashtra'),
('567890123456', 'Vikram Singh', '1985-11-30', '654 Mall Road, Jaipur, Rajasthan');

-- Insert sample data for Voter ID (Primary)
INSERT INTO dummy_voter_id_records (voter_id_number, full_name, date_of_birth) VALUES
('VOT1234567890', 'Rajesh Kumar', '1995-01-15'),
('VOT2345678901', 'Priya Sharma', '1990-05-20'),
('VOT3456789012', 'Amit Patel', '1988-08-10'),
('VOT4567890123', 'Sneha Desai', '1992-03-25'),
('VOT5678901234', 'Vikram Singh', '1985-11-30');

-- Insert sample data for PAN (Secondary - Optional)
INSERT INTO dummy_pan_records (pan_number, full_name, date_of_birth) VALUES
('ABCDE1234F', 'Rajesh Kumar', '1995-01-15'),
('BCDEF2345G', 'Priya Sharma', '1990-05-20'),
('CDEFG3456H', 'Amit Patel', '1988-08-10'),
('DEFGH4567I', 'Sneha Desai', '1992-03-25'),
('EFGHI5678J', 'Vikram Singh', '1985-11-30');

-- Insert sample data for Passport (Secondary - Optional)
INSERT INTO dummy_passport_records (passport_number, full_name, date_of_birth) VALUES
('P12345678', 'Rajesh Kumar', '1995-01-15'),
('P23456789', 'Priya Sharma', '1990-05-20'),
('P34567890', 'Amit Patel', '1988-08-10'),
('P45678901', 'Sneha Desai', '1992-03-25'),
('P56789012', 'Vikram Singh', '1985-11-30');

-- Create sample admin account (password: admin123)
INSERT INTO admins (email, password_hash, full_name, phone_number) VALUES
('admin@voting.com', 'p$2a$10$', 'System Administrator', '9876543210');

```

