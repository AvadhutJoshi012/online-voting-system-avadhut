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

-- ============================================
-- USER CREDENTIALS REFERENCE
-- ============================================

| Voter ID      | Full Name           | Password           | District & State             |
|---------------|---------------------|--------------------|------------------------------|
| VOT9900000001 | Rajesh Kumar        | RajeshKumar        | Mumbai, Maharashtra          |
| VOT2345678901 | Priya Sharma        | PriyaSharma        | Delhi, Delhi                 |
| VOT9900000003 | Amit Patel          | AmitPatel          | Bangalore, Karnataka         |
| VOT4567890123 | Sneha Desai         | SnehaDesai         | Pune, Maharashtra            |
| VOT9900000005 | Vikram Singh        | VikramSingh        | Jaipur, Rajasthan            |
| VOT6789012345 | Anita Verma         | AnitaVerma         | Kolkata, West Bengal         |
| VOT9900000007 | Rahul Mehta         | RahulMehta         | Ahmedabad, Gujarat           |
| VOT7890123456 | Kavita Nair         | KavitaNair         | Chennai, Tamil Nadu          |
| VOT9900000009 | Suresh Reddy        | SureshReddy        | Hyderabad, Telangana         |
| VOT8901234567 | Meena Iyer          | MeenaIyer          | Kochi, Kerala                |
| VOT9900000011 | Anil Gupta          | AnilGupta          | Lucknow, Uttar Pradesh       |
| VOT9012345678 | Pooja Joshi         | PoojaJoshi         | Indore, Madhya Pradesh       |
| VOT9900000013 | Deepak Saxena       | DeepakSaxena       | Bhopal, Madhya Pradesh       |
| VOT0123456789 | Neha Kapoor         | NehaKapoor         | Shimla, Himachal Pradesh     |
| VOT9900000015 | Ravi Krishnan       | RaviKrishnan       | Madurai, Tamil Nadu          |
| VOT1234567891 | Shalini Das         | ShaliniDas         | Guwahati, Assam              |
| VOT9900000017 | Manish Yadav        | ManishYadav        | Patna, Bihar                 |
| VOT2345678902 | Divya Menon         | DivyaMenon         | Thiruvananthapuram, Kerala   |
| VOT9900000019 | Arjun Pandey        | ArjunPandey        | Nagpur, Maharashtra          |
| VOT3456789013 | Ritika Singh        | RitikaSingh        | Dehradun, Uttarakhand        |
| VOT1000000001 | Madhur Chaudhari    | MadhurChaudhari    | Jalgaon, Maharashtra         |
| VOT1000000002 | Anuj Tomar          | AnujTomar          | Agra, Uttar Pradesh          |
| VOT1000000003 | Satyam Patel        | SatyamPatel        | Katni, Madhya Pradesh        |
| VOT1000000004 | Soham Kumar Dey     | SohamKumarDey      | Murshidabad, West Bengal     |
| VOT1000000005 | Utkarsh Phalphale   | UtkarshPhalphale   | Pune, Maharashtra            |
| VOT1000000006 | Rajat Morya         | RajatMorya         | Bareilly, Uttar Pradesh      |
| VOT1000000007 | Ayush Kush          | AyushKush          | Lucknow, Uttar Pradesh       |
| VOT1000000008 | Ninad Soman         | NinadSoman         | Pune, Maharashtra            |
| VOT1000000009 | Vivek Yadav         | VivekYadav         | Nalanda, Bihar               |
| VOT1000000010 | Satyam Bavankar     | SatyamBavankar     | Seoni, Madhya Pradesh        |
| VOT1000000011 | Tanay Mapare        | TanayMapare        | Washim, Maharashtra          |
| VOT1000000012 | Ayush Shrivastava   | AyushShrivastava   | Lucknow, Uttar Pradesh       |
| VOT1000000013 | Ansh Mittal         | AnshMittal         | Gwalior, Madhya Pradesh      |
| VOT1000000014 | Rajdeep Kala        | RajdeepKala        | Ujjain, Madhya Pradesh       |
| VOT1000000015 | Satyendra Rathore   | SatyendraRathore   | Ujjain, Madhya Pradesh       |
| VOT1000000016 | Prabal Singh        | PrabalSingh        | Aligarh, Uttar Pradesh       |
| VOT1000000017 | Akash Dwivedi       | AkashDwivedi       | Sidhi, Madhya Pradesh        |
| VOT1000000018 | Priyanshu Raj       | PriyanshuRaj       | Bilaspur, Chhattisgarh       |
| VOT1000000019 | Atul Pawar          | AtulPawar          | Pune, Maharashtra            |
| VOT1000000020 | Himanshu Muleva     | HimanshuMuleva     | Indore, Madhya Pradesh       |
| VOT1000000021 | Anuj Sharma         | AnujSharma         | Agra, Uttar Pradesh          |
| VOT1000000022 | Akash Rout          | AkashRout          | Belagavi, Karnataka          |
| VOT1000000023 | Pratinav            | Pratinav           | Varanasi, Uttar Pradesh      |
| VOT1000000024 | Satyabrat Panigrahi | SatyabratPanigrahi | Bhadrak, Odisha              |
| VOT1000000025 | Rohan Sinha         | RohanSinha         | Durg, Chhattisgarh           |
| VOT1000000026 | Nishant Vij         | NishantVij         | Sirsa, Haryana               |
| VOT1000000027 | Pritish Bhatiya     | PritishBhatiya     | Jabalpur, Madhya Pradesh     |
| VOT1000000028 | Apoorv Singh        | ApoorvSingh        | Mathura, Uttar Pradesh       |
| VOT1000000029 | Pranav Tiwari       | PranavTiwari       | Ghaziabad, Uttar Pradesh     |
| VOT1000000030 | Abhijeet Singh      | AbhijeetSingh      | Indore, Madhya Pradesh       |