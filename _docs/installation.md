---
title: "Installation"
permalink: /docs/installation/
excerpt: "How to install Online Voting System"
last_modified_at: 2025-11-15
toc: true
---

# Installation Guide

## Prerequisites

- Java 11 or higher
- Node.js 14 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Backend Setup
```bash
# Clone the repository
git clone https://github.com/yadnyeshkolte/online-voting-system.git
cd online-voting-system/backend

# Install dependencies
mvn clean install

# Configure database
cp application.properties.example application.properties
# Edit application.properties with your database credentials

# Run the application
mvn spring-boot:run
```

## Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm start
```

## Database Setup
```sql
-- Create database
CREATE DATABASE ovs_db;

-- Run migrations
-- (Add your migration commands here)
```
