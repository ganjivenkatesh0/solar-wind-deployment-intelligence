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

## Projects Table

| Column | Data Type | Description |
|----------|-----------|-------------|
| id | Integer | Primary Key |
| project_name | String | Name of the renewable energy project |
| description | String | Project description |
| state | String | State where the project is located |
| latitude | Float | Latitude of the project site |
| longitude | Float | Longitude of the project site |
| created_at | DateTime | Record creation timestamp |

### Primary Key

- id

### ORM

Implemented using SQLAlchemy ORM.

### Validation

Implemented using Pydantic request schemas.

### Current Status

- Table creation verified.
- Data insertion verified.
- Data retrieval verified.
- PostgreSQL integration completed.
