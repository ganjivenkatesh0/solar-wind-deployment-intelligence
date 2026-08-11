
# Day 26 — Technical Feasibility Engine

**Project:** Solar & Wind Deployment Intelligence Platform
**Day:** 26
**Date:** 4 August 2026

---

## 1. Objective

The objective of Day 26 was to introduce a dedicated Technical Feasibility Engine into the renewable energy site analysis workflow.

The feasibility layer was designed to evaluate whether a site is technically suitable for deployment by combining:

* Mandatory hard constraint validation.
* Non-mandatory soft constraint scoring.
* Final technical feasibility decision.
* Integration with the existing machine learning prediction pipeline.
* Integration with the existing `/analysis` API response.
* Scenario-based validation of different site conditions.

The feasibility workflow follows:

```text
Historical Data
        │
        ▼
Feature Engineering
        │
        ▼
Machine Learning Model
        │
        ▼
Prediction Output
        │
        ▼
Technical Feasibility Engine
        │
   ┌────┴────┐
   ▼         ▼
Hard       Soft
Constraints Constraints
   │         │
   └────┬────┘
        ▼
Final Engineering Decision
        │
        ▼
API Response / Dashboard
````

---

## 2. Task 1 — Create a Feasibility Module

A dedicated reusable feasibility module was created under:

```text
backend/app/services/feasibility/
├── __init__.py
├── hard_constraints.py
├── soft_constraints.py
└── feasibility_engine.py
```

The module separates mandatory engineering validation from non-mandatory scoring.

### Module responsibilities

| Module                  | Responsibility                             |
| ----------------------- | ------------------------------------------ |
| `hard_constraints.py`   | Mandatory pass/fail technical constraints  |
| `soft_constraints.py`   | Non-mandatory feasibility scoring          |
| `feasibility_engine.py` | Combines hard and soft feasibility results |
| `__init__.py`           | Feasibility service package                |

This keeps the feasibility logic independent from the main analysis pipeline and allows it to be reused by other components in the future.

---

## 3. Task 2 — Implement Hard Constraint Validation

Hard constraints are mandatory technical requirements.

A failure in any hard constraint makes the site technically infeasible.

The initial hard constraints implemented are:

* Land-use restriction.
* Maximum terrain slope.

### Maximum Slope Constraint

The configured default maximum slope is:

```text
15.0°
```

A site passes the terrain constraint when:

```text
0° <= slope <= 15°
```

A site with a slope greater than `15°` fails the terrain constraint.

### Land-Use Constraint

The feasibility engine accepts:

```text
land_use_restricted
```

as an explicit boolean input.

When:

```text
land_use_restricted = False
```

the land-use constraint passes.

When:

```text
land_use_restricted = True
```

the land-use constraint fails.

The current analysis pipeline does not yet retrieve a real land-use classification from an external spatial dataset, so the default value remains `False`. The design allows real land-use classification to be connected later when the required spatial data is available.

### Hard Constraint Result

The hard constraint validator returns:

```text
passed
constraints
failed_constraints
```

Each constraint also provides:

```text
passed
status
reason
```

---

## 4. Hard Constraint Validation Results

The implementation was manually tested using different site conditions.

### Scenario 1 — Valid Terrain and Permitted Land

```text
Slope: 4°
Land use: Permitted
```

Result:

```text
passed = True
failed_constraints = []
```

### Scenario 2 — Unacceptable Terrain

```text
Slope: 20°
Land use: Permitted
```

Result:

```text
passed = False
failed_constraints = ["terrain"]
```

The system correctly rejected the site.

### Scenario 3 — Restricted Land

```text
Slope: 4°
Land use: Restricted
```

Result:

```text
passed = False
failed_constraints = ["land_use"]
```

The system correctly rejected the site.

---

## 5. Task 3 — Implement Soft Constraint Scoring

Soft constraints do not immediately reject a site.

Instead, they contribute to an overall technical feasibility score.

The implementation reuses the existing infrastructure normalization functions:

```text
normalize_grid_distance()
normalize_road_distance()
```

The current soft constraints are:

* Grid proximity.
* Road accessibility.

### Soft Constraint Calculation

The grid and road scores are averaged:

```text
Soft Feasibility Score =
(Grid Proximity Score + Road Accessibility Score) / 2
```

The final score is rounded to two decimal places.

---

## 6. Soft Constraint Validation Results

Two different infrastructure scenarios were tested.

### Good Infrastructure

```text
Grid distance: 1.0 km
Road distance: 1.0 km
```

Results:

```text
Grid score: 98.00
Road score: 96.67
Feasibility score: 97.34
```

### Poor Infrastructure

```text
Grid distance: 20.0 km
Road distance: 15.0 km
```

Results:

```text
Grid score: 60.00
Road score: 50.00
Feasibility score: 55.00
```

This confirms that poorer infrastructure reduces the feasibility score without automatically rejecting the site.

---

## 7. Task 4 — Implement the Feasibility Engine

A reusable `FeasibilityEngine` was created in:

```text
backend/app/services/feasibility/feasibility_engine.py
```

The engine combines:

```text
Hard Constraint Validation
          +
