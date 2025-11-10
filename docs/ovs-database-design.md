# 🗳️ Database Schema: online-voting-system
This **document** outlines the database schema for this application.

## 📜 Table of Contents

* [admins](#table-1-admins)
* [candidates](#table-2-candidates)
* [election_reports](#table-3-election_reports)
* [election_results](#table-4-election_results)
* [elections](#table-5-elections)
* [users](#table-6-users)
* [voter_election_status](#table-7-voter_election_status)
* [votes](#table-8-votes)
* [Other Tables](#other-tables)

---

## TABLE 1: ADMINS

| FIELD ID | FIELD NAME | DATA TYPE | CONSTRAINTS |
| :--- | :--- | :--- | :--- |
| 1 | admin_id | bigint | PRIMARY KEY, AUTO_INCREMENT |
| 2 | user_id | bigint | FOREIGN KEY, UNIQUE |
| 3 | assigned_at | timestamp | NOT NULL |

---

## TABLE 2: CANDIDATES

| FIELD ID | FIELD NAME | DATA TYPE | CONSTRAINTS |
| :--- | :--- | :--- | :--- |
| 1 | candidate_id | bigint | PRIMARY KEY, AUTO_INCREMENT |
| 2 | user_id | bigint | FOREIGN KEY |
| 3 | election_id | bigint | FOREIGN KEY |
| 4 | candidate_name | varchar(255) | NOT NULL |
| 5 | party_name | varchar(255) | NOT NULL |
| 6 | candidate_symbol | varchar(255) | NOT NULL |
| 7 | candidate_photo_url | varchar(500) | NOT NULL |
| 8 | age | int | NOT NULL |
| 9 | qualification | varchar(255) | NOT NULL |
| 10 | manifesto | text | NOT NULL |
| 11 | registration_number | varchar(50) | UNIQUE |
| 12 | registration_status | enum(...) | NOT NULL |
| 13 | approved_at | timestamp | NOT NULL |
| 14 | registered_at | timestamp | NOT NULL |

---

## TABLE 3: ELECTION_REPORTS

| FIELD ID | FIELD NAME | DATA TYPE | CONSTRAINTS |
| :--- | :--- | :--- | :--- |
| 1 | report_id | bigint | PRIMARY KEY, AUTO_INCREMENT |
| 2 | election_id | bigint | FOREIGN KEY |
| 3 | total_registered_voters | bigint | NOT NULL |
| 4 | total_votes_cast | bigint | NOT NULL  |
| 5 | voter_turnout_percentage | decimal(5,2) | NOT NULL |
| 6 | total_candidates | int | NOT NULL |
| 7 | winning_candidate_id | bigint | FOREIGN KEY |
| 8 | winning_margin | bigint | NOT NULL |
| 9 | report_generated_by | bigint | FOREIGN KEY |
| 10 | report_generated_at | timestamp | NOT NULL |

---

## TABLE 4: ELECTION_RESULTS

| FIELD ID | FIELD NAME | DATA TYPE | CONSTRAINTS |
| :--- | :--- | :--- | :--- |
| 1 | result_id | bigint | PRIMARY KEY, AUTO_INCREMENT |
| 2 | election_id | bigint | FOREIGN KEY |
| 3 | candidate_id | bigint | FOREIGN KEY |
| 4 | vote_count | bigint | NOT NULL |
| 5 | vote_percentage | decimal(5,2) | NOT NULL |
| 6 | rank_position | int | NOT NULL |
| 7 | last_updated | timestamp | NOT NULL |

---

## TABLE 5: ELECTIONS

| FIELD ID | FIELD NAME | DATA TYPE | CONSTRAINTS |
| :--- | :--- | :--- | :--- |
| 1 | election_id | bigint | PRIMARY KEY, AUTO_INCREMENT |
| 2 | election_name | varchar(255) | NOT NULL |
| 3 | election_type | enum(...) | NOT NULL |
| 4 | start_date | datetime | NOT NULL |
| 5 | end_date | datetime | NOT NULL |
| 6 | status | enum(...) | NOT NULL |
| 7 | result_published | tinyint(1) | NOT NULL |
| 8 | result_published_at | timestamp | NOT NULL |
| 9 | result_published_by | bigint | FOREIGN KEY |
| 10 | created_by | bigint | FOREIGN KEY |
| 11 | created_at | timestamp | NOT NULL |

---

## TABLE 6: USERS

| FIELD ID | FIELD NAME | DATA TYPE | CONSTRAINTS |
| :--- | :--- | :--- | :--- |
| 1 | user_id | bigint | PRIMARY KEY, AUTO_INCREMENT |
| 2 | email | varchar(255) | UNIQUE |
| 3 | password_hash | varchar(255) | NOT NULL |
| 4 | full_name | varchar(255) | NOT NULL |
| 5 | phone_number | varchar(20) | NOT NULL |
| 6 | date_of_birth | date | NOT NULL |
| 7 | gender | enum(...) | NOT NULL |
| 8 | address | text | NOT NULL |
| 9 | city | varchar(100) | NOT NULL |
| 10 | state | varchar(100) | NOT NULL |
| 11 | pincode | varchar(10) | NOT NULL |
| 12 | id_proof_type | enum(...) | NOT NULL |
| 13 | profile_image_url | varchar(500) | NOT NULL |
| 14 | role | enum(...) | NOT NULL |
| 15 | is_active | tinyint(1) | NOT NULL |
| 16 | is_verified | tinyint(1) | NOT NULL |
| 17 | registration_status | enum(...) | NOT NULL |
| 18 | approved_at | timestamp | NOT NULL |
| 19 | created_at | timestamp | NOT NULL |
| 20 | updated_at | timestamp | NOT NULL |

---

## TABLE 7: VOTER_ELECTION_STATUS

| FIELD ID | FIELD NAME | DATA TYPE | CONSTRAINTS |
| :--- | :--- | :--- | :--- |
| 1 | status_id | bigint | PRIMARY KEY, AUTO_INCREMENT |
| 2 | election_id | bigint | FOREIGN KEY |
| 3 | user_id | bigint | FOREIGN KEY |
| 4 | has_voted | tinyint(1) | NOT NULL |
| 5 | voted_at | timestamp | NOT NULL |

---

## TABLE 8: VOTES

| FIELD ID | FIELD NAME | DATA TYPE | CONSTRAINTS |
| :--- | :--- | :--- | :--- |
| 1 | vote_id | bigint | PRIMARY KEY, AUTO_INCREMENT |
| 2 | election_id | bigint | FOREIGN KEY |
| 3 | user_id | bigint | FOREIGN KEY |
| 4 | candidate_id | bigint | FOREIGN KEY |
| 5 | vote_hash | varchar(255) | UNIQUE |
| 6 | voted_at | timestamp | NOT NULL |

---

## Other Tables

* `dummy_aadhar_records`
* `dummy_pan_records`
* `dummy_passport_records`
* `dummy_voter_id_records`
