
SET SQL_SAFE_UPDATES = 0;

CREATE DATABASE IF NOT EXISTS devovs;

USE devovs;

-- ============================================
-- ONLINE VOTING SYSTEM - FINAL SCHEMA
-- PG-DAC Project - Group 06
-- ============================================

-- 1. Create users table first (no dependencies)
-- Users can be both VOTERS and CANDIDATES
-- Modified to include specific Aadhar and Voter ID columns as required
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255),
    date_of_birth DATE NOT NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    aadhar_number VARCHAR(12) UNIQUE NOT NULL,
    voter_id_number VARCHAR(20) UNIQUE NOT NULL,
    pan_card_number VARCHAR(255),
    passport_number VARCHAR(255),
    profile_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_aadhar (aadhar_number),
    INDEX idx_voter (voter_id_number)
);

-- 2. Create admins table (separate admin accounts)
-- Admins have their own independent accounts
CREATE TABLE admins (
    admin_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255),
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
    city VARCHAR(100),
    state VARCHAR(100),
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
    candidate_photo LONGBLOB,
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

-- 7. UPDATE dummy verification tables with the 20 inserted users

-- Insert verification records for 20 existing users
INSERT INTO dummy_aadhar_records (aadhar_number, full_name, date_of_birth, address) VALUES
('123456789012', 'Rajesh Kumar', '1995-01-15', '123 MG Road, Mumbai, Maharashtra'),
('990000000002', 'Priya Sharma', '1990-05-20', '456 CP Avenue, Delhi, Delhi'),
('345678901234', 'Amit Patel', '1988-08-10', '789 Brigade Road, Bangalore, Karnataka'),
('990000000004', 'Sneha Desai', '1992-03-25', '321 Park Street, Pune, Maharashtra'),
('567890123456', 'Vikram Singh', '1985-11-30', '654 Mall Road, Jaipur, Rajasthan'),
('990000000006', 'Anita Verma', '1993-07-18', '234 Lake Road, Kolkata, West Bengal'),
('678901234567', 'Rahul Mehta', '1991-12-05', '567 Station Road, Ahmedabad, Gujarat'),
('990000000008', 'Kavita Nair', '1989-04-22', '890 Beach Road, Chennai, Tamil Nadu'),
('789012345678', 'Suresh Reddy', '1987-09-14', '123 Tech Park, Hyderabad, Telangana'),
('990000000010', 'Meena Iyer', '1994-06-08', '456 Garden View, Kochi, Kerala'),
('890123456789', 'Anil Gupta', '1986-02-28', '789 Civil Lines, Lucknow, Uttar Pradesh'),
('990000000012', 'Pooja Joshi', '1996-10-12', '234 University Road, Indore, Madhya Pradesh'),
('901234567890', 'Deepak Saxena', '1990-08-19', '567 Market Square, Bhopal, Madhya Pradesh'),
('990000000014', 'Neha Kapoor', '1992-11-03', '890 Hill View, Shimla, Himachal Pradesh'),
('012345678901', 'Ravi Krishnan', '1988-03-17', '123 Temple Street, Madurai, Tamil Nadu'),
('990000000016', 'Shalini Das', '1995-05-29', '456 Fort Road, Guwahati, Assam'),
('123456789013', 'Manish Yadav', '1991-07-21', '789 Railway Colony, Patna, Bihar'),
('990000000018', 'Divya Menon', '1993-09-09', '234 Beach Front, Thiruvananthapuram, Kerala'),
('234567890124', 'Arjun Pandey', '1989-12-24', '567 Ring Road, Nagpur, Maharashtra'),
('990000000020', 'Ritika Singh', '1994-01-31', '890 Cantonment, Dehradun, Uttarakhand');

INSERT INTO dummy_voter_id_records (voter_id_number, full_name, date_of_birth) VALUES
('VOT9900000001', 'Rajesh Kumar', '1995-01-15'),
('VOT2345678901', 'Priya Sharma', '1990-05-20'),
('VOT9900000003', 'Amit Patel', '1988-08-10'),
('VOT4567890123', 'Sneha Desai', '1992-03-25'),
('VOT9900000005', 'Vikram Singh', '1985-11-30'),
('VOT6789012345', 'Anita Verma', '1993-07-18'),
('VOT9900000007', 'Rahul Mehta', '1991-12-05'),
('VOT7890123456', 'Kavita Nair', '1989-04-22'),
('VOT9900000009', 'Suresh Reddy', '1987-09-14'),
('VOT8901234567', 'Meena Iyer', '1994-06-08'),
('VOT9900000011', 'Anil Gupta', '1986-02-28'),
('VOT9012345678', 'Pooja Joshi', '1996-10-12'),
('VOT9900000013', 'Deepak Saxena', '1990-08-19'),
('VOT0123456789', 'Neha Kapoor', '1992-11-03'),
('VOT9900000015', 'Ravi Krishnan', '1988-03-17'),
('VOT1234567891', 'Shalini Das', '1995-05-29'),
('VOT9900000017', 'Manish Yadav', '1991-07-21'),
('VOT2345678902', 'Divya Menon', '1993-09-09'),
('VOT9900000019', 'Arjun Pandey', '1989-12-24'),
('VOT3456789013', 'Ritika Singh', '1994-01-31');

INSERT INTO dummy_pan_records (pan_number, full_name, date_of_birth) VALUES
('ABCDE1001Z', 'Rajesh Kumar', '1995-01-15'),
('ABCDE1002Z', 'Priya Sharma', '1990-05-20'),
('ABCDE1003Z', 'Amit Patel', '1988-08-10'),
('ABCDE1004Z', 'Sneha Desai', '1992-03-25'),
('ABCDE1005Z', 'Vikram Singh', '1985-11-30'),
('ABCDE1006Z', 'Anita Verma', '1993-07-18'),
('ABCDE1007Z', 'Rahul Mehta', '1991-12-05'),
('ABCDE1008Z', 'Kavita Nair', '1989-04-22'),
('ABCDE1009Z', 'Suresh Reddy', '1987-09-14'),
('ABCDE1010Z', 'Meena Iyer', '1994-06-08'),
('ABCDE1011Z', 'Anil Gupta', '1986-02-28'),
('ABCDE1012Z', 'Pooja Joshi', '1996-10-12'),
('ABCDE1013Z', 'Deepak Saxena', '1990-08-19'),
('ABCDE1014Z', 'Neha Kapoor', '1992-11-03'),
('ABCDE1015Z', 'Ravi Krishnan', '1988-03-17'),
('ABCDE1016Z', 'Shalini Das', '1995-05-29'),
('ABCDE1017Z', 'Manish Yadav', '1991-07-21'),
('ABCDE1018Z', 'Divya Menon', '1993-09-09'),
('ABCDE1019Z', 'Arjun Pandey', '1989-12-24'),
('ABCDE1020Z', 'Ritika Singh', '1994-01-31');

INSERT INTO dummy_passport_records (passport_number, full_name, date_of_birth) VALUES
('P9900001', 'Rajesh Kumar', '1995-01-15'),
('P9900002', 'Priya Sharma', '1990-05-20'),
('P9900003', 'Amit Patel', '1988-08-10'),
('P9900004', 'Sneha Desai', '1992-03-25'),
('P9900005', 'Vikram Singh', '1985-11-30'),
('P9900006', 'Anita Verma', '1993-07-18'),
('P9900007', 'Rahul Mehta', '1991-12-05'),
('P9900008', 'Kavita Nair', '1989-04-22'),
('P9900009', 'Suresh Reddy', '1987-09-14'),
('P9900010', 'Meena Iyer', '1994-06-08'),
('P9900011', 'Anil Gupta', '1986-02-28'),
('P9900012', 'Pooja Joshi', '1996-10-12'),
('P9900013', 'Deepak Saxena', '1990-08-19'),
('P9900014', 'Neha Kapoor', '1992-11-03'),
('P9900015', 'Ravi Krishnan', '1988-03-17'),
('P9900016', 'Shalini Das', '1995-05-29'),
('P9900017', 'Manish Yadav', '1991-07-21'),
('P9900018', 'Divya Menon', '1993-09-09'),
('P9900019', 'Arjun Pandey', '1989-12-24'),
('P9900020', 'Ritika Singh', '1994-01-31');

