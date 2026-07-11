# Infosys Virtual Internship – Day 7

**Date:** 8 July 2026

## Session Topic

SQLAlchemy Integration & PostgreSQL Database Models

---

# Learning Objectives

- Configure SQLAlchemy.
- Connect FastAPI with PostgreSQL.
- Create database models.
- Automatically generate database tables.
- Understand ORM concepts.
- Compare API responses with database models.

---

# Task 1 – Configure SQLAlchemy

Installed the required packages:

- SQLAlchemy
- psycopg2-binary

Created:

backend/app/database/database.py

Configured:

- Database URL
- SQLAlchemy Engine
- SessionLocal
- Declarative Base

---

# Task 2 – Create Project Model

Created:

backend/app/models/project.py

Model Fields:

| Field | Type |
|--------|------|
| id | Integer (Primary Key) |
| project_name | String |
| location | String |

---

# Task 3 – Generate Database Table

Imported the Project model into the application.

Executed:

Base.metadata.create_all(bind=engine)

Verified the table inside PostgreSQL.

Table created:

projects

---

# Task 4 – Compare API & Model

Verified that:

GET /projects

returns:

- id
- project_name
- location

These fields match the Project database model.

The API currently returns hardcoded data.

Database integration will be implemented in future sessions.

---

# Files Created

backend/app/database/database.py

backend/app/models/project.py

---

# Files Updated

backend/app/main.py

backend/requirements.txt

---

# Technologies Used

- FastAPI
- PostgreSQL
- SQLAlchemy
- psycopg2-binary
- Uvicorn

---

# Verification

Successfully verified:

- PostgreSQL connection
- SQLAlchemy configuration
- Automatic table creation
- Projects table in pgAdmin
- API endpoints

---

# Key Takeaways

- SQLAlchemy maps Python classes to database tables.
- ORM eliminates the need to write manual CREATE TABLE statements.
- Base.metadata.create_all() automatically creates tables.
- FastAPI can now communicate with PostgreSQL.
- Database models will be used in future CRUD operations.

---

# Short Summary

Today's session focused on integrating SQLAlchemy with FastAPI and PostgreSQL. The database connection was configured successfully, the first Project model was created, and SQLAlchemy automatically generated the projects table inside PostgreSQL. The existing API endpoints continue to return hardcoded data while the persistence layer has been successfully established for future development.
