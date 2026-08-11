# Day 24 — Machine Learning Model Evaluation, Selection, Serialization and Integration

## Infosys Virtual Internship

**Project:** Solar & Wind Deployment Intelligence Platform  
**Day:** 24  
**Date:** 31 July 2026  
**Module:** Machine Learning Model Evaluation and Deployment Preparation

---

## 1. Day 24 Objective

The objective of Day 24 was to evaluate multiple trained machine learning models, compare their predictive performance, select the most suitable model for deployment, serialize the selected model, and verify that the production inference pipeline can use the serialized model without retraining it during every prediction.

The work focused on the renewable-energy prediction task implemented in the project.

---

# 2. Tasks Completed

## Task 1 — Train Multiple Candidate Models

Two regression models were trained for the selected prediction problem:

1. Decision Tree Regressor
2. Random Forest Regressor

The objective was to compare multiple candidate algorithms instead of assuming that a single model would always provide the best performance.

Both models were trained using the same training dataset and evaluated using the same validation data.

---

# 3. Task 2 — Model Evaluation

Because the selected prediction problem is a regression problem, the following evaluation metrics were used:

- Mean Absolute Error (MAE)
- Root Mean Squared Error (RMSE)
- R² Score

Training time was also recorded because model selection should consider practical deployment factors in addition to predictive accuracy.

---

## 3.1 Model Comparison Results

| Model | MAE | RMSE | R² | Training Time |
|---|---:|---:|---:|---:|
| DecisionTreeRegressor | 0.0777 | 0.2521 | 0.8497 | 0.0248 sec |
| RandomForestRegressor | 0.0950 | 0.1612 | 0.9385 | 0.2930 sec |

### Interpretation

### Decision Tree Regressor

- MAE: `0.0777`
- RMSE: `0.2521`
- R²: `0.8497`
- Training time: `0.0248 seconds`

The Decision Tree trained significantly faster and has lower model complexity, but its validation RMSE and R² were weaker compared with the Random Forest.

### Random Forest Regressor

- MAE: `0.0950`
- RMSE: `0.1612`
- R²: `0.9385`
- Training time: `0.2930 seconds`

The Random Forest achieved substantially better validation RMSE and R². Although it required more training time than the Decision Tree, the training time remained small for this project.

---

# 4. Task 3 — Select the Best Performing Model

The selected production model is:

**RandomForestRegressor**

The selection considered:

- Validation R²
- Validation RMSE
- Validation MAE
- Training time
- Model suitability for deployment
- Model complexity
- Ease of serialization and inference

The Random Forest achieved the strongest overall predictive performance among the candidate models.

### Selected Model

```text
RandomForestRegressor
````

### Validation Performance

```text
MAE  = 0.0950
RMSE = 0.1612
R²   = 0.9385
```

---

# 5. Held-Out Test Set Evaluation

After model selection, the selected Random Forest model was evaluated on the separate held-out test dataset.

### Test Set Results

| Metric    | Result |
| --------- | -----: |
| Test MAE  | 0.0809 |
| Test RMSE | 0.1414 |
| Test R²   | 0.9499 |

These results provide an additional evaluation of the selected model on data that was not used for candidate model selection.

---

# 6. Task 4 — Serialize the Selected Model

The selected Random Forest model was serialized using `joblib`.

Production model file:

```text
models/best_solar_pvout_model.joblib
```

The generated model file was verified successfully.

### Serialization Verification

The serialized model was loaded again using the existing model persistence service.

The loaded model type was confirmed as:

```text
RandomForestRegressor
```

A sample prediction was also successfully generated from the loaded model.

This confirms that the model can be persisted and loaded for production inference.

---

# 7. Task 5 — End-to-End Integration

The selected serialized model was integrated with the existing ML inference pipeline.

The existing `RenewableModelInference` service loads:

```text
models/best_solar_pvout_model.joblib
```

The model is loaded during inference service initialization rather than being retrained for every prediction.

The existing `/analysis` pipeline exposes the prediction through:

```text
ml_prediction
```

with:

```text
solar_pvout_potential
```

The integration therefore follows the intended flow:

```text
Serialized Model
      ↓
Model Persistence
      ↓
RenewableModelInference
      ↓
AnalysisPipelineService
      ↓
/analysis
      ↓
