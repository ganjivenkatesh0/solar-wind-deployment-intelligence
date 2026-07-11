# Database Design

This document describes the PostgreSQL database design for the Solar & Wind Deployment Intelligence Platform.

## Objectives

- Define core data entities and relationships.
- Outline table structure for users, predictions, and site suitability.
- Capture database design decisions for future implementation.

## Design Considerations

- Use PostgreSQL for structured data storage.
- Support relational integrity with Primary Keys and Foreign Keys.
- Keep the design modular for future dataset integration.
- Separate user, prediction, and reporting data.

## Core Entities

- Users
- Predictions
- Site Suitability Scores
- Dataset Metadata
- Reports

## Notes

The full implementation will be added once dataset structure and API requirements are finalized.

# SQLAlchemy Model Implementation

## Project Table

Table Name:

projects

| Column | Data Type | Description |
|---------|-----------|-------------|
| id | Integer | Primary Key |
| project_name | String | Project Name |
| location | String | Project Location |

---

## ORM Mapping

Python Class:

Project

Database Table:

projects

SQLAlchemy automatically maps the Project class to the projects table.

---

## Current Status

- Database connection configured.
- SQLAlchemy integrated.
- Projects table generated successfully.
- CRUD operations will be implemented in future sessions.