-- Insert 10 new unassigned verification records
INSERT INTO dummy_aadhar_records (aadhar_number, full_name, date_of_birth, address) VALUES
('880000000000', 'Yadnyesh', '2000-01-01', '123 Test Lane, Test City, Test State'),
('880000000001', 'Rushikesh', '2000-01-01', '123 Test Lane, Test City, Test State'),
('880000000002', 'Aavdut', '2000-01-01', '123 Test Lane, Test City, Test State'),
('880000000003', 'Aaman', '2000-01-01', '123 Test Lane, Test City, Test State'),
('880000000004', 'Deepak', '2000-01-01', '123 Test Lane, Test City, Test State'),
('880000000005', 'Yadnyesh Kolte', '2000-01-01', '123 Test Lane, Test City, Test State'),
('880000000006', 'Rushikesh More', '2000-01-01', '123 Test Lane, Test City, Test State'),
('880000000007', 'Aavdut Joshi', '2000-01-01', '123 Test Lane, Test City, Test State'),
('880000000008', 'Aaman Sayyad', '2000-01-01', '123 Test Lane, Test City, Test State'),
('880000000009', 'Deepak Revgade', '2000-01-01', '123 Test Lane, Test City, Test State');

INSERT INTO dummy_voter_id_records (voter_id_number, full_name, date_of_birth) VALUES
('VOT8800000000', 'Yadnyesh', '2000-01-01'),
('VOT8800000001', 'Rushikesh', '2000-01-01'),
('VOT8800000002', 'Aavdut', '2000-01-01'),
('VOT8800000003', 'Aaman', '2000-01-01'),
('VOT8800000004', 'Deepak', '2000-01-01'),
('VOT8800000005', 'Yadnyesh Kolte', '2000-01-01'),
('VOT8800000006', 'Rushikesh More', '2000-01-01'),
('VOT8800000007', 'Aavdut Joshi', '2000-01-01'),
('VOT8800000008', 'Aaman Sayyad', '2000-01-01'),
('VOT8800000009', 'Deepak Revgade', '2000-01-01');

INSERT INTO dummy_pan_records (pan_number, full_name, date_of_birth) VALUES
('FGHIJ2000K', 'Yadnyesh', '2000-01-01'),
('FGHIJ2001K', 'Rushikesh', '2000-01-01'),
('FGHIJ2002K', 'Aavdut', '2000-01-01'),
('FGHIJ2003K', 'Aaman', '2000-01-01'),
('FGHIJ2004K', 'Deepak', '2000-01-01'),
('FGHIJ2005K', 'Yadnyesh Kolte', '2000-01-01'),
('FGHIJ2006K', 'Rushikesh More', '2000-01-01'),
('FGHIJ2007K', 'Aavdut Joshi', '2000-01-01'),
('FGHIJ2008K', 'Aaman Sayyad', '2000-01-01'),
('FGHIJ2009K', 'Deepak Revgade', '2000-01-01');

INSERT INTO dummy_passport_records (passport_number, full_name, date_of_birth) VALUES
('P8800000', 'Yadnyesh', '2000-01-01'),
('P8800001', 'Rushikesh', '2000-01-01'),
('P8800002', 'Aavdut', '2000-01-01'),
('P8800003', 'Aaman', '2000-01-01'),
('P8800004', 'Deepak', '2000-01-01'),
('P8800005', 'Yadnyesh Kolte', '2000-01-01'),
('P8800006', 'Rushikesh More', '2000-01-01'),
('P8800007', 'Aavdut Joshi', '2000-01-01'),
('P8800008', 'Aaman Sayyad', '2000-01-01'),
('P8800009', 'Deepak Revgade', '2000-01-01');



-- ============================================
-- TEST DATA INSERTION
-- ============================================


-- 1. INSERT 20 USERS WITH BCRYPT HASHED PASSWORDS
-- Updated to include both AADHAR and VOTER_ID for each user
INSERT INTO users (email, password_hash, full_name, phone_number, date_of_birth, gender, address, city, state, pincode, aadhar_number, voter_id_number, profile_image_url, is_active, is_verified, approved_at) VALUES
('rajesh.kumar@email.com', '$2a$12$h2bW9dGj8X89JMBBHjvffe2jKCerIAzPFK.LsQiy0yV3fOk/NwiV6', 'Rajesh Kumar', '9876543210', '1995-01-15', 'MALE', '123 MG Road', 'Mumbai', 'Maharashtra', '400001', '123456789012', 'VOT9900000001', '/api/user/profile/photo/1.jpg', TRUE, TRUE, '2024-01-10 10:00:00'),
('priya.sharma@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Priya Sharma', '9876543211', '1990-05-20', 'FEMALE', '456 CP Avenue', 'Delhi', 'Delhi', '110001', '990000000002', 'VOT2345678901', '/api/user/profile/photo/2.jpg', TRUE, TRUE, '2024-01-10 10:30:00'),
('amit.patel@email.com', '$2a$12$0XWI2r/7LgSn6twF9XBZWegKk85neQGOQkjdZutCEsccmAjWwQ1OK', 'Amit Patel', '9876543212', '1988-08-10', 'MALE', '789 Brigade Road', 'Bangalore', 'Karnataka', '560001', '345678901234', 'VOT9900000003', '/api/user/profile/photo/3.jpg', TRUE, TRUE, '2024-01-10 11:00:00'),
('sneha.desai@email.com', '$2a$12$GKbNrwaaUdIT0.3t.Qks8uI2KQvAvjT3WL8nK.rr9DbDEXglXm5Om', 'Sneha Desai', '9876543213', '1992-03-25', 'FEMALE', '321 Park Street', 'Pune', 'Maharashtra', '411001', '990000000004', 'VOT4567890123', '/api/user/profile/photo/4.jpg', TRUE, TRUE, '2024-01-10 11:30:00'),
('vikram.singh@email.com', '$2a$12$.IG7McJt2tLTfIzPS3msluu0mqH7KxpwAkhoeGYKDV1Ig9q5dOzra', 'Vikram Singh', '9876543214', '1985-11-30', 'MALE', '654 Mall Road', 'Jaipur', 'Rajasthan', '302001', '567890123456', 'VOT9900000005', '/api/user/profile/photo/5.jpg', TRUE, TRUE, '2024-01-10 12:00:00'),
('anita.verma@email.com', '$2a$12$rhrdrh19jqkEF5.8QcP9seYGIeC6nrZuiTicoOszmvgF64iZa21VS', 'Anita Verma', '9876543215', '1993-07-18', 'FEMALE', '234 Lake Road', 'Kolkata', 'West Bengal', '700001', '990000000006', 'VOT6789012345', '/api/user/profile/photo/6.jpg', TRUE, TRUE, '2024-01-11 09:00:00'),
('rahul.mehta@email.com', '$2a$12$vyYQkoMHbyFqOIJ0F07HoezJ/kN/UOJUYuYw.eZAdeDSAabI6zBCm', 'Rahul Mehta', '9876543216', '1991-12-05', 'MALE', '567 Station Road', 'Ahmedabad', 'Gujarat', '380001', '678901234567', 'VOT9900000007', '/api/user/profile/photo/7.jpg', TRUE, TRUE, '2024-01-11 09:30:00'),
('kavita.nair@email.com', '$2a$12$rTOeBs9Dz3IPFlPFQxyEaOrflZ3KqmKeOGA1cAbnWYb2BKt4XZPHm', 'Kavita Nair', '9876543217', '1989-04-22', 'FEMALE', '890 Beach Road', 'Chennai', 'Tamil Nadu', '600001', '990000000008', 'VOT7890123456', '/api/user/profile/photo/8.jpg', TRUE, TRUE, '2024-01-11 10:00:00'),
('suresh.reddy@email.com', '$2a$12$F2U/XiDNCaNI4Z3mqc1ITe/E3VCbsJ/mmoJS3hx//XTluntMRnxee', 'Suresh Reddy', '9876543218', '1987-09-14', 'MALE', '123 Tech Park', 'Hyderabad', 'Telangana', '500001', '789012345678', 'VOT9900000009', '/api/user/profile/photo/9.jpg', TRUE, TRUE, '2024-01-11 10:30:00'),
('meena.iyer@email.com', '$2a$12$/phBjZ5kbVnIQXFcqAyBO.JIMbtiRcWrIlF.zZauK3g.CoXcNzx2.', 'Meena Iyer', '9876543219', '1994-06-08', 'FEMALE', '456 Garden View', 'Kochi', 'Kerala', '682001', '990000000010', 'VOT8901234567', '/api/user/profile/photo/10.jpg', TRUE, TRUE, '2024-01-11 11:00:00'),
('anil.gupta@email.com', '$2a$12$JoYqmT4zrOPbTB4I/6cOw.AsaMjYB7On3n69KZ3mXa0MB22yjidC2', 'Anil Gupta', '9876543220', '1986-02-28', 'MALE', '789 Civil Lines', 'Lucknow', 'Uttar Pradesh', '226001', '890123456789', 'VOT9900000011', '/api/user/profile/photo/11.jpg', TRUE, TRUE, '2024-01-11 11:30:00'),
('pooja.joshi@email.com', '$2a$12$OlnTvuBoPFJv1jqpVmYL3OrYcdcHETymJHm8oMW.XSOmy6XQcGvje', 'Pooja Joshi', '9876543221', '1996-10-12', 'FEMALE', '234 University Road', 'Indore', 'Madhya Pradesh', '452001', '990000000012', 'VOT9012345678', '/api/user/profile/photo/12.jpg', TRUE, TRUE, '2024-01-11 12:00:00'),
('deepak.saxena@email.com', '$2a$12$HxMpfjyUH33IjL58CcdVQupc8naVaz8I7egg6/i.oRFWuVQy.FglC', 'Deepak Saxena', '9876543222', '1990-08-19', 'MALE', '567 Market Square', 'Bhopal', 'Madhya Pradesh', '462001', '901234567890', 'VOT9900000013', '/api/user/profile/photo/13.jpg', TRUE, TRUE, '2024-01-12 09:00:00'),
('neha.kapoor@email.com', '$2a$12$9gfo7Nkm/VYPpFuMrBh8neEaLEwu6cSb04y8aAu8V2ug2xtXVNvZ.', 'Neha Kapoor', '9876543223', '1992-11-03', 'FEMALE', '890 Hill View', 'Shimla', 'Himachal Pradesh', '171001', '990000000014', 'VOT0123456789', '/api/user/profile/photo/14.jpg', TRUE, TRUE, '2024-01-12 09:30:00'),
('ravi.krishnan@email.com', '$2a$12$wDVZ6It2dq1JNKMFdi0YzuNHdgn.ZLWmO5e323XHDDyJyEW7Su6BG', 'Ravi Krishnan', '9876543224', '1988-03-17', 'MALE', '123 Temple Street', 'Madurai', 'Tamil Nadu', '625001', '012345678901', 'VOT9900000015', '/api/user/profile/photo/15.jpg', TRUE, TRUE, '2024-01-12 10:00:00'),
('shalini.das@email.com', '$2a$12$AnYu/JR0ZIJltc1XegjntOimv7vCbznypzEehe8JZcN32NovvGfOG', 'Shalini Das', '9876543225', '1995-05-29', 'FEMALE', '456 Fort Road', 'Guwahati', 'Assam', '781001', '990000000016', 'VOT1234567891', '/api/user/profile/photo/16.jpg', TRUE, TRUE, '2024-01-12 10:30:00'),
('manish.yadav@email.com', '$2a$12$cixu8lsqF57fOT9nhfvFNuqtcvslyP9GYDElxLiFfT5GTPSEUaSm.', 'Manish Yadav', '9876543226', '1991-07-21', 'MALE', '789 Railway Colony', 'Patna', 'Bihar', '800001', '123456789013', 'VOT9900000017', '/api/user/profile/photo/17.jpg', TRUE, TRUE, '2024-01-12 11:00:00'),
('divya.menon@email.com', '$2a$12$7.1FJPUPpYv1CruCSoKZOOSfcE2/zDhO/ukUf/5zpSBGzAKZBSy1i', 'Divya Menon', '9876543227', '1993-09-09', 'FEMALE', '234 Beach Front', 'Thiruvananthapuram', 'Kerala', '695001', '990000000018', 'VOT2345678902', '/api/user/profile/photo/18.jpg', TRUE, TRUE, '2024-01-12 11:30:00'),
('arjun.pandey@email.com', '$2a$12$L30Zr13diUPP9NvNqenasePzijLYWYXmVwES42gYmhX7WPcWbSK5q', 'Arjun Pandey', '9876543228', '1989-12-24', 'MALE', '567 Ring Road', 'Nagpur', 'Maharashtra', '440001', '234567890124', 'VOT9900000019', '/api/user/profile/photo/19.jpg', TRUE, TRUE, '2024-01-12 12:00:00'),
('ritika.singh@email.com', '$2a$12$CJwSJuyIUvMaT5ApArqoR.kESXc1oiwv.mzn8GlDlguHhX8SV/aeS', 'Ritika Singh', '9876543229', '1994-01-31', 'FEMALE', '890 Cantonment', 'Dehradun', 'Uttarakhand', '248001', '990000000020', 'VOT3456789013', '/api/user/profile/photo/20.jpg', TRUE, TRUE, '2024-01-12 12:30:00');