Soft Constraint Scoring
          ↓
Technical Feasibility Decision
```

The engine returns:

```text
is_feasible
feasibility_score
decision
hard_constraints
soft_constraints
constraint_summary
```

### Engineering Decision Rule

The system follows the rule:

```text
Hard Constraints PASS
        ↓
TECHNICALLY FEASIBLE
```

and:

```text
Any Hard Constraint FAIL
        ↓
NOT TECHNICALLY FEASIBLE
```

A hard constraint failure overrides the soft score.

For an infeasible site:

```text
is_feasible = false
feasibility_score = 0.0
decision = "NOT TECHNICALLY FEASIBLE"
```

For a feasible site, the soft constraint score becomes the technical feasibility score.

---

## 8. Task 4 — Integrate Feasibility with the Existing Pipeline

The `FeasibilityEngine` was integrated into:

```text
backend/app/services/analysis_pipeline.py
```

The analysis pipeline now initializes:

```text
FeasibilityEngine
```

and evaluates technical feasibility after the existing terrain and infrastructure values are available.

The updated workflow is:

```text
Solar Features
      │
      ▼
ML Prediction
      │
      ├─────────────────┐
      │                 │
      ▼                 ▼
ML Explanation    Technical Data
                        │
                        ▼
               Feasibility Engine
                  /           \
                 ▼             ▼
              Hard           Soft
           Constraints      Scoring
                 \             /
                  ▼           ▼
                Technical Feasibility
                        │
                        ▼
                Existing Analysis
                     Pipeline
