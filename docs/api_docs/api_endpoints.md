# API Endpoints Documentation

## Project

Solar & Wind Deployment Intelligence Platform

---

# Base URL

```
http://127.0.0.1:8000
```

---

# Endpoint 1

## GET /

### Description

Returns the welcome message.

### Response

```json
{
    "message": "Welcome to the Solar & Wind Deployment Intelligence Platform"
}
```

---

# Endpoint 2

## GET /health

### Description

Checks whether the backend server is running.

### Response

```json
{
    "status": "Running"
}
```

---

# Endpoint 3

## GET /about

### Description

Returns project information.

### Response

```json
{
    "project": "Solar & Wind Deployment Intelligence Platform",
    "framework": "FastAPI",
    "version": "0.1.0"
}
```

---

# API Testing

The APIs were verified using:

- Browser
- Swagger UI

Swagger URL

```
http://127.0.0.1:8000/docs
```

---

# Additional API Endpoints (Day 8)

## GET /projects

### Description

Retrieves all stored projects from PostgreSQL.

### Response

```json
[
  {
    "id": 1,
    "project_name": "Odisha Solar Farm",
    "description": "Large scale solar energy generation project.",
    "state": "Odisha",
    "latitude": 20.2961,
    "longitude": 85.8245
  }
]
```

---

## POST /projects

### Description

Creates a new renewable energy project.

### Request

```json
{
  "project_name": "Odisha Solar Farm",
  "description": "Large scale solar energy generation project.",
  "state": "Odisha",
  "latitude": 20.2961,
  "longitude": 85.8245
}
```

### Response

```json
{
  "id": 1,
  "project_name": "Odisha Solar Farm",
  "description": "Large scale solar energy generation project.",
  "state": "Odisha",
  "latitude": 20.2961,
  "longitude": 85.8245
}
```

---

## Validation

The API validates:

- Project name must not be empty.
- Description must contain at least 5 characters.
- Latitude must be between -90 and 90.
- Longitude must be between -180 and 180.

Invalid requests return:

HTTP 422 Unprocessable Entity

---

# Future APIs

The following APIs will be implemented in future phases.

- User Authentication
- User Registration
- Solar Prediction
- Wind Prediction
- Site Suitability
- Report Generation
- Dashboard APIs
