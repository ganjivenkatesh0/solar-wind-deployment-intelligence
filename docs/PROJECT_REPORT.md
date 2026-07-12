# Solar & Wind Deployment Intelligence Platform

## Project Report (Day 1 – Day 8)

**Project Name:** Solar & Wind Deployment Intelligence Platform

**Internship:** Infosys Springboard Virtual Internship 2026

**Student:** Ganji Venkatesh

**Course:** B.Tech – Computer Science Engineering

**University:** The ICFAI University, Raipur

---

# 1. Project Overview

The Solar & Wind Deployment Intelligence Platform is a backend-based application designed to support renewable energy planning. The platform aims to analyze solar and wind resources using multiple datasets and provide suitable locations for renewable energy deployment.

The project is being developed using FastAPI, PostgreSQL, SQLAlchemy, and Pydantic while following a modular backend architecture.

---

# 2. Objectives

- Learn modern backend development using FastAPI.
- Build REST APIs.
- Connect FastAPI with PostgreSQL.
- Use SQLAlchemy ORM for database operations.
- Validate user input using Pydantic.
- Organize the project using professional folder structures.
- Maintain documentation and GitHub version control.

---

# 3. Technologies Used

## Programming Language

- Python 3.14

## Backend

- FastAPI
- Uvicorn

## Database

- PostgreSQL
- pgAdmin

## ORM

- SQLAlchemy

## Validation

- Pydantic

## Version Control

- Git
- GitHub

## Development Tools

- Visual Studio Code
- PowerShell

---

# 4. Project Structure

```
solar-wind-deployment-intelligence/

backend/
frontend/
datasets/
docs/
models/
notebooks/
reports/
docker/
README.md
CHANGELOG.md
```

---

# 5. Work Completed (Day 1 – Day 8)

## Day 1

- Initialized project.
- Configured Git and GitHub.
- Created backend structure.
- Installed FastAPI.
- Verified development environment.

---

## Day 2

- Organized project folder structure.
- Planned renewable energy datasets.
- Documented backend architecture.
- Created workflow documentation.

---

## Day 3

- Learned backend architecture.
- Studied REST APIs.
- Understood project modules.
- Learned SQL Primary and Foreign Keys.

---

## Day 4

- Verified development environment.
- Created workspace structure.
- Designed initial database schema.
- Documented module responsibilities.

---

## Day 5

- Installed FastAPI and Uvicorn.
- Created first REST APIs.
- Verified APIs using Swagger UI.

Implemented:

- GET /
- GET /health
- GET /about

---

## Day 6

- Refactored backend using routers.
- Created modular API structure.
- Implemented:

  - GET /projects
  - GET /sites

- Registered routers in main.py.

---

## Day 7

- Configured SQLAlchemy.
- Connected PostgreSQL.
- Created Project model.
- Generated database tables automatically.
- Verified project table using pgAdmin.

---

## Day 8

- Created Project Pydantic schemas.
- Implemented POST /projects.
- Connected GET /projects with PostgreSQL.
- Added request validation.
- Tested CRUD operations.
- Verified database persistence.
- Updated documentation.

---

# 6. Current APIs

| Method | Endpoint | Status |
|---------|----------|--------|
| GET | / | Working |
| GET | /health | Working |
| GET | /about | Working |
| GET | /projects | Working |
| POST | /projects | Working |
| GET | /sites | Working |

---

# 7. Database

Database: PostgreSQL

Current Table:

- projects

Columns:

- id
- project_name
- description
- state
- latitude
- longitude
- created_at

---

# 8. Validation

Implemented validation using Pydantic.

Validated fields include:

- Project Name
- Description
- Latitude
- Longitude

Invalid requests correctly return HTTP 422 responses.

---

# 9. Datasets

The following datasets have been downloaded and organized inside the project.

- NASA POWER
- Global Wind Atlas
- OpenStreetMap
- Sentinel-2
- SRTM

These datasets will be used in upcoming phases for preprocessing and machine learning.

---

# 10. Documentation

The project currently includes:

- README.md
- CHANGELOG.md
- Weekly Notes (Day 1 – Day 8)
- API Documentation
- Architecture Documents
- Database Design
- Module Mapping
- Dataset Summary

---

# 11. Current Status

Completed:

- Project setup
- Backend architecture
- FastAPI development
- REST APIs
- PostgreSQL integration
- SQLAlchemy ORM
- Pydantic validation
- Swagger testing
- GitHub version control
- Documentation

Internship Progress:

**Completed 8 out of 30 days**

---

# 12. Future Work

The next stages of the project include:

- Dataset preprocessing
- Machine learning model development
- Solar prediction
- Wind prediction
- Site suitability analysis
- Interactive dashboard
- Report generation
- Docker deployment

---

# 13. Conclusion

During the first eight days of the Infosys Springboard Virtual Internship, a solid backend foundation has been established for the Solar & Wind Deployment Intelligence Platform. The project now includes a modular FastAPI backend, PostgreSQL database integration, SQLAlchemy ORM, Pydantic validation, REST APIs, and structured documentation. This foundation is ready for the upcoming phases involving renewable energy datasets, machine learning, and dashboard development.