-- 2. INSERT 2 ADMINS (Passwords set to 'admin123', email updated to match login)
INSERT INTO admins (email, password_hash, full_name, phone_number) VALUES
('admin@voting.com', '$2a$12$8HNsrESl9ubVI9MRaCFWY.vZZ1i6OkpmzaTnz.5nsdTGdeWEzzhym', 'Sanjay Malhotra', '9999888877'),
('admin.secondary@voting.com', '$2a$12$8HNsrESl9ubVI9MRaCFWY.vZZ1i6OkpmzaTnz.5nsdTGdeWEzzhym', 'Priyanka Chopra', '9999888878');

-- 3. INSERT 2 ACTIVE ELECTIONS AND 2 PAST ELECTIONS
INSERT INTO elections (election_name, election_type, start_date, end_date, status, result_published, result_published_at, result_published_by, created_by) VALUES
-- Active Elections
('Maharashtra State Assembly Election 2025', 'STATE', '2025-11-20 08:00:00', '2025-11-25 18:00:00', 'ACTIVE', FALSE, NULL, NULL, 1),
('Mumbai Municipal Corporation Election 2025', 'LOCAL', '2025-11-21 08:00:00', '2025-11-24 18:00:00', 'ACTIVE', FALSE, NULL, NULL, 2),
-- Past Elections (Completed)
('Karnataka State Assembly Election 2024', 'STATE', '2024-05-10 08:00:00', '2024-05-15 18:00:00', 'COMPLETED', TRUE, '2024-05-16 10:00:00', 1, 1),
('Delhi Municipal Corporation Election 2024', 'LOCAL', '2024-03-01 08:00:00', '2024-03-05 18:00:00', 'COMPLETED', TRUE, '2024-03-06 10:00:00', 2, 2);

-- 4. INSERT 5 CANDIDATES FOR ELECTION 1 (Maharashtra State) AND 5 FOR ELECTION 2 (Mumbai Municipal)
-- Candidates for Election 1 (Maharashtra State Assembly Election 2025)
INSERT INTO candidates (user_id, election_id, party_name, party_symbol, manifesto) VALUES
(1, 1, 'Indian National Congress', 'Hand', 'Development for all sections of society, focus on education and healthcare reform'),
(3, 1, 'Bharatiya Janata Party', 'Lotus', 'Infrastructure development, digital transformation, and economic growth'),
(5, 1, 'Shiv Sena (UBT)', 'Flaming Torch', 'Protection of Marathi interests, industrial development, job creation'),
(7, 1, 'Nationalist Congress Party', 'Clock', 'Agricultural reforms, farmer welfare, rural development'),
(9, 1, 'Aam Aadmi Party', 'Broom', 'Anti-corruption measures, free utilities, quality education for all');

-- Candidates for Election 2 (Mumbai Municipal Corporation Election 2025)
INSERT INTO candidates (user_id, election_id, party_name, party_symbol, manifesto) VALUES
(2, 2, 'Indian National Congress', 'Hand', 'Better civic amenities, improved public transport, waste management'),
(4, 2, 'Bharatiya Janata Party', 'Lotus', 'Smart city initiatives, improved infrastructure, efficient administration'),
(6, 2, 'Shiv Sena (UBT)', 'Flaming Torch', 'Local employment priority, better housing, Mumbai for Mumbaikars'),
(8, 2, 'Nationalist Congress Party', 'Clock', 'Water supply improvement, road maintenance, green Mumbai initiative'),
(10, 2, 'Maharashtra Navnirman Sena', 'Railway Engine', 'Focus on middle-class welfare, affordable housing, traffic solutions');


