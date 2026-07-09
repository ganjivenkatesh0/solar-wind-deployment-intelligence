# Infosys Virtual Internship – Day 3

**Date:** 02 July 2026

**Project:** Solar & Wind Deployment Intelligence Platform

**Session Topic:** Project APIs, Backend & Project Modules

---

# Learning Objectives

Today's session focused on understanding the architecture and core components of the Solar & Wind Deployment Intelligence Platform.

The main learning objectives were:

- Understand the role of the Backend.
- Learn how APIs connect the Frontend and Backend.
- Understand the major project modules.
- Learn the basics of Authentication.
- Understand SQL Primary Key (PK) and Foreign Key (FK).
- Study the overall project architecture.

---

# Backend

The Backend is the core processing layer of the application. It receives requests from users, processes business logic, communicates with the database, executes prediction models, and sends responses back to the frontend through APIs.

## Responsibilities of the Backend

- Process user requests.
- Execute business logic.
- Connect with the database.
- Handle Authentication.
- Run prediction models.
- Generate reports.
- Send responses to the frontend.

---

# API (Application Programming Interface)

An API enables communication between the Frontend and Backend.

The Frontend sends requests to the Backend using APIs, and the Backend processes those requests before returning the required response.

## API Workflow

```text
Frontend
      │
      ▼
API Request
      │
      ▼
FastAPI Backend
      │
      ▼
Business Logic
      │
      ▼
Database / Prediction Models
      │
      ▼
JSON Response
      │
      ▼
Frontend
```

---

# Project Modules

The Solar & Wind Deployment Intelligence Platform consists of multiple modules.

## 1. Authentication Module

### Input

- Username
- Password

### Output

- Secure User Login

Purpose:

Provides secure access to authorized users.

---

## 2. Solar Prediction Module

### Input

NASA POWER Dataset

### Output

Solar Energy Prediction

Purpose:

Predicts solar energy generation using weather and solar irradiance data.

---

## 3. Wind Prediction Module

### Input

Global Wind Atlas Dataset

### Output

Wind Energy Prediction

Purpose:

Predicts wind energy generation using wind resource data.

---

## 4. Site Suitability Module

### Input

- NASA POWER
- Global Wind Atlas
- SRTM
- OpenStreetMap

### Output

Site Suitability Score

Purpose:

Identifies the best locations for renewable energy deployment.

---

## 5. Reports Module

### Input

Prediction Results

### Output

- PDF Report
- Excel Report

Purpose:

Generates downloadable reports for users.

---

## 6. Dashboard Module

### Input

Prediction Results

### Output

- Interactive Maps
- Graphs
- Charts
- Prediction Summary

Purpose:

Displays prediction results visually.

---

# SQL Keys

## Primary Key (PK)

A Primary Key uniquely identifies each record in a database table.

### Example

| User ID | Name |
|---------|------|
| 1 | Ganji |
| 2 | Rahul |

Here, **User ID** is the Primary Key.

---

## Foreign Key (FK)

A Foreign Key creates a relationship between two database tables.

### Example

### Users Table

| User ID | Name |
|---------|------|
| 1 | Ganji |

### Predictions Table

| Prediction ID | User ID | Result |
|--------------|---------|--------|
| 101 | 1 | Solar Prediction |

Here, **User ID** in the Predictions table references the **User ID** in the Users table.

---

# Overall Project Architecture

```text
                    User
                      │
                      ▼
            Frontend (React)
                      │
                      ▼
              FastAPI REST APIs
                      │
                      ▼
                 Backend Logic
                      │
      ┌───────────────┼───────────────┐
      │               │               │
      ▼               ▼               ▼
Authentication  Prediction Engine  Report Service
                      │
                      ▼
         Renewable Energy Datasets
      ┌─────────┬─────────┬──────────┬──────────┐
      │         │         │          │          │
 NASA POWER  Wind Atlas  Sentinel   OSM      SRTM
      │         │         │          │
      └─────────┴─────────┴──────────┴──────────┘
                      │
                      ▼
              PostgreSQL Database
                      │
                      ▼
          Dashboard & Reports
                      │
                      ▼
                    User
```

---

# Backend Folder Structure

```text
backend/
│
├── app/
│   ├── api/
│   ├── auth/
│   ├── database/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   └── main.py
│
├── tests/
├── requirements.txt
└── .env
```

---

# Practical Work Completed

The following tasks were completed during Day 3:

- Studied the backend architecture.
- Understood the purpose of REST APIs.
- Learned how the frontend communicates with the backend.
- Studied the project modules.
- Learned Authentication concepts.
- Understood SQL Primary Key and Foreign Key.
- Created the project architecture documentation.
- Studied the complete request-response workflow.

---

# Task Assigned

The task assigned during today's session was:

- Draw the complete Project Architecture Diagram.

The architecture diagram has been documented in:

```
docs/architecture/project_architecture.md
```

---

# Challenges

- Dataset download is still pending due to limited internet availability.
- Backend implementation will begin after datasets are available.

---

# Pending Tasks

- Download renewable energy datasets.
- Implement Authentication APIs.
- Create REST APIs.
- Design PostgreSQL database.
- Build Prediction APIs.
- Implement Dashboard APIs.
- Generate Reports.

---

# Key Learnings

- Backend is responsible for executing all business logic.
- APIs enable communication between the frontend and backend.
- Authentication protects application resources.
- Primary Keys uniquely identify records.
- Foreign Keys create relationships between database tables.
- A modular architecture improves scalability, maintainability, and future development.

---

# Day 3 Summary

Today's session focused on understanding the backend architecture, APIs, project modules, authentication, SQL database relationships, and the overall workflow of the Solar & Wind Deployment Intelligence Platform. The complete architecture flow from the user request to the prediction models, database, and dashboard was studied. The project architecture was documented, providing a strong foundation for implementing APIs, authentication, database design, and AI prediction modules in the upcoming internship sessions.
