---
layout: splash
title: "Online Voting System"
header:
  overlay_color: "#000"
  overlay_filter: "0.5"
  overlay_image: /assets/images/header.png
  actions:
    - label: "Get Started"
      url: "/docs/introduction/"
    - label: "View on GitHub"
      url: "https://github.com/yadnyeshkolte/online-voting-system"
excerpt: "A secure and reliable platform for conducting online elections"
intro:
  - excerpt: 'Complete documentation for the Online Voting System'
feature_row:
  - image_path: /assets/images/database-icon.png
    alt: "Database"
    title: "Database"
    excerpt: "Learn about the database structure, schemas, and ER diagrams"
    url: "/docs/database/ovs-database/"
    btn_label: "Read More"
    btn_class: "btn--primary"
  - image_path: /assets/images/backend-icon.png
    alt: "Backend"
    title: "Backend"
    excerpt: "Explore the Spring Boot backend architecture and APIs"
    url: "/docs/backend/springcontainer/"
    btn_label: "Read More"
    btn_class: "btn--primary"
  - image_path: /assets/images/frontend-icon.png
    alt: "Frontend"
    title: "Frontend"
    excerpt: "Discover the React frontend components and user experience"
    url: "/docs/frontend/usereffectvoting/"
    btn_label: "Read More"
    btn_class: "btn--primary"
  - image_path: /assets/images/devsec-icon.png
    alt: "DevSec"
    title: "DevSec"
    excerpt: "Developers Reference Section"
    url: "/docs/devsec/developersref/"
    btn_label: "Read More"
    btn_class: "btn--primary"
---

{% include feature_row id="intro" type="center" %}

{% include feature_row %}

## Quick Links

- [Installation Guide](/docs/installation/)
- [API Reference](/docs/backend/api-reference/)
- [Database Schema](/docs/database/databaseref/)

## Features

- **Secure Authentication**: JWT-based authentication system
- **Real-time Voting**: Live vote counting and results
- **Admin Dashboard**: Comprehensive election management
- **Responsive Design**: Works on all devices
- **Audit Trail**: Complete voting history and logs