-- 5. INSERT VOTES (17 users voted in Election 1, 18 users voted in Election 2)
-- Election 1 votes (Users 1-17 voted, Users 18-20 did NOT vote)
INSERT INTO votes (election_id, user_id, candidate_id, vote_hash, voted_at) VALUES
(1, 1, 1, CONCAT('hash_e1_u1_c1_', MD5(CONCAT('1', '1', '1', NOW()))), '2025-11-20 09:15:00'),
(1, 2, 2, CONCAT('hash_e1_u2_c2_', MD5(CONCAT('1', '2', '2', NOW()))), '2025-11-20 10:30:00'),
(1, 3, 3, CONCAT('hash_e1_u3_c3_', MD5(CONCAT('1', '3', '3', NOW()))), '2025-11-20 11:45:00'),
(1, 4, 1, CONCAT('hash_e1_u4_c1_', MD5(CONCAT('1', '4', '1', NOW()))), '2025-11-20 13:20:00'),
(1, 5, 2, CONCAT('hash_e1_u5_c2_', MD5(CONCAT('1', '5', '2', NOW()))), '2025-11-20 14:10:00'),
(1, 6, 4, CONCAT('hash_e1_u6_c4_', MD5(CONCAT('1', '6', '4', NOW()))), '2025-11-20 15:00:00'),
(1, 7, 5, CONCAT('hash_e1_u7_c5_', MD5(CONCAT('1', '7', '5', NOW()))), '2025-11-20 15:45:00'),
(1, 8, 1, CONCAT('hash_e1_u8_c1_', MD5(CONCAT('1', '8', '1', NOW()))), '2025-11-20 16:20:00'),
(1, 9, 2, CONCAT('hash_e1_u9_c2_', MD5(CONCAT('1', '9', '2', NOW()))), '2025-11-21 09:00:00'),
(1, 10, 3, CONCAT('hash_e1_u10_c3_', MD5(CONCAT('1', '10', '3', NOW()))), '2025-11-21 10:15:00'),
(1, 11, 4, CONCAT('hash_e1_u11_c4_', MD5(CONCAT('1', '11', '4', NOW()))), '2025-11-21 11:30:00'),
(1, 12, 1, CONCAT('hash_e1_u12_c1_', MD5(CONCAT('1', '12', '1', NOW()))), '2025-11-21 12:45:00'),
(1, 13, 2, CONCAT('hash_e1_u13_c2_', MD5(CONCAT('1', '13', '2', NOW()))), '2025-11-21 13:50:00'),
(1, 14, 5, CONCAT('hash_e1_u14_c5_', MD5(CONCAT('1', '14', '5', NOW()))), '2025-11-21 14:30:00'),
(1, 15, 3, CONCAT('hash_e1_u15_c3_', MD5(CONCAT('1', '15', '3', NOW()))), '2025-11-21 15:15:00'),
(1, 16, 1, CONCAT('hash_e1_u16_c1_', MD5(CONCAT('1', '16', '1', NOW()))), '2025-11-21 16:00:00'),
(1, 17, 2, CONCAT('hash_e1_u17_c2_', MD5(CONCAT('1', '17', '2', NOW()))), '2025-11-21 16:45:00');

-- Election 2 votes (Users 1-18 voted, Users 19-20 did NOT vote)
INSERT INTO votes (election_id, user_id, candidate_id, vote_hash, voted_at) VALUES
(2, 1, 6, CONCAT('hash_e2_u1_c6_', MD5(CONCAT('2', '1', '6', NOW()))), '2025-11-21 09:30:00'),
(2, 2, 7, CONCAT('hash_e2_u2_c7_', MD5(CONCAT('2', '2', '7', NOW()))), '2025-11-21 10:00:00'),
(2, 3, 8, CONCAT('hash_e2_u3_c8_', MD5(CONCAT('2', '3', '8', NOW()))), '2025-11-21 11:15:00'),
(2, 4, 6, CONCAT('hash_e2_u4_c6_', MD5(CONCAT('2', '4', '6', NOW()))), '2025-11-21 12:00:00'),
(2, 5, 7, CONCAT('hash_e2_u5_c7_', MD5(CONCAT('2', '5', '7', NOW()))), '2025-11-21 13:10:00'),
(2, 6, 9, CONCAT('hash_e2_u6_c9_', MD5(CONCAT('2', '6', '9', NOW()))), '2025-11-21 14:00:00'),
(2, 7, 10, CONCAT('hash_e2_u7_c10_', MD5(CONCAT('2', '7', '10', NOW()))), '2025-11-21 14:45:00'),
(2, 8, 6, CONCAT('hash_e2_u8_c6_', MD5(CONCAT('2', '8', '6', NOW()))), '2025-11-21 15:30:00'),
(2, 9, 7, CONCAT('hash_e2_u9_c7_', MD5(CONCAT('2', '9', '7', NOW()))), '2025-11-21 16:15:00'),
(2, 10, 8, CONCAT('hash_e2_u10_c8_', MD5(CONCAT('2', '10', '8', NOW()))), '2025-11-22 09:00:00'),
(2, 11, 9, CONCAT('hash_e2_u11_c9_', MD5(CONCAT('2', '11', '9', NOW()))), '2025-11-22 10:00:00'),
(2, 12, 6, CONCAT('hash_e2_u12_c6_', MD5(CONCAT('2', '12', '6', NOW()))), '2025-11-22 11:00:00'),
(2, 13, 7, CONCAT('hash_e2_u13_c7_', MD5(CONCAT('2', '13', '7', NOW()))), '2025-11-22 12:00:00'),
(2, 14, 10, CONCAT('hash_e2_u14_c10_', MD5(CONCAT('2', '14', '10', NOW()))), '2025-11-22 13:00:00'),
(2, 15, 8, CONCAT('hash_e2_u15_c8_', MD5(CONCAT('2', '15', '8', NOW()))), '2025-11-22 14:00:00'),
(2, 16, 6, CONCAT('hash_e2_u16_c6_', MD5(CONCAT('2', '16', '6', NOW()))), '2025-11-22 15:00:00'),
(2, 17, 7, CONCAT('hash_e2_u17_c7_', MD5(CONCAT('2', '17', '7', NOW()))), '2025-11-22 16:00:00'),
(2, 18, 8, CONCAT('hash_e2_u18_c8_', MD5(CONCAT('2', '18', '8', NOW()))), '2025-11-22 16:30:00');


-- UPDATE voter_election_status for all users in both active elections
-- Election 1: Users 1-17 voted, Users 18-20 did NOT vote
INSERT INTO voter_election_status (election_id, user_id, has_voted, voted_at) VALUES
(1, 1, TRUE, '2025-11-20 09:15:00'),
(1, 2, TRUE, '2025-11-20 10:30:00'),
(1, 3, TRUE, '2025-11-20 11:45:00'),
(1, 4, TRUE, '2025-11-20 13:20:00'),
(1, 5, TRUE, '2025-11-20 14:10:00'),
(1, 6, TRUE, '2025-11-20 15:00:00'),
(1, 7, TRUE, '2025-11-20 15:45:00'),
(1, 8, TRUE, '2025-11-20 16:20:00'),
(1, 9, TRUE, '2025-11-21 09:00:00'),
(1, 10, TRUE, '2025-11-21 10:15:00'),
(1, 11, TRUE, '2025-11-21 11:30:00'),
(1, 12, TRUE, '2025-11-21 12:45:00'),
(1, 13, TRUE, '2025-11-21 13:50:00'),
(1, 14, TRUE, '2025-11-21 14:30:00'),
(1, 15, TRUE, '2025-11-21 15:15:00'),
(1, 16, TRUE, '2025-11-21 16:00:00'),
(1, 17, TRUE, '2025-11-21 16:45:00'),
(1, 18, FALSE, NULL),
(1, 19, FALSE, NULL),
(1, 20, FALSE, NULL);

-- Election 2: Users 1-18 voted, Users 19-20 did NOT vote
INSERT INTO voter_election_status (election_id, user_id, has_voted, voted_at) VALUES
(2, 1, TRUE, '2025-11-21 09:30:00'),
(2, 2, TRUE, '2025-11-21 10:00:00'),
(2, 3, TRUE, '2025-11-21 11:15:00'),
(2, 4, TRUE, '2025-11-21 12:00:00'),
(2, 5, TRUE, '2025-11-21 13:10:00'),
(2, 6, TRUE, '2025-11-21 14:00:00'),
(2, 7, TRUE, '2025-11-21 14:45:00'),
(2, 8, TRUE, '2025-11-21 15:30:00'),
(2, 9, TRUE, '2025-11-21 16:15:00'),
(2, 10, TRUE, '2025-11-22 09:00:00'),
(2, 11, TRUE, '2025-11-22 10:00:00'),
(2, 12, TRUE, '2025-11-22 11:00:00'),
(2, 13, TRUE, '2025-11-22 12:00:00'),
(2, 14, TRUE, '2025-11-22 13:00:00'),
(2, 15, TRUE, '2025-11-22 14:00:00'),
(2, 16, TRUE, '2025-11-22 15:00:00'),
(2, 17, TRUE, '2025-11-22 16:00:00'),
(2, 18, TRUE, '2025-11-22 16:30:00'),
(2, 19, FALSE, NULL),
(2, 20, FALSE, NULL);

