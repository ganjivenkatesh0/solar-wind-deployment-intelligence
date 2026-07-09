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

# Testing

The APIs can be tested using:

- Browser
- Swagger UI

Swagger URL

```
http://127.0.0.1:8000/docs
```

---

# Future APIs

The following APIs will be implemented in upcoming development phases.

- User Authentication
- User Registration
- Solar Prediction
- Wind Prediction
- Site Suitability Prediction
- Report Generation
- Dashboard APIs
