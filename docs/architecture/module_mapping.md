# Module Mapping

This document captures the main modules of the Solar & Wind Deployment Intelligence Platform and the data flows between them.

## Modules

### Authentication Module
- Handles user signup, login, and access control.
- Ensures secure API access.

### Solar Prediction Module
- Uses NASA POWER data to predict solar energy generation.
- Provides solar prediction results to the dashboard and reports.

### Wind Prediction Module
- Uses Global Wind Atlas data to predict wind energy generation.
- Provides wind prediction results to the dashboard and reports.

### Site Suitability Module
- Combines multiple datasets to compute site suitability score.
- Uses NASA POWER, Global Wind Atlas, SRTM, and OSM.

### Reports Module
- Converts prediction results into PDF and Excel reports.
- Supports downloadable outputs for users.

### Dashboard Module
- Displays maps, charts, and prediction summaries.
- Serves as the main user interface for analysis.

## Module Relationships

- Frontend calls Backend APIs.
- Backend routes requests to Authentication, Prediction, Site Suitability, and Report modules.
- Prediction and Site Suitability modules rely on dataset ingestion and database results.
- Reports and Dashboard modules present processed outputs to users.
