# Infosys Virtual Internship – Day 8

**Date:** 9 July 2026

## Session Topic

PostgreSQL Integration, SQLAlchemy ORM & CRUD APIs

---

## Objectives

- Configure SQLAlchemy.
- Connect FastAPI with PostgreSQL.
- Create Project ORM Model.
- Generate database tables automatically.
- Create Project Pydantic Schemas.
- Implement Project Creation API.
- Connect APIs to PostgreSQL.
- Validate user input.
- Verify data persistence.

---

## Tasks Completed

### Task 1 – SQLAlchemy Configuration

Created:

backend/app/database/database.py

Configured:

- SQLAlchemy Engine
- SessionLocal
- Base

Connected PostgreSQL database successfully.

---

### Task 2 – Project ORM Model

Created:

backend/app/models/project.py

Fields:

- id
- project_name
- description
- state
- latitude
- longitude
- created_at

---

### Task 3 – Automatic Table Creation

Imported the Project model into the application.

Executed:

Base.metadata.create_all(bind=engine)

Verified that the projects table was created automatically in PostgreSQL.

---

### Task 4 – Pydantic Schemas

Created request and response schemas.

Added validation for:

- Project Name
- Description
- State
- Latitude
- Longitude

---

### Task 5 – Project Creation API

Implemented:

POST /projects

Stores project information into PostgreSQL.

Verified successful insertion using Swagger UI.

---

### Task 6 – Retrieve Projects API

Updated:

GET /projects

Now retrieves data directly from PostgreSQL instead of returning hardcoded values.

---

### Task 7 – Validation Testing

Verified validation for:

- Empty project name
- Short description
- Invalid latitude
- Invalid longitude

Observed correct HTTP 422 validation responses.

---

### Task 8 – Database Verification

Verified data using:

pgAdmin

Confirmed:

- Table creation
- Data insertion
- Stored records

---

## Technologies Used

- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Swagger UI
- Uvicorn

---

## Outcome

Successfully connected FastAPI with PostgreSQL using SQLAlchemy ORM.

Implemented database-backed REST APIs with request validation and verified complete CRUD workflow.

---

## Status

Day 8 Completed Successfully.
