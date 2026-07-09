# Infosys Virtual Internship – Day 6

**Date:** 07 July 2026

**Project:** Solar & Wind Deployment Intelligence Platform

**Session Topic:** FastAPI Routing & Backend Module Organization

---

# Learning Objectives

Today's session focused on organizing the FastAPI backend using modular routing.

The objectives were:

- Understand FastAPI routing.
- Organize backend modules.
- Register routers.
- Create REST APIs.
- Verify APIs using Swagger UI.

---

# Backend Refactoring

The root endpoint was moved from:

```
backend/app/main.py
```

to

```
backend/app/api/home.py
```

The application's functionality remained unchanged while improving code organization.

---

# Router Organization

Created the following router files.

```
backend/app/api/

home.py
projects.py
sites.py
predictions.py
```

Each router uses:

```python
from fastapi import APIRouter

router = APIRouter()
```

---

# Router Registration

All routers were registered in `main.py`.

```python
app.include_router(home_router)
app.include_router(projects_router)
app.include_router(sites_router)
app.include_router(predictions_router)
```

---

# REST APIs

## GET /

Returns the welcome message.

---

## GET /health

Returns the application status.

---

## GET /about

Returns project information.

---

## GET /projects

Returns demo project information.

```json
[
    {
        "id": 1,
        "project_name": "Demo Solar Project",
        "location": "Odisha"
    }
]
```

---

## GET /sites

Returns demo site information.

```json
[
    {
        "id": 1,
        "latitude": 19.8135,
        "longitude": 85.8312
    }
]
```

---

# Swagger Verification

Verified:

- GET /
- GET /health
- GET /about
- GET /projects
- GET /sites

All endpoints returned successful responses.

---

# Practical Work Completed

- Refactored backend.
- Created router modules.
- Registered routers.
- Implemented demo APIs.
- Verified Swagger UI.

---

# Challenges

No major issues occurred.

404 responses for invalid URLs (`/get` and `/GET`) were expected because these endpoints do not exist.

---

# Pending Tasks

- Authentication APIs
- PostgreSQL Integration
- SQLAlchemy Models
- Prediction APIs
- Machine Learning Integration

---

# Key Learnings

- Modular routing improves maintainability.
- APIRouter separates application features.
- Router registration connects modules to the application.
- Swagger automatically documents all registered APIs.

---

# Day 6 Summary

Today's session focused on restructuring the backend using FastAPI routers. The backend was divided into feature-specific modules, new REST APIs were created for projects and sites, and all endpoints were successfully tested using Swagger UI. The application is now organized in a scalable way for future backend development.
