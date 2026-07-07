This document explains how the project is organized, why each folder exists, and how the architecture supports scalable development


# Project Setup Guide

## Solar & Wind Deployment Intelligence Platform

---

# Table of Contents

1. Introduction
2. Project Overview
3. Project Objectives
4. Project Architecture
5. Root Directory Structure
6. Backend Structure
7. Frontend Structure
8. Dataset Structure
9. Documentation Structure
10. Other Project Directories
11. Important Files
12. Development Workflow
13. Best Practices
14. Future Enhancements
15. Summary

---

# Introduction

The **Solar & Wind Deployment Intelligence Platform** is an AI-powered web application developed during the Infosys Springboard Virtual Internship.

The objective of this project is to build an intelligent platform capable of analyzing renewable energy datasets and recommending the best locations for solar and wind energy deployment using Artificial Intelligence, Machine Learning, GIS, and FastAPI.

---

# Project Overview

The project follows a modular architecture.

Instead of placing all code in a single folder, responsibilities are divided into multiple modules.

Benefits include:

- Easy maintenance
- Better scalability
- Cleaner code organization
- Faster development
- Easier collaboration
- Better debugging

---

# Project Objectives

The project aims to:

- Analyze renewable energy datasets.
- Predict solar energy generation.
- Predict wind energy generation.
- Evaluate site suitability.
- Develop REST APIs using FastAPI.
- Build an interactive dashboard.
- Learn industry-standard software engineering practices.

---

# Project Architecture

```
User
   │
   ▼
Frontend
   │
   ▼
FastAPI Backend
   │
   ├──────────────┐
   ▼              ▼
Database      AI Models
   │              │
   └──────┬───────┘
          ▼
Prediction Results
          │
          ▼
Dashboard
```

---

# Root Directory Structure

```
solar-wind-deployment-intelligence/
│
├── assets/
├── backend/
├── frontend/
├── datasets/
├── docs/
├── docker/
├── models/
├── notebooks/
├── reports/
│
├── CHANGELOG.md
├── LICENSE
├── README.md
├── requirements.txt
├── docker-compose.yml
└── .gitignore
```

---

# Backend Structure

```
backend/
│
└── app/
    │
    ├── api/
    ├── auth/
    ├── database/
    ├── models/
    ├── schemas/
    ├── services/
    ├── utils/
    └── main.py
```

## backend/

Contains all server-side application code.

---

## api/

Purpose

- REST API endpoints
- Route definitions
- HTTP request handling

Example

```
GET /solar

GET /wind

POST /predict
```

---

## auth/

Purpose

- Login
- Authentication
- Authorization
- User Security

---

## database/

Purpose

- Database connection
- Session management
- Database configuration

Future Database

- PostgreSQL
- PostGIS

---

## models/

Purpose

Stores database models.

Example

- User
- Project
- Prediction

---

## schemas/

Purpose

Stores request and response validation models using Pydantic.

Benefits

- Input validation
- Error handling
- Data serialization

---

## services/

Purpose

Contains business logic.

Examples

- Solar Prediction
- Wind Prediction
- Site Analysis

---

## utils/

Purpose

Reusable helper functions.

Examples

- Date conversion
- Unit conversion
- Validation helpers

---

## main.py

Purpose

Application entry point.

The FastAPI application starts from this file.

Example

```
uvicorn app.main:app --reload
```

---

# Frontend Structure

```
frontend/
│
├── public/
│
└── src/
    │
    ├── assets/
    ├── components/
    ├── pages/
    └── services/
```

---

## public/

Stores static files.

Examples

- favicon
- logos
- images

---

## assets/

Contains project assets.

Examples

- icons
- images
- fonts

---

## components/

Reusable UI components.

Examples

- Navbar
- Sidebar
- Cards
- Buttons

---

## pages/

Application pages.

Examples

- Dashboard
- Login
- Prediction
- Reports

---

## services/

Handles communication with backend APIs.

Example

```
GET /predict
```

---

# Dataset Structure

```
datasets/

├── nasa_power/
├── global_wind_atlas/
├── openstreetmap/
├── sentinel/
└── srtm/
```

Purpose of each dataset

### NASA POWER

Solar irradiance

Weather

Temperature

Humidity

---

### Global Wind Atlas

Wind Speed

Wind Direction

Wind Density

---

### Sentinel

Satellite imagery

Land cover

Vegetation

---

### OpenStreetMap

Roads

Buildings

Substations

Infrastructure

---

### SRTM

Elevation

Terrain

Slope

---

# Documentation Structure

```
docs/

├── api_docs/
├── architecture/
├── database_design/
├── setup/
└── weekly_notes/
```

Purpose

Maintain professional project documentation.

---

# Other Project Directories

## docker/

Docker configuration files.

---

## notebooks/

Jupyter notebooks for data analysis.

---

## models/

Stores trained AI models.

---

## reports/

Generated reports.

---

## assets/

Architecture diagrams

Images

Screenshots

README resources

---

# Important Files

## README.md

Project homepage.

---

## CHANGELOG.md

Project history.

---

## requirements.txt

Python dependencies.

---

## docker-compose.yml

Docker configuration.

---

## LICENSE

Project license.

---

## .gitignore

Files ignored by Git.

---

# Development Workflow

```
Learn

↓

Implement

↓

Test

↓

Document

↓

Commit

↓

Push

↓

Repeat
```

---

# Best Practices

Always

- Use virtual environments.
- Write meaningful commit messages.
- Keep documentation updated.
- Push code regularly.
- Maintain project structure.
- Avoid committing unnecessary files.
- Keep dependencies inside requirements.txt.

---

# Future Enhancements

Upcoming work includes:

- PostgreSQL Integration
- Machine Learning Models
- GIS Analysis
- React Dashboard
- Authentication
- Docker Deployment
- Cloud Deployment
- CI/CD Pipeline

---

# Summary

The project follows a modular architecture that separates backend, frontend, datasets, documentation, reports, and machine learning models into dedicated directories.

This organization improves readability, scalability, maintainability, and collaboration while following modern software engineering practices.

---

**Document Version:** v1.0

**Project:** Solar & Wind Deployment Intelligence Platform

**Internship:** Infosys Springboard Virtual Internship

**Last Updated:** Day 1