```

The existing ML prediction and explainability output remains available.

---

## 9. Analysis Response Extension

The analysis response schema was extended with:

```text
technical_feasibility
```

The response now contains:

```text
technical_feasibility
├── is_feasible
├── feasibility_score
├── decision
├── hard_constraints
├── soft_constraints
└── constraint_summary
```

The ML response continues to contain:

```text
ml_prediction
├── solar_pvout_potential
└── explanation
```

Therefore the API combines both predictive intelligence and engineering validation.

---

## 10. API Response Verification

The FastAPI endpoint was verified using:

```text
POST /analysis
```

Test request:

```json
{
  "latitude": 17.3850,
  "longitude": 78.4867,
  "land_area_hectares": 40.0,
  "available_budget": 5000000
}
```

### HTTP Result

```text
HTTP 200 OK
```

### ML Prediction

```text
Solar PVOUT prediction:
3.2500270000000007
```

The ML explanation was also present.

### Technical Feasibility

```text
is_feasible: true
feasibility_score: 95.5
decision: TECHNICALLY FEASIBLE
```

### Hard Constraints

```text
Land use: PASS
Terrain: PASS
Failed constraints: []
```

### Soft Constraints

```text
Grid proximity score: 96.0
Road accessibility score: 95.0
Overall feasibility score: 95.5
```

The existing analysis response fields were also verified to remain present, including:

* Solar features.
* Wind assessment.
* Renewable score.
* Terrain score.
* Infrastructure score.
* Environmental score.
* Economic score.
* Overall site score.
* ML prediction.
* Deployment plan.

---

## 11. Task 5 — Scenario Validation

Multiple hypothetical scenarios were validated.

### Scenario A — All Constraints Pass

```text
Slope: 4°
Grid distance: 1 km
Road distance: 1 km
Land use: Permitted
```

Result:

```text
Technically Feasible
Feasibility Score: 97.34
```

### Scenario B — Hard Constraint Failure

```text
Slope: 20°
Grid distance: 1 km
Road distance: 1 km
Land use: Permitted
```

Result:

```text
NOT TECHNICALLY FEASIBLE
Feasibility Score: 0.0
Failed constraint: terrain
```

This confirms that excellent infrastructure cannot override a mandatory terrain failure.

### Scenario C — Poor Soft Constraints

```text
Slope: 4°
Grid distance: 20 km
Road distance: 15 km
Land use: Permitted
```

Result:

```text
TECHNICALLY FEASIBLE
Feasibility Score: 55.0
```

This confirms that poor infrastructure affects the feasibility score without automatically rejecting the site.

### Scenario D — Restricted Land

```text
Slope: 4°
Grid distance: 1 km
Road distance: 1 km
Land use: Restricted
```

Result:

```text
NOT TECHNICALLY FEASIBLE
Feasibility Score: 0.0
Failed constraint: land_use
```

---

## 12. Automated Testing

A dedicated feasibility test module was created:

```text
backend/tests/test_feasibility.py
```

The tests cover:

* Valid site feasibility.
* Terrain hard constraint failure.
* Land-use hard constraint failure.
* Better infrastructure producing a higher score.
* Poor soft constraints not automatically rejecting a site.
* Multiple hard constraint failures.

### Dedicated Feasibility Tests

```text
6 passed
0 failed
```

### Full Backend Test Suite

The complete backend test suite was executed after the Day 26 integration.

```text
72 passed
0 failed
0 skipped
```

The test suite completed successfully.

Pytest reported approximately:

```text
3601 warnings
```

These warnings were primarily associated with existing `joblib` / `scikit-learn` and dependency-level deprecation warnings. They did not cause any test failures.

---

## 13. Day 26 Architecture

The final Day 26 architecture is:

```text
                  POST /analysis
                        │
                        ▼
             AnalysisPipelineService
                        │
          ┌─────────────┴─────────────┐
          ▼                           ▼
   ML Prediction              Technical Data
          │                           │
          ▼                           ▼
   ML Explanation             FeasibilityEngine
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
                  Hard Constraints          Soft Constraints
                         │                         │
                     PASS/FAIL                  Score
                         │                         │
                         └────────────┬────────────┘
                                      ▼
                           Technical Feasibility
                                      │
                                      ▼
                           Existing Analysis
                              and Deployment
                                  Pipeline
                                      │
                                      ▼
                              API Response
```

---

## 14. Implementation Files

### New Files

```text
backend/app/services/feasibility/__init__.py
backend/app/services/feasibility/hard_constraints.py
backend/app/services/feasibility/soft_constraints.py
backend/app/services/feasibility/feasibility_engine.py
backend/tests/test_feasibility.py
```

### Modified Files

```text
backend/app/schemas/analysis.py
backend/app/services/analysis_pipeline.py
```

---

## 15. Technical Limitations and Future Improvements

The current Day 26 implementation provides the feasibility architecture and validation framework, but some inputs are still temporary values in the existing analysis pipeline.

The current pipeline uses temporary values for:

```text
Wind speed
Terrain slope
Grid distance
Road distance
Environmental score
Economic score
```

The land-use restriction is also currently supplied as an explicit boolean rather than being derived from a live land-use dataset.

Future improvements can connect the feasibility engine to real:

* Land-use classification.
* Terrain data.
* Infrastructure datasets.
* Grid connectivity information.
* Road accessibility information.
* Environmental restrictions.
* Engineering thresholds specific to solar and wind technologies.

The current architecture is designed so these real data sources can be integrated without replacing the feasibility engine itself.

---

## 16. Day 26 Outcome

Day 26 successfully introduced a dedicated Technical Feasibility Engine into the Solar & Wind Deployment Intelligence Platform.

The system can now:

* Validate mandatory technical constraints.
* Reject sites that violate hard constraints.
* Score non-mandatory technical factors.
* Distinguish between hard failures and soft limitations.
* Combine ML prediction with engineering validation.
* Return technical feasibility information through the `/analysis` API.
* Validate multiple site scenarios.
* Preserve existing ML explainability functionality.
* Pass the complete backend regression test suite.

### Final Verification

```text
Feasibility implementation:        PASS
Hard constraint validation:       PASS
Soft constraint scoring:           PASS
Pipeline integration:              PASS
API verification:                  PASS
HTTP /analysis:                    200 OK
Feasibility tests:                 6/6 PASS
Full backend tests:                72/72 PASS
```

Day 26 implementation is complete and ready for version control.
EOF

````