-- 6. UPDATE election_results table (for active elections - current vote counts)
-- Election 1 Results (Maharashtra State - 17 votes cast)
-- Candidate 1 (user_id 1): 5 votes
-- Candidate 2 (user_id 3): 6 votes
-- Candidate 3 (user_id 5): 3 votes
-- Candidate 4 (user_id 7): 2 votes
-- Candidate 5 (user_id 9): 1 vote
INSERT INTO election_results (election_id, candidate_id, vote_count, vote_percentage, rank_position) VALUES
(1, 1, 5, 29.41, 2),
(1, 2, 6, 35.29, 1),
(1, 3, 3, 17.65, 3),
(1, 4, 2, 11.76, 4),
(1, 5, 1, 5.88, 5);

-- Election 2 Results (Mumbai Municipal - 18 votes cast)
-- Candidate 6 (user_id 2): 6 votes
-- Candidate 7 (user_id 4): 6 votes
-- Candidate 8 (user_id 6): 4 votes
-- Candidate 9 (user_id 8): 1 vote
-- Candidate 10 (user_id 10): 1 vote
INSERT INTO election_results (election_id, candidate_id, vote_count, vote_percentage, rank_position) VALUES
(2, 6, 6, 33.33, 1),
(2, 7, 6, 33.33, 1),
(2, 8, 4, 22.22, 3),
(2, 9, 1, 5.56, 4),
(2, 10, 1, 5.56, 4);

-- UPDATE election_reports table
-- Report for Election 1 (Maharashtra State Assembly)
INSERT INTO election_reports (election_id, total_registered_voters, total_votes_cast, voter_turnout_percentage, total_candidates, winning_candidate_id, winning_margin, report_generated_by) VALUES
(1, 20, 17, 85.00, 5, 2, 1, 1);

-- Report for Election 2 (Mumbai Municipal Corporation)
INSERT INTO election_reports (election_id, total_registered_voters, total_votes_cast, voter_turnout_percentage, total_candidates, winning_candidate_id, winning_margin, report_generated_by) VALUES
(2, 20, 18, 90.00, 5, 6, 0, 2);


-- 7. NEW USERS AND LOCATION UPDATES (January 20, 2026)
-- Update Existing Elections with specific locations
UPDATE elections SET state = 'Maharashtra', election_type = 'STATE' WHERE election_name = 'Maharashtra State Assembly Election 2025';
UPDATE elections SET city = 'Mumbai', state = 'Maharashtra', election_type = 'LOCAL' WHERE election_name = 'Mumbai Municipal Corporation Election 2025';
UPDATE elections SET state = 'Karnataka', election_type = 'STATE' WHERE election_name = 'Karnataka State Assembly Election 2024';
UPDATE elections SET city = 'Delhi', state = 'Delhi', election_type = 'LOCAL' WHERE election_name = 'Delhi Municipal Corporation Election 2024';

-- Insert 15 New Users
INSERT INTO users (email, password_hash, full_name, phone_number, date_of_birth, gender, address, city, state, pincode, aadhar_number, voter_id_number, is_active, is_verified, approved_at) VALUES
('madhur.chaudhari@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Madhur Chaudhari', '9000000001', '2000-01-01', 'MALE', 'Jalgaon City', 'Jalgaon', 'Maharashtra', '425001', '100000000001', 'VOT1000000001', TRUE, TRUE, NOW()),
('anuj.tomar@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Anuj Tomar', '9000000002', '2000-01-01', 'MALE', 'Agra City', 'Agra', 'Uttar Pradesh', '282001', '100000000002', 'VOT1000000002', TRUE, TRUE, NOW()),
('satyam.patel@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Satyam Patel', '9000000003', '2000-01-01', 'MALE', 'Katni City', 'Katni', 'Madhya Pradesh', '483501', '100000000003', 'VOT1000000003', TRUE, TRUE, NOW()),
('soham.dey@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Soham Kumar Dey', '9000000004', '2000-01-01', 'MALE', 'Murshidabad City', 'Murshidabad', 'West Bengal', '742101', '100000000004', 'VOT1000000004', TRUE, TRUE, NOW()),
('utkarsh.phalphale@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Utkarsh Phalphale', '9000000005', '2000-01-01', 'MALE', 'Pune City', 'Pune', 'Maharashtra', '411001', '100000000005', 'VOT1000000005', TRUE, TRUE, NOW()),
('rajat.morya@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Rajat Morya', '9000000006', '2000-01-01', 'MALE', 'Bareilly City', 'Bareilly', 'Uttar Pradesh', '243001', '100000000006', 'VOT1000000006', TRUE, TRUE, NOW()),
('ayush.kush@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Ayush Kush', '9000000007', '2000-01-01', 'MALE', 'Lucknow City', 'Lucknow', 'Uttar Pradesh', '226001', '100000000007', 'VOT1000000007', TRUE, TRUE, NOW()),
('ninad.soman@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Ninad Soman', '9000000008', '2000-01-01', 'MALE', 'Pune City', 'Pune', 'Maharashtra', '411004', '100000000008', 'VOT1000000008', TRUE, TRUE, NOW()),
('vivek.yadav@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Vivek Yadav', '9000000009', '2000-01-01', 'MALE', 'Nalanda City', 'Nalanda', 'Bihar', '803111', '100000000009', 'VOT1000000009', TRUE, TRUE, NOW()),
('satyam.bavankar@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Satyam Bavankar', '9000000010', '2000-01-01', 'MALE', 'Seoni City', 'Seoni', 'Madhya Pradesh', '480661', '100000000010', 'VOT1000000010', TRUE, TRUE, NOW()),
('tanay.mapare@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Tanay Mapare', '9000000011', '2000-01-01', 'MALE', 'Washim City', 'Washim', 'Maharashtra', '444505', '100000000011', 'VOT1000000011', TRUE, TRUE, NOW()),
('ayush.shrivastava@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Ayush Shrivastava', '9000000012', '2000-01-01', 'MALE', 'Lucknow City', 'Lucknow', 'Uttar Pradesh', '226002', '100000000012', 'VOT1000000012', TRUE, TRUE, NOW()),
('ansh.mittal@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Ansh Mittal', '9000000013', '2000-01-01', 'MALE', 'Gwalior City', 'Gwalior', 'Madhya Pradesh', '474001', '100000000013', 'VOT1000000013', TRUE, TRUE, NOW()),
('rajdeep.kala@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Rajdeep Kala', '9000000014', '2000-01-01', 'MALE', 'Ujjain City', 'Ujjain', 'Madhya Pradesh', '456001', '100000000014', 'VOT1000000014', TRUE, TRUE, NOW()),
('satyendra.rathore@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Satyendra Rathore', '9000000015', '2000-01-01', 'MALE', 'Ujjain City', 'Ujjain', 'Madhya Pradesh', '456001', '100000000015', 'VOT1000000015', TRUE, TRUE, NOW());