ML Prediction
```

---

# 8. Automated Testing

The complete backend test suite was executed after the Day 24 changes.

Command:

```bash
PYTHONPATH=backend pytest backend/tests -v
```

### Result

```text
65 passed
```

There were no test failures.

### Test Coverage Included

The test suite verified:

* Dataset preparation
* Random Forest training
* Model persistence
* Regression evaluation
* Three-way dataset splitting
* Candidate model training
* Random Forest model selection
* Best model persistence
* Candidate model comparison
* Validation metrics
* Model inference
* Feature validation
* Feature ordering
* Analysis pipeline integration
* Existing scoring functionality
* Energy estimation
* Deployment recommendation
* Optimization
* Spatial analysis
* Vector processing
* Raster processing

---

# 9. Targeted ML Test

The machine-learning test suite was also executed independently.

Command:

```bash
PYTHONPATH=backend .venv/bin/python -m pytest backend/tests/test_machine_learning.py -q
```

Result:

```text
12 passed
```

The Day 24 candidate model comparison and serialization test passed successfully.

---

# 10. Analysis Pipeline Test

The analysis pipeline test was executed independently.

Command:

```bash
PYTHONPATH=backend .venv/bin/python -m pytest backend/tests/test_analysis_pipeline.py -v
```

Result:

```text
1 passed
```

The test confirmed:

* `RenewableModelInference` is initialized
* ML prediction is present
* `solar_pvout_potential` is returned
* Existing solar features remain available
* Wind assessment remains available
* Existing scoring remains available
* Deployment information remains available

---

# 11. Production Model Verification

The serialized model file was checked directly:

```bash
ls -lh models/best_solar_pvout_model.joblib
```

The file was present with a size of approximately:

```text
4.7 MB
```

The model was then loaded using:

```bash
PYTHONPATH=backend python -c "from app.services.machine_learning.model_persistence import ModelPersistence; m=ModelPersistence.load('models/best_solar_pvout_model.joblib'); print(type(m).__name__)"
```

Result:

```text
RandomForestRegressor
```

This confirms that the serialized production model is valid and loadable.

---

# 12. Manual API Verification

Manual API testing was attempted using the local FastAPI server.

Example request:

```json
{
  "latitude": 16.3067,
  "longitude": 80.4365,
  "land_area_hectares": 100,
  "available_budget": 50000000
}
```

Additional locations were also prepared for verification.

However, the local server was not running on:

```text
127.0.0.1:8000
```

The request returned:

```text
curl: (7) Failed to connect to 127.0.0.1 port 8000
```

Public Codespaces Swagger testing was also attempted.

The public tunnel returned:

```text
HTTP 401
```

with:

```text
www-authenticate: tunnel
```

Therefore, public/manual API verification could not be completed during this verification step because of the development tunnel/server access state.

This does not indicate a failure in the ML implementation itself because the local automated test suite completed successfully with:

```text
65 passed
```

---

# 13. Existing Functionality Verification

The existing application functionality remained covered by the automated test suite.

The following components continued to pass:

* Solar feature extraction
* Wind assessment
* Renewable resource scoring
* Terrain scoring
* Infrastructure scoring
* Environmental scoring
* Economic scoring
* Overall site scoring
* Energy estimation
* Deployment recommendation
* Capacity planning
* Expansion analysis
* Optimization
* Ranking
* Spatial analysis
* Vector processing
* Raster processing
* ML inference

---

# 14. Warnings

The test suite completed successfully but produced approximately `2101` warnings.

The main warnings were related to:

```text
joblib/numpy_pickle.py
```

and NumPy array shape handling.

There was also a scikit-learn warning related to predicting with an input without feature names while the model was fitted with feature names.

These warnings did not cause test failures.

They can be addressed as future maintenance improvements.

---

# 15. Files Modified

The following files were modified during Day 24:

```text
backend/app/services/machine_learning/model_comparison.py
backend/tests/test_analysis_pipeline.py
backend/tests/test_machine_learning.py
models/best_solar_pvout_model.joblib
```

No new application source file was required for Day 24.

---

# 16. Day 24 ML Pipeline

The completed machine-learning workflow is:

```text
Renewable Energy Dataset
        ↓
Dataset Preparation
        ↓
Three-Way Dataset Split
        ↓
 ┌──────────────────────┐
 │                      │
 ▼                      ▼
Decision Tree       Random Forest
 │                      │
 └──────────┬───────────┘
            ↓
      Model Evaluation
            ↓
     MAE / RMSE / R²
            ↓
    Model Comparison
            ↓
   Best Model Selection
            ↓
   Random Forest Selected
            ↓
     Test Set Evaluation
            ↓
       Joblib Serialization
            ↓
best_solar_pvout_model.joblib
            ↓
   RenewableModelInference
            ↓
   Analysis Pipeline
            ↓
     ML Prediction
```

---

# 17. Overall Day 24 Results

| Area                        | Result                                |
| --------------------------- | ------------------------------------- |
| Candidate models trained    | 2                                     |
| Decision Tree validation R² | 0.8497                                |
| Random Forest validation R² | 0.9385                                |
| Selected model              | RandomForestRegressor                 |
| Test MAE                    | 0.0809                                |
| Test RMSE                   | 0.1414                                |
| Test R²                     | 0.9499                                |
| Production model            | `best_solar_pvout_model.joblib`       |
| Model serialization         | Successful                            |
| Model loading               | Successful                            |
| Sample inference            | Successful                            |
| ML tests                    | 12 passed                             |
| Analysis pipeline tests     | 1 passed                              |
| Full backend tests          | 65 passed                             |
| Public API manual test      | Blocked by Codespaces tunnel HTTP 401 |
| Code formatting check       | Clean                                 |

---

# 18. Day 24 Final Status

### Task 1 — Train Multiple Candidate Models

**COMPLETE**

Decision Tree and Random Forest regression models were trained and compared.

### Task 2 — Evaluate Models

**COMPLETE**

MAE, RMSE and R² were calculated and training time was recorded.

### Task 3 — Select Best Model

**COMPLETE**

RandomForestRegressor was selected based primarily on stronger validation performance while considering training and deployment characteristics.

### Task 4 — Serialize Selected Model

**COMPLETE**

The selected Random Forest model was serialized to:

```text
models/best_solar_pvout_model.joblib
```

### Task 5 — Verify End-to-End Integration

**COMPLETE**

Automated integration tests confirmed that the serialized model is loaded through the inference pipeline and produces predictions without retraining during inference.

---

# 19. Final Day 24 Conclusion

Day 24 successfully completed the machine-learning model evaluation and deployment preparation stage.

Two candidate regression models were trained and evaluated. The Random Forest Regressor achieved the strongest validation performance and was selected as the production model.

The selected model achieved:

```text
Validation R² = 0.9385
Test R²       = 0.9499
Test RMSE     = 0.1414
Test MAE      = 0.0809
```

The model was successfully serialized using joblib, loaded again, and integrated with the existing inference pipeline.

The complete backend test suite passed:

```text
65 passed
```

Therefore, the Day 24 implementation is complete from the machine-learning, testing, serialization, and integration perspective.

The remaining limitation is only the manual public API verification, which was blocked by the Codespaces tunnel returning HTTP 401 during testing.
EOF

````

