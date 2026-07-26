# Infosys Virtual Internship – Day 17

**Project:** Solar & Wind Deployment Intelligence Platform  
**Date:** 22 July 2026  
**Intern:** Ganji Venkatesh

---

# Objective

The objective of Day 17 was to implement the **Energy Estimation Module**, which estimates the annual energy generation for Solar, Wind, and Hybrid renewable energy deployments. This module provides realistic annual energy production estimates based on installed capacity and capacity factor, making the platform more useful for deployment planning and site evaluation.

---

# Tasks Completed

## Task 1 – Solar Energy Estimation

### Objective

Develop a reusable function to estimate annual solar energy generation.

### Formula

Annual Solar Energy (MWh/year)

= Installed Capacity × Capacity Factor × 8760

### Implementation

Created the function:

```python
estimate_solar_energy(
    installed_capacity,
    capacity_factor
)
```

### Features

- Calculates annual solar energy generation.
- Validates installed capacity.
- Validates capacity factor (0–1).
- Returns annual energy in MWh/year.

---

## Task 2 – Wind Energy Estimation

### Objective

Develop a reusable function to estimate annual wind energy generation.

### Formula

Annual Wind Energy (MWh/year)

= Installed Capacity × Capacity Factor × 8760

### Implementation

Created the function:

```python
estimate_wind_energy(
    installed_capacity,
    capacity_factor
)
```

### Features

- Calculates annual wind energy generation.
- Supports different wind capacity factors.
- Includes input validation.
- Returns annual energy in MWh/year.

---

## Task 3 – Energy Estimation Service

### Objective

Create a centralized service that supports Solar, Wind, and Hybrid deployments.

### Implementation

Created:

```text
backend/app/services/energy/energy_service.py
```

### Features

Supports

- Solar
- Wind
- Hybrid

Returns

```python
{
    "deployment_type": "...",
    "solar_energy": ...,
    "wind_energy": ...,
    "total_energy": ...
}
```

The service internally calls the solar and wind estimation functions and combines their outputs based on the selected deployment type.

---

## Task 4 – Hybrid Energy Calculation

### Objective

Calculate the combined annual energy generation for hybrid renewable energy systems.

### Implementation

For Hybrid deployment:

- Estimate annual solar energy.
- Estimate annual wind energy.
- Calculate total annual energy.

Formula

```
Total Energy

=

Solar Energy

+

Wind Energy
```

Example

Solar Energy

```
192720 MWh/year
```

Wind Energy

```
306600 MWh/year
```

Total Energy

```
499320 MWh/year
```

---

## Task 5 – Validation Using Sample Sites

### Objective

Validate the Energy Estimation Module using automated unit tests.

### Test Coverage

Implemented tests for:

- Solar energy estimation
- Wind energy estimation
- Invalid installed capacity
- Invalid capacity factor
- Hybrid deployment
- Solar-only deployment
- Wind-only deployment

### Test Result

for checking all test results using command

pytest tests/test_energy_estimation.py -v

```text
=============================
9 passed in 0.05s
=============================
```

All energy estimation functions behaved as expected and passed every validation test.

---

# Project Structure

```
backend/
│
├── app/
│   └── services/
│       └── energy/
│           ├── __init__.py
│           ├── energy_estimation.py
│           └── energy_service.py
│
├── tests/
│   └── test_energy_estimation.py
│
└── pytest.ini
```

---

# Technical Skills Learned

- Renewable energy estimation
- Solar energy calculation
- Wind energy calculation
- Hybrid energy systems
- Capacity factor concepts
- Service-oriented architecture
- Python module organization
- Unit testing using Pytest
- Input validation
- Automated testing
- Project configuration using pytest.ini

---

# Challenges Faced

During testing, the Energy Estimation module initially failed because Pytest could not locate the `app` package.

### Root Cause

```
ModuleNotFoundError:
No module named 'app'
```

### Resolution

- Added `app/__init__.py`.
- Created `pytest.ini`.
- Configured the Python path for Pytest.

```ini
[pytest]
pythonpath = .
testpaths = tests
```

After applying these fixes, all unit tests executed successfully.

---

# Outcome

Successfully implemented a complete Energy Estimation Module capable of estimating annual energy production for Solar, Wind, and Hybrid renewable energy deployments.

The module is reusable, validated through automated testing, and ready to be integrated into future site recommendation and deployment planning features.

---

# Files Created

```
backend/app/services/energy/__init__.py

backend/app/services/energy/energy_estimation.py

backend/app/services/energy/energy_service.py

backend/tests/test_energy_estimation.py

backend/app/__init__.py

backend/pytest.ini
```

---

# Validation Status

| Module | Status |
|---------|--------|
| Solar Energy Estimation | ✅ Completed |
| Wind Energy Estimation | ✅ Completed |
| Energy Estimation Service | ✅ Completed |
| Hybrid Energy Calculation | ✅ Completed |
| Automated Unit Testing | ✅ Completed |
| Input Validation | ✅ Completed |
| Pytest Configuration | ✅ Completed |

---

# Day 17 Summary

Day 17 focused on implementing an Energy Estimation Module for the Solar & Wind Deployment Intelligence Platform. The work included developing reusable solar and wind estimation functions, designing a centralized energy service supporting Solar, Wind, and Hybrid deployments, implementing hybrid energy calculations, and validating the functionality through comprehensive Pytest unit tests. Configuration issues related to Python package discovery were resolved by adding the required package initialization and Pytest configuration. The module is now fully tested, maintainable, and ready for integration with the platform's deployment recommendation workflow.