-- Insert 15 Additional Users (Group 2)
INSERT INTO users (email, password_hash, full_name, phone_number, date_of_birth, gender, address, city, state, pincode, aadhar_number, voter_id_number, is_active, is_verified, approved_at) VALUES
('prabal.singh@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Prabal Singh', '9000000016', '2000-01-01', 'MALE', 'Aligarh City', 'Aligarh', 'Uttar Pradesh', '111111', '100000000016', 'VOT1000000016', TRUE, TRUE, NOW()),
('akash.dwivedi@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Akash Dwivedi', '9000000017', '2000-01-01', 'MALE', 'Sidhi City', 'Sidhi', 'Madhya Pradesh', '111111', '100000000017', 'VOT1000000017', TRUE, TRUE, NOW()),
('priyanshu.raj@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Priyanshu Raj', '9000000018', '2000-01-01', 'MALE', 'Bilaspur City', 'Bilaspur', 'Chhattisgarh', '111111', '100000000018', 'VOT1000000018', TRUE, TRUE, NOW()),
('atul.pawar@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Atul Pawar', '9000000019', '2000-01-01', 'MALE', 'Pune City', 'Pune', 'Maharashtra', '111111', '100000000019', 'VOT1000000019', TRUE, TRUE, NOW()),
('himanshu.muleva@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Himanshu Muleva', '9000000020', '2000-01-01', 'MALE', 'Indore City', 'Indore', 'Madhya Pradesh', '111111', '100000000020', 'VOT1000000020', TRUE, TRUE, NOW()),
('anuj.sharma@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Anuj Sharma', '9000000021', '2000-01-01', 'MALE', 'Agra City', 'Agra', 'Uttar Pradesh', '111111', '100000000021', 'VOT1000000021', TRUE, TRUE, NOW()),
('akash.rout@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Akash Rout', '9000000022', '2000-01-01', 'MALE', 'Belagavi City', 'Belagavi', 'Karnataka', '111111', '100000000022', 'VOT1000000022', TRUE, TRUE, NOW()),
('pratinav@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Pratinav', '9000000023', '2000-01-01', 'MALE', 'Varanasi City', 'Varanasi', 'Uttar Pradesh', '111111', '100000000023', 'VOT1000000023', TRUE, TRUE, NOW()),
('satyabrat.panigrahi@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Satyabrat Panigrahi', '9000000024', '2000-01-01', 'MALE', 'Bhadrak City', 'Bhadrak', 'Odisha', '111111', '100000000024', 'VOT1000000024', TRUE, TRUE, NOW()),
('rohan.sinha@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Rohan Sinha', '9000000025', '2000-01-01', 'MALE', 'Durg City', 'Durg', 'Chhattisgarh', '111111', '100000000025', 'VOT1000000025', TRUE, TRUE, NOW()),
('nishant.vij@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Nishant Vij', '9000000026', '2000-01-01', 'MALE', 'Sirsa City', 'Sirsa', 'Haryana', '111111', '100000000026', 'VOT1000000026', TRUE, TRUE, NOW()),
('pritish.bhatiya@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Pritish Bhatiya', '9000000027', '2000-01-01', 'MALE', 'Jabalpur City', 'Jabalpur', 'Madhya Pradesh', '111111', '100000000027', 'VOT1000000027', TRUE, TRUE, NOW()),
('apoorv.singh@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Apoorv Singh', '9000000028', '2000-01-01', 'MALE', 'Mathura City', 'Mathura', 'Uttar Pradesh', '111111', '100000000028', 'VOT1000000028', TRUE, TRUE, NOW()),
('pranav.tiwari@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Pranav Tiwari', '9000000029', '2000-01-01', 'MALE', 'Ghaziabad City', 'Ghaziabad', 'Uttar Pradesh', '111111', '100000000029', 'VOT1000000029', TRUE, TRUE, NOW()),
('abhijeet.singh@email.com', '$2a$12$vBI2Llf/b1f1z3xr3r2g5.NOnPl2oRNzBFY5E2HQg1MrH.hOv9v12', 'Abhijeet Singh', '9000000030', '2000-01-01', 'MALE', 'Indore City', 'Indore', 'Madhya Pradesh', '111111', '100000000030', 'VOT1000000030', TRUE, TRUE, NOW());


-- ============================================
-- MISSING DATA FOR KARNATAKA AND DELHI ELECTIONS
-- ============================================

-- 4. INSERT CANDIDATES FOR ELECTION 3 (Karnataka) AND ELECTION 4 (Delhi)
-- Candidates for Election 3 (Karnataka State Assembly Election 2024)
-- IDs will be 11, 12, 13, 14, 15
INSERT INTO candidates (user_id, election_id, party_name, party_symbol, manifesto) VALUES
(11, 3, 'Bharatiya Janata Party', 'Lotus', 'Focus on urban infrastructure and tech growth'),
(12, 3, 'Indian National Congress', 'Hand', 'Welfare schemes for women and youth'),
(13, 3, 'Janata Dal (Secular)', 'Woman carrying paddy sheaf', 'Farmer support and rural development'),
(14, 3, 'Aam Aadmi Party', 'Broom', 'Quality education and healthcare for all'),
(15, 3, 'Independent', 'Kite', 'Voice for the local community issues');

-- Candidates for Election 4 (Delhi Municipal Corporation Election 2024)
-- IDs will be 16, 17, 18, 19, 20
INSERT INTO candidates (user_id, election_id, party_name, party_symbol, manifesto) VALUES
(16, 4, 'Aam Aadmi Party', 'Broom', 'Clean Delhi, Green Delhi initiative'),
(17, 4, 'Bharatiya Janata Party', 'Lotus', 'Efficient waste management and civic amenities'),
(18, 4, 'Indian National Congress', 'Hand', 'Empowering local governance bodies'),
(19, 4, 'Independent', 'Bat', 'Traffic decongestion and road safety'),
(20, 4, 'Bahujan Samaj Party', 'Elephant', 'Social justice and equal rights');

-- 5. INSERT VOTES
-- Election 3 votes (Users 1-15 voted)
INSERT INTO votes (election_id, user_id, candidate_id, vote_hash, voted_at) VALUES
(3, 1, 11, CONCAT('hash_e3_u1_c11_', MD5(CONCAT('3', '1', '11', NOW()))), '2024-05-10 09:00:00'),
(3, 2, 12, CONCAT('hash_e3_u2_c12_', MD5(CONCAT('3', '2', '12', NOW()))), '2024-05-10 09:30:00'),
(3, 3, 11, CONCAT('hash_e3_u3_c11_', MD5(CONCAT('3', '3', '11', NOW()))), '2024-05-10 10:00:00'),
(3, 4, 13, CONCAT('hash_e3_u4_c13_', MD5(CONCAT('3', '4', '13', NOW()))), '2024-05-10 10:45:00'),
(3, 5, 11, CONCAT('hash_e3_u5_c11_', MD5(CONCAT('3', '5', '11', NOW()))), '2024-05-10 11:15:00'),
(3, 6, 12, CONCAT('hash_e3_u6_c12_', MD5(CONCAT('3', '6', '12', NOW()))), '2024-05-10 12:00:00'),
(3, 7, 14, CONCAT('hash_e3_u7_c14_', MD5(CONCAT('3', '7', '14', NOW()))), '2024-05-10 12:45:00'),
(3, 8, 11, CONCAT('hash_e3_u8_c11_', MD5(CONCAT('3', '8', '11', NOW()))), '2024-05-10 13:30:00'),
(3, 9, 15, CONCAT('hash_e3_u9_c15_', MD5(CONCAT('3', '9', '15', NOW()))), '2024-05-10 14:00:00'),
(3, 10, 11, CONCAT('hash_e3_u10_c11_', MD5(CONCAT('3', '10', '11', NOW()))), '2024-05-10 15:00:00'),
(3, 11, 12, CONCAT('hash_e3_u11_c12_', MD5(CONCAT('3', '11', '12', NOW()))), '2024-05-11 09:00:00'),
(3, 12, 11, CONCAT('hash_e3_u12_c11_', MD5(CONCAT('3', '12', '11', NOW()))), '2024-05-11 10:00:00'),
(3, 13, 13, CONCAT('hash_e3_u13_c13_', MD5(CONCAT('3', '13', '13', NOW()))), '2024-05-11 11:00:00'),
(3, 14, 11, CONCAT('hash_e3_u14_c11_', MD5(CONCAT('3', '14', '11', NOW()))), '2024-05-11 12:00:00'),
(3, 15, 12, CONCAT('hash_e3_u15_c12_', MD5(CONCAT('3', '15', '12', NOW()))), '2024-05-11 13:00:00');

-- Election 4 votes (Users 1-16 voted)
INSERT INTO votes (election_id, user_id, candidate_id, vote_hash, voted_at) VALUES
(4, 1, 16, CONCAT('hash_e4_u1_c16_', MD5(CONCAT('4', '1', '16', NOW()))), '2024-03-01 09:00:00'),
(4, 2, 17, CONCAT('hash_e4_u2_c17_', MD5(CONCAT('4', '2', '17', NOW()))), '2024-03-01 09:45:00'),
(4, 3, 16, CONCAT('hash_e4_u3_c16_', MD5(CONCAT('4', '3', '16', NOW()))), '2024-03-01 10:15:00'),
(4, 4, 18, CONCAT('hash_e4_u4_c18_', MD5(CONCAT('4', '4', '18', NOW()))), '2024-03-01 11:00:00'),
(4, 5, 16, CONCAT('hash_e4_u5_c16_', MD5(CONCAT('4', '5', '16', NOW()))), '2024-03-01 11:45:00'),
(4, 6, 19, CONCAT('hash_e4_u6_c19_', MD5(CONCAT('4', '6', '19', NOW()))), '2024-03-01 12:30:00'),
(4, 7, 16, CONCAT('hash_e4_u7_c16_', MD5(CONCAT('4', '7', '16', NOW()))), '2024-03-01 13:15:00'),
(4, 8, 17, CONCAT('hash_e4_u8_c17_', MD5(CONCAT('4', '8', '17', NOW()))), '2024-03-01 14:00:00'),
(4, 9, 16, CONCAT('hash_e4_u9_c16_', MD5(CONCAT('4', '9', '16', NOW()))), '2024-03-01 15:00:00'),
(4, 10, 20, CONCAT('hash_e4_u10_c20_', MD5(CONCAT('4', '10', '20', NOW()))), '2024-03-01 16:00:00'),
(4, 11, 16, CONCAT('hash_e4_u11_c16_', MD5(CONCAT('4', '11', '16', NOW()))), '2024-03-02 09:00:00'),
(4, 12, 17, CONCAT('hash_e4_u12_c17_', MD5(CONCAT('4', '12', '17', NOW()))), '2024-03-02 10:00:00'),
(4, 13, 16, CONCAT('hash_e4_u13_c16_', MD5(CONCAT('4', '13', '16', NOW()))), '2024-03-02 11:00:00'),
(4, 14, 18, CONCAT('hash_e4_u14_c18_', MD5(CONCAT('4', '14', '18', NOW()))), '2024-03-02 12:00:00'),
(4, 15, 16, CONCAT('hash_e4_u15_c16_', MD5(CONCAT('4', '15', '16', NOW()))), '2024-03-02 13:00:00'),
(4, 16, 17, CONCAT('hash_e4_u16_c17_', MD5(CONCAT('4', '16', '17', NOW()))), '2024-03-02 14:00:00');

