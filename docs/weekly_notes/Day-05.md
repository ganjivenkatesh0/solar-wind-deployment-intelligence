# Infosys Virtual Internship – Day 5

**Date:** 06 July 2026

**Project:** Solar & Wind Deployment Intelligence Platform

**Session Topic:** Introduction to FastAPI & Backend API Development

---

# Learning Objectives

Today's session introduced FastAPI and backend API development.

The objectives were:

- Understand FastAPI.
- Learn about the ASGI Server (Uvicorn).
- Set up the backend environment.
- Create REST API endpoints.
- Test APIs locally.
- Explore Swagger API documentation.

---

# FastAPI

FastAPI is a modern Python web framework used to build fast, secure, and high-performance REST APIs.

### Advantages

- High Performance
- Automatic API Documentation
- Easy Development
- Data Validation
- Modern Python Support

---

# Uvicorn (ASGI Server)

Uvicorn is an ASGI (Asynchronous Server Gateway Interface) server used to run FastAPI applications.

Responsibilities:

- Runs the FastAPI application.
- Handles client requests.
- Supports asynchronous processing.
- Automatically reloads the server during development.

---

# Backend Environment

Verified:

- Python Virtual Environment
- FastAPI
- Uvicorn
- Backend Project Structure

---

# Backend Setup

Verified the backend project structure.

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

# REST API Endpoints

The following endpoints were implemented.

## GET /

Purpose:

Returns the welcome message.

Expected Response

```json
{
    "message": "Welcome to the Solar & Wind Deployment Intelligence Platform"
}
```

---

## GET /health

Purpose:

Checks whether the backend application is running.

Expected Response

```json
{
    "status": "Running"
}
```
```

---

## GET /about

Purpose:

Returns project information.

Expected Response

```json
{
    "project": "Solar & Wind Deployment Intelligence Platform",
    "framework": "FastAPI",
    "version": "0.1.0"
}
```

---

# Running the Application

The FastAPI application was started using:

```bash
uvicorn backend.app.main:app --reload
```

Server Address:

```
http://127.0.0.1:8000
```

Swagger Documentation:

```
http://127.0.0.1:8000/docs
```

---

# API Testing

The APIs were successfully tested using:

- Browser
- Swagger UI

Verified Endpoints:

- GET /
- GET /health
- GET /about

---

# Practical Work Completed

Completed the following tasks.

- Verified FastAPI installation.
- Verified Uvicorn installation.
- Started the backend server.
- Created REST APIs.
- Tested APIs locally.
- Verified Swagger UI documentation.

---

# Challenges

No major issues were encountered.

The FastAPI application executed successfully, and all API endpoints responded correctly.

---

# Pending Tasks

- Authentication APIs
- PostgreSQL Integration
- Database Models
- Prediction APIs
- AI Model Integration
- Dashboard APIs

---

# Key Learnings

- FastAPI enables rapid backend API development.
- Uvicorn is required to run FastAPI applications.
- Swagger UI automatically documents APIs.
- REST APIs allow communication between the frontend and backend.
- Proper backend structure simplifies future development.

---

# Day 5 Summary

Today's session focused on learning FastAPI and backend API development. The backend environment was verified, the FastAPI application was executed successfully using Uvicorn, and three REST API endpoints were created and tested. Swagger UI was used to verify API functionality, providing a strong foundation for implementing authentication, database integration, and prediction APIs in future sessions.
