# Backend Routing Architecture

## Purpose

This document describes how the FastAPI backend is organized using modular routing.

---

# Directory Structure

```text
backend/
└── app/
    ├── api/
    │   ├── home.py
    │   ├── projects.py
    │   ├── sites.py
    │   └── predictions.py
    └── main.py
```

---

# Router Responsibilities

## home.py

- GET /
- GET /health
- GET /about

## projects.py

- GET /projects

## sites.py

- GET /sites

## predictions.py

Reserved for future prediction APIs.

---

# Router Registration

All routers are registered in `main.py` using:

```python
app.include_router(home_router)
app.include_router(projects_router)
app.include_router(sites_router)
app.include_router(predictions_router)
```

---

# Benefits

- Modular code organization.
- Easier maintenance.
- Better scalability.
- Clear separation of features.
- Simplified testing.

---

# Future Expansion

Additional routers will be created for:

- Authentication
- Database
- Reports
- Dashboard
- Machine Learning APIs
- User Management

This modular design supports future development while keeping the codebase clean and maintainable.