-- 6. UPDATE voter_election_status
-- Election 3: Users 1-15 voted, 16-20 did not
INSERT INTO voter_election_status (election_id, user_id, has_voted, voted_at) VALUES
(3, 1, TRUE, '2024-05-10 09:00:00'),
(3, 2, TRUE, '2024-05-10 09:30:00'),
(3, 3, TRUE, '2024-05-10 10:00:00'),
(3, 4, TRUE, '2024-05-10 10:45:00'),
(3, 5, TRUE, '2024-05-10 11:15:00'),
(3, 6, TRUE, '2024-05-10 12:00:00'),
(3, 7, TRUE, '2024-05-10 12:45:00'),
(3, 8, TRUE, '2024-05-10 13:30:00'),
(3, 9, TRUE, '2024-05-10 14:00:00'),
(3, 10, TRUE, '2024-05-10 15:00:00'),
(3, 11, TRUE, '2024-05-11 09:00:00'),
(3, 12, TRUE, '2024-05-11 10:00:00'),
(3, 13, TRUE, '2024-05-11 11:00:00'),
(3, 14, TRUE, '2024-05-11 12:00:00'),
(3, 15, TRUE, '2024-05-11 13:00:00'),
(3, 16, FALSE, NULL),
(3, 17, FALSE, NULL),
(3, 18, FALSE, NULL),
(3, 19, FALSE, NULL),
(3, 20, FALSE, NULL);

-- Election 4: Users 1-16 voted, 17-20 did not
INSERT INTO voter_election_status (election_id, user_id, has_voted, voted_at) VALUES
(4, 1, TRUE, '2024-03-01 09:00:00'),
(4, 2, TRUE, '2024-03-01 09:45:00'),
(4, 3, TRUE, '2024-03-01 10:15:00'),
(4, 4, TRUE, '2024-03-01 11:00:00'),
(4, 5, TRUE, '2024-03-01 11:45:00'),
(4, 6, TRUE, '2024-03-01 12:30:00'),
(4, 7, TRUE, '2024-03-01 13:15:00'),
(4, 8, TRUE, '2024-03-01 14:00:00'),
(4, 9, TRUE, '2024-03-01 15:00:00'),
(4, 10, TRUE, '2024-03-01 16:00:00'),
(4, 11, TRUE, '2024-03-02 09:00:00'),
(4, 12, TRUE, '2024-03-02 10:00:00'),
(4, 13, TRUE, '2024-03-02 11:00:00'),
(4, 14, TRUE, '2024-03-02 12:00:00'),
(4, 15, TRUE, '2024-03-02 13:00:00'),
(4, 16, TRUE, '2024-03-02 14:00:00'),
(4, 17, FALSE, NULL),
(4, 18, FALSE, NULL),
(4, 19, FALSE, NULL),
(4, 20, FALSE, NULL);

-- 7. UPDATE election_results
-- Election 3 Results (Karnataka - 15 votes)
-- Candidate 11: 7 votes (Users 1,3,5,8,10,12,14)
-- Candidate 12: 4 votes (Users 2,6,11,15)
-- Candidate 13: 2 votes (Users 4,13)
-- Candidate 14: 1 vote (User 7)
-- Candidate 15: 1 vote (User 9)
INSERT INTO election_results (election_id, candidate_id, vote_count, vote_percentage, rank_position) VALUES
(3, 11, 7, 46.67, 1),
(3, 12, 4, 26.67, 2),
(3, 13, 2, 13.33, 3),
(3, 14, 1, 6.67, 4),
(3, 15, 1, 6.67, 4);

-- Election 4 Results (Delhi - 16 votes)
-- Candidate 16: 8 votes (Users 1,3,5,7,9,11,13,15)
-- Candidate 17: 4 votes (Users 2,8,12,16)
-- Candidate 18: 2 votes (Users 4,14)
-- Candidate 19: 1 vote (User 6)
-- Candidate 20: 1 vote (User 10)
INSERT INTO election_results (election_id, candidate_id, vote_count, vote_percentage, rank_position) VALUES
(4, 16, 8, 50.00, 1),
(4, 17, 4, 25.00, 2),
(4, 18, 2, 12.50, 3),
(4, 19, 1, 6.25, 4),
(4, 20, 1, 6.25, 4);

-- UPDATE election_reports
-- Report for Election 3 (Karnataka)
INSERT INTO election_reports (election_id, total_registered_voters, total_votes_cast, voter_turnout_percentage, total_candidates, winning_candidate_id, winning_margin, report_generated_by) VALUES
(3, 20, 15, 75.00, 5, 11, 3, 1);

-- Report for Election 4 (Delhi)
INSERT INTO election_reports (election_id, total_registered_voters, total_votes_cast, voter_turnout_percentage, total_candidates, winning_candidate_id, winning_margin, report_generated_by) VALUES
(4, 20, 16, 80.00, 5, 16, 4, 2);

-- 8. UPDATE PASSWORDS TO MATCH FIRSTNAME+LASTNAME (Concatenated)
-- Generated BCrypt hashes (cost 12)
UPDATE users SET password_hash = '$2b$12$LRKGisaaXknMnsDUShcO4ugcvMASq0V2eYOI2SeMFivIOAxQNZp86' WHERE full_name = 'Rajesh Kumar';
UPDATE users SET password_hash = '$2b$12$1LsyuVhJytA2cd/8yJFHN.5ZyNp.IXVRC/fFoTGbxBX.aYZlL55Ou' WHERE full_name = 'Priya Sharma';
UPDATE users SET password_hash = '$2b$12$9RWpzRPTPvWDkwidMUWzyO9BoK/9EkLWcaJ0k6I46dfrbmhXPDELK' WHERE full_name = 'Amit Patel';
UPDATE users SET password_hash = '$2b$12$btBbWEl.zXOUOH5LVzSHueSpKkDip4.LwX5PWWcnyZqY/6DedHXmC' WHERE full_name = 'Sneha Desai';
UPDATE users SET password_hash = '$2b$12$6mlvweTQouNs/fMv6lZ0s.n.NXxmaYL9KUWl2k29qyB4L/ECjFi4K' WHERE full_name = 'Vikram Singh';
UPDATE users SET password_hash = '$2b$12$qAlJfh2JmYiO2L0fJceDWeys.QAu8cbJd53aBqsOMBqwMcK5.2qeO' WHERE full_name = 'Anita Verma';
UPDATE users SET password_hash = '$2b$12$lHfk2Y1BxQCZAwJCOwEQquewsL3/HJ540cZa/FWUSXd6V2drJmIOm' WHERE full_name = 'Rahul Mehta';
UPDATE users SET password_hash = '$2b$12$AuovYys4/2yz1BKfb34fPOMHgh/rl1fEQEafh/Ho3SbyjjMyYjeBq' WHERE full_name = 'Kavita Nair';
UPDATE users SET password_hash = '$2b$12$iIU9L1MEnows/Q84DU0kBuMdqu11i9Pe2T18JtL6XE3eMv7IHEAwK' WHERE full_name = 'Suresh Reddy';
UPDATE users SET password_hash = '$2b$12$Dyk7vOoHPt9OTVttU1kAMuTn.jiPIE60VXSn2p/zfPSFRyMkEAnti' WHERE full_name = 'Meena Iyer';
UPDATE users SET password_hash = '$2b$12$ElN.gaBxJYee2tzHXuc8g.nl74oGKvgB.OHOSAevHk.h4Yy/tHjWW' WHERE full_name = 'Anil Gupta';
UPDATE users SET password_hash = '$2b$12$Xo1RkRceppO.JMK37PL8PeBruKuoIlIoUi6Qk3hOj4tpkwRhpzUsW' WHERE full_name = 'Pooja Joshi';
UPDATE users SET password_hash = '$2b$12$Al0A7W.G42Mm6/1/5l1WU.39L/crVht6a0Xc/wvthfgvO6za/w/ue' WHERE full_name = 'Deepak Saxena';
UPDATE users SET password_hash = '$2b$12$NxcjIrQ0Cls6nndMvBPhbuSfdn6DwFTbJzyTAGB2Uo/NlwD9nQ0Ke' WHERE full_name = 'Neha Kapoor';
UPDATE users SET password_hash = '$2b$12$50tua8x5T.kKuQ/yTnGImOE1K.KMBozj6wZHw9v8b5UPeHaD9bNTC' WHERE full_name = 'Ravi Krishnan';
UPDATE users SET password_hash = '$2b$12$LyYpetvoGqOkOUtnGxmwHOX1ImoQtcidaJd5haxgaymUsjUp1r4ju' WHERE full_name = 'Shalini Das';
UPDATE users SET password_hash = '$2b$12$4Sx2iUPutyVT7PWh/KhJXuLQyb5aQCAJabFOupmHkO.1yjUlp0swK' WHERE full_name = 'Manish Yadav';
UPDATE users SET password_hash = '$2b$12$ij1M3UsiI9Ifm3BuivSY6OS6beYnewXlKqdphJwi1SLWHUHzuHV6C' WHERE full_name = 'Divya Menon';
UPDATE users SET password_hash = '$2b$12$piBODqC8yPlKCVv9aFpFjunvSKUVc29fBUshfPgiBkpXA9nYX5ADO' WHERE full_name = 'Arjun Pandey';
UPDATE users SET password_hash = '$2b$12$/pSsDgV04YY1scj2Izz7ueyfItYodwDHZz1QvbA5FNqAXUOVOvcOC' WHERE full_name = 'Ritika Singh';
UPDATE users SET password_hash = '$2b$12$XV1zyIMfPfLQEQ6beTDdI.dFXz9ZtESBxQ0Hzw.Sw6zkMwYEBpKFm' WHERE full_name = 'Madhur Chaudhari';
UPDATE users SET password_hash = '$2b$12$HcobJJF2CnPEBQudKUYoF.oTIMm2GhlfOYmGjwB5JTgZm/2lW6wsa' WHERE full_name = 'Anuj Tomar';
UPDATE users SET password_hash = '$2b$12$Nu7k/OvJ375ge1q059vNMu5c6iCkCfYccpqwjhU8mPVMIPurJnRGm' WHERE full_name = 'Satyam Patel';
UPDATE users SET password_hash = '$2b$12$Q06ZkJmYlfr9tANm23xsQegxCI7gJ3hvqEYF402QV1/IbQPVRmF.q' WHERE full_name = 'Soham Kumar Dey';
UPDATE users SET password_hash = '$2b$12$NAoBaojpBHnDDoVsOU7WxOAg0.A19qLO.XonxvWWRl41o9mMKTiE.' WHERE full_name = 'Utkarsh Phalphale';
UPDATE users SET password_hash = '$2b$12$rYz63rTAbY9RaZtbMcDmBeh/MWPxntG6Pk7uPHYp3c5IK4mZ55cUe' WHERE full_name = 'Rajat Morya';
UPDATE users SET password_hash = '$2b$12$Fg2MWFBB3YtuL7q3P.LNpeN23MP1DdnYfeAVaKh4XUthNnYbcKsCO' WHERE full_name = 'Ayush Kush';
UPDATE users SET password_hash = '$2b$12$bvN6wY8qP35xOUjvY5r7eOyR/HvUHbqGZgavJMDLnPFQjtZRaZ6IK' WHERE full_name = 'Ninad Soman';
UPDATE users SET password_hash = '$2b$12$jT8TUkmjyk9AUVkl/JH3Z.gQ.zz4ARI61zafC0s7ss4oDoJB5gYvK' WHERE full_name = 'Vivek Yadav';
UPDATE users SET password_hash = '$2b$12$2SJOWPhT5/Vnb.bVri5zj.owJESODRm9pttqxsFD3s.b6JjgltGQK' WHERE full_name = 'Satyam Bavankar';
UPDATE users SET password_hash = '$2b$12$vE3slXnL2jK6Q1ksDTnMFOHR4L/DR6mlPGJdGpTM66mwKtP4nsH/K' WHERE full_name = 'Tanay Mapare';
UPDATE users SET password_hash = '$2b$12$3OFAOPmtDwC8lcabbE4Pl.r9U2UcmKhbHFc1UkC9H71sRZGVuDsdu' WHERE full_name = 'Ayush Shrivastava';
UPDATE users SET password_hash = '$2b$12$kk1jKbnmgypn9n9sqpGRA.0rLDAVNVIJdnft.27FDkdXO7LvCbVlK' WHERE full_name = 'Ansh Mittal';
UPDATE users SET password_hash = '$2b$12$0uRzjm9Dqs1lWxV6KADdY.BjXsOjmpozTWjknjuP11dG7QR7XKV4i' WHERE full_name = 'Rajdeep Kala';
UPDATE users SET password_hash = '$2b$12$9sfh5B9c955pP.mIF.I4rey3YS90BI9X4lJUft4gd2fo.W2GwGRT.' WHERE full_name = 'Satyendra Rathore';
UPDATE users SET password_hash = '$2b$12$.Zpu.jmTtftHujWUm3Uz8OahR.zcyAAkSx7ly9eX0Yg1andvcvuQO' WHERE full_name = 'Prabal Singh';
UPDATE users SET password_hash = '$2b$12$hs3jFd3N7kVpsbyEh1X4B.HZ6kn9igf1dhqoVkCGu2WBTbLPyStdu' WHERE full_name = 'Akash Dwivedi';
UPDATE users SET password_hash = '$2b$12$ynVShBrM.Q14m5rUxTUvZe4K.447LOtP/SsxPA/u4jgCB9dR9hPo2' WHERE full_name = 'Priyanshu Raj';
UPDATE users SET password_hash = '$2b$12$Pq2toaUdNkynpBZIbp2hHuouNjNnd4.CE.GyzjOxSw5GqpIPrTy6i' WHERE full_name = 'Atul Pawar';
UPDATE users SET password_hash = '$2b$12$6oFcaklOmSEA0nGBlmfVZ.gMDSR6BBG25ThidHRhmR4Fz6.DidcP2' WHERE full_name = 'Himanshu Muleva';
UPDATE users SET password_hash = '$2b$12$ejOMoTww67/e23fQSuykpuCsTSPv4SUSEJvseSVNZ/x88sZ/Mh/HG' WHERE full_name = 'Anuj Sharma';
UPDATE users SET password_hash = '$2b$12$HflPyYYZUJ4EdpAmkTpuMeo/ARYcm/Rz8X9gTUijSlllBFDReZFaS' WHERE full_name = 'Akash Rout';
UPDATE users SET password_hash = '$2b$12$MgVi3TCXSeJOz6boL36LZ.iGN46xc62TLbULROMPhtg6q9Om2ZW4W' WHERE full_name = 'Pratinav';
UPDATE users SET password_hash = '$2b$12$oo9d5yI/rPivkgxB8cbdZuhtbhWv8EiXeuvGr4lx0i9QZ1PJYuvXi' WHERE full_name = 'Satyabrat Panigrahi';
UPDATE users SET password_hash = '$2b$12$aH2tuukdyT095.ypQHQ./enzLDaAQk8.fFKLlPO8CRTzWW4OvFF0C' WHERE full_name = 'Rohan Sinha';
UPDATE users SET password_hash = '$2b$12$KSjdlb7eYpMaCccTKMAvAe5M.XOsBBDyIgkPkhAymLKCCnJrK3FHO' WHERE full_name = 'Nishant Vij';
UPDATE users SET password_hash = '$2b$12$DzKISrTEdow4H2E80zetduTf0/eNBrL0uWLhE21dzflRN32e1BJ0C' WHERE full_name = 'Pritish Bhatiya';
UPDATE users SET password_hash = '$2b$12$278wWG.vBPSJYV2XzkB/9uJesS0dQ49rPTyzDWW5DvYYvIklzwz5m' WHERE full_name = 'Apoorv Singh';
UPDATE users SET password_hash = '$2b$12$xut3Mwp7jUla9iEIoBPs3u/fGfVVZPPEZ.EYfgWhdaV84Mj1g1jsu' WHERE full_name = 'Pranav Tiwari';
UPDATE users SET password_hash = '$2b$12$paHEXIlzDff6HcrmUeyhCOEyvAAuBxy1wms4gfR.2MosjOSjp0tAO' WHERE full_name = 'Abhijeet Singh';

SET SQL_SAFE_UPDATES = 1;

