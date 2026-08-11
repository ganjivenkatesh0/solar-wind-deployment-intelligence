# Day 25 — Explainable Machine Learning Prediction Engine

**Project:** Solar & Wind Deployment Intelligence Platform
**Day:** 25
**Date:** 3 August 2026

---

## 1. Objective

The objective of Day 25 was to make the machine learning prediction engine explainable.

The selected production machine learning model from Day 24 was extended so that the system can:

* Generate feature importance scores.
* Rank the input features by importance.
* Explain which features contribute most to the prediction.
* Return the explanation together with the ML prediction.
* Integrate the explanation into the existing `/analysis` API response.
* Document the selected model, evaluation results, influential features, assumptions, and limitations.

The implementation was designed to use the already serialized production model without retraining during inference.

---

## 2. Day 25 Tasks Completed

### Task 1 — Generate Feature Importance

The production model is a `RandomForestRegressor`.

Random Forest provides a built-in `feature_importances_` attribute, which was used to obtain the importance score of every feature used during training.

The implementation maps the importance values to the actual training feature names and sorts them in descending order.

The production model contains five input features.

### Feature Importance Results

| Rank | Feature                       | Importance |
| ---: | ----------------------------- | ---------: |
|    1 | `Hydro_Surface_Water_10^9_m3` |   0.392791 |
|    2 | `Governance_Score`            |   0.220707 |
|    3 | `Offshore_Wind_Potential_GW`  |   0.200196 |
|    4 | `renewables_share_elec`       |   0.158956 |
|    5 | `Year`                        |   0.027350 |

### Feature Importance Validation

* Number of features returned: **5**
* Expected training features: **5**
* Sum of feature importance scores: **1.0**
* Model type: **RandomForestRegressor**

This confirms that all trained input variables are represented in the explainability output.

---

## 3. Feature Importance Interpretation

The model's feature-importance ranking is:

1. `Hydro_Surface_Water_10^9_m3`
2. `Governance_Score`
3. `Offshore_Wind_Potential_GW`
4. `renewables_share_elec`
5. `Year`

The highest-ranked feature is `Hydro_Surface_Water_10^9_m3`, with an importance of approximately **39.28%**.

`Governance_Score` contributes approximately **22.07%**, while `Offshore_Wind_Potential_GW` contributes approximately **20.02%**.

`renewables_share_elec` contributes approximately **15.90%**.

`Year` has the lowest importance at approximately **2.74%**.

### Renewable-Energy Domain Validation

The ranking should be interpreted in the context of the actual training dataset and target variable.

The current model is predicting **Solar PVOUT potential**, but some of its input variables are broader renewable-energy and country-level indicators rather than direct site-level solar measurements.

Therefore, it is not appropriate to assume that the ranking represents physical solar causality.

In particular:

* `Hydro_Surface_Water_10^9_m3` being the most important feature does not mean water availability physically causes solar PV output.
* `Governance_Score` and `renewables_share_elec` are broader contextual indicators.
* `Offshore_Wind_Potential_GW` is a wind-related feature even though the prediction target is Solar PVOUT.
* `Year` has relatively low influence in comparison with the other variables.

This indicates that the current feature set is suitable for demonstrating the ML pipeline and explainability workflow, but it should not yet be interpreted as a physically optimized solar-energy feature set.

---

## 4. Task 2 — Validate the Results

The generated feature importance values were compared against the expected renewable-energy interpretation.

The results reveal an important limitation in the current training dataset.

The model does not currently use direct site-specific solar variables such as:

* Solar irradiance
* Temperature
* Relative humidity

as the five training features for the production ML model.

Instead, the trained model uses:

* `Year`
* `renewables_share_elec`
* `Governance_Score`
* `Offshore_Wind_Potential_GW`
* `Hydro_Surface_Water_10^9_m3`

Therefore, the current importance ranking should be treated as **model-based statistical importance**, not direct physical causation.

The ranking is considered technically valid for the current trained model because:

* All five trained features are represented.
* Importance values are correctly mapped to feature names.
* Values are sorted in descending order.
* The importance scores sum to 1.0.
* The serialized production model is the source of the explanation.

A future improvement should introduce more physically meaningful site-specific renewable-energy features when the required data becomes available.

---

## 5. Task 3 — Extend the Prediction Response

The prediction workflow was extended so that the model returns both:

1. The prediction.
2. A concise explanation of the most influential features.

The inference response now follows this structure:

```json
{
  "solar_pvout_potential": 3.2500270000000007,
  "explanation": {
    "top_features": [
      {
        "feature": "Hydro_Surface_Water_10^9_m3",
        "importance": 0.392791
      },
      {
        "feature": "Governance_Score",
        "importance": 0.220707
      },
      {
        "feature": "Offshore_Wind_Potential_GW",
        "importance": 0.200196
      }
    ],
    "summary": "The RandomForestRegressor predicts Solar PVOUT potential by prioritizing Hydro_Surface_Water_10^9_m3, Governance_Score, Offshore_Wind_Potential_GW, with the remaining features contributing in descending importance."
  }
}
```

The response exposes the three most influential features in the concise explanation while the explainability service can obtain the importance values for all five features.

---

## 6. Actual Production Inference Verification

The serialized production model was loaded directly without retraining.

### Model

`RandomForestRegressor`

### Prediction

```text
3.2500270000000007
```

### Top Influential Features

```text
Hydro_Surface_Water_10^9_m3 → 0.392791
Governance_Score             → 0.220707
Offshore_Wind_Potential_GW   → 0.200196
```

The inference result was successfully returned as a dictionary containing both prediction and explanation.

---

## 7. Task 4 — Document Model Behaviour

### Selected Model

The selected production model is:

**RandomForestRegressor**

It was selected during Day 24 after comparing it with a `DecisionTreeRegressor`.

The Random Forest model achieved stronger validation and held-out test performance despite requiring slightly more training time.

---

## 8. Day 24 Model Evaluation Results

The candidate models were evaluated using regression metrics.

### Validation Results

| Model                     |        MAE |       RMSE |         R² | Training Time |
| ------------------------- | ---------: | ---------: | ---------: | ------------: |
| DecisionTreeRegressor     |     0.0777 |     0.2521 |     0.8497 |     0.016 sec |
| **RandomForestRegressor** | **0.0950** | **0.1612** | **0.9385** | **0.312 sec** |

### Model Selection

**Selected model:** `RandomForestRegressor`

Although the Decision Tree had a slightly lower validation MAE, the Random Forest achieved:

* Lower validation RMSE.
* Higher validation R².
* Better overall predictive performance.
* Better generalization based on the held-out test set.

The additional training time was considered acceptable because the production workflow loads the serialized model rather than retraining it for every prediction.

---

## 9. Held-Out Test Results

The selected Random Forest model was evaluated on the held-out test set.

| Metric       |     Result |
| ------------ | ---------: |
| Test samples |        281 |
| MAE          | **0.0809** |
| RMSE         | **0.1414** |
| R²           | **0.9499** |

These results provide the final evaluation evidence for the selected production model.

---

## 10. Serialized Production Model

The production model is stored at:

```text
models/best_solar_pvout_model.joblib
```

The model was successfully loaded using the existing model persistence mechanism.

Verified model type:

```text
RandomForestRegressor
```

The model successfully produced a prediction after loading.

No model retraining was required during inference.

---

## 11. Explainability Implementation

A reusable explainability service was added:

```text
backend/app/services/machine_learning/explainability.py
```

The service:

* Loads the serialized production model.
* Reads `feature_importances_`.
* Maps importance values to the training feature names.
* Sorts features from highest to lowest importance.
* Returns the complete feature-importance list.
* Generates concise top-feature explanation information.

This keeps explainability separate from the core inference logic.

---

## 12. Inference Integration

The existing inference service was extended to return explainability information.

Updated component:

```text
backend/app/services/machine_learning/inference.py
```

The inference service continues to:

* Load the serialized model.
* Validate required features.
* Preserve the trained feature order.
* Generate predictions.

It now additionally returns:

* Prediction value.
* Top influential features.
* Feature importance values.
* Explanation summary.

---

## 13. Analysis Pipeline Integration

The existing analysis pipeline was updated so that the ML explanation is included in the `/analysis` response.

Updated component:

```text
backend/app/services/analysis_pipeline.py
```

The existing renewable-energy analysis functionality was preserved.

The API now returns:

```text
ml_prediction
├── solar_pvout_potential
└── explanation
    ├── top_features
    └── summary
```

---

## 14. Manual API Verification

The FastAPI application was started successfully using:

```bash
PYTHONPATH=backend uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The application reported:

```text
Application startup complete.
Uvicorn running on http://0.0.0.0:8000
```

PostgreSQL was also started and verified:

```text
localhost:5432 - accepting connections
```

### `/analysis` Verification

A POST request was sent to:

```text
POST /analysis
```

with:

```json
{
  "latitude": 16.3067,
  "longitude": 80.4365,
  "land_area_hectares": 100,
  "available_budget": 50000000
}
```

### Result

```text
HTTP/1.1 200 OK
```

The API successfully returned the complete analysis response.

---

## 15. Actual `/analysis` ML Response

The API returned:

```json
{
  "ml_prediction": {
    "solar_pvout_potential": 3.2500270000000007,
    "explanation": {
      "top_features": [
        {
          "feature": "Hydro_Surface_Water_10^9_m3",
          "importance": 0.392791
        },
        {
          "feature": "Governance_Score",
          "importance": 0.220707
        },
        {
          "feature": "Offshore_Wind_Potential_GW",
          "importance": 0.200196
        }
      ],
      "summary": "The RandomForestRegressor predicts Solar PVOUT potential by prioritizing Hydro_Surface_Water_10^9_m3, Governance_Score, Offshore_Wind_Potential_GW, with the remaining features contributing in descending importance."
    }
  }
}
```

This confirms that the explainable ML prediction is successfully integrated into the real application response.

---

## 16. Existing Pipeline Verification

The successful `/analysis` response also confirmed that the existing analysis pipeline continues to operate correctly.

Verified components include:

* Solar feature extraction.
* Wind assessment.
* Renewable resource scoring.
* Terrain scoring.
* Infrastructure scoring.
* Environmental scoring.
* Economic scoring.
* Overall site scoring.
* ML prediction.
* ML explanation.
* Deployment recommendation.
* Capacity planning.
* Energy estimation.
* Expansion analysis.
* Optimization.

Example verified values from the manual API request:

```text
Solar irradiance:       3.7915
Temperature:            24.55
Relative humidity:      74.06

Wind speed:             7.5
Wind classification:    Excellent
Wind capacity factor:   60

Renewable score:        35.41
Terrain score:          86.67
Infrastructure score:   95.5
Environmental score:    85.0
Economic score:         80.0
Overall site score:     67.1
```

The deployment pipeline also successfully returned:

```text
Deployment type: Solar
Recommended capacity: 80.0 MW
Expansion status: Limited Expansion
```

---

## 17. Automated Testing

The complete backend test suite was executed after the Day 25 implementation.

Command:

```bash
PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -v
```

### Result

```text
66 passed
```

There were no test failures.

The following areas were specifically verified:

* ML dataset preparation.
* Model training.
* Model persistence.
* Regression evaluation.
* Candidate model comparison.
* Best model selection.
* Production model persistence.
* ML inference.
* Feature validation.
* Feature ordering.
* Model explainability.
* Feature importance extraction.
* Analysis pipeline integration.

---

## 18. Day 25 Test Coverage

The machine-learning tests verify that:

* The production model can be loaded.
* Feature importance values are available.
* All trained features are represented.
* Feature importance values are sorted correctly.
* Importance values map to the correct feature names.
* Prediction output contains the expected structure.
* Explanation data is included in inference output.
* Feature validation continues to work.
* Feature order remains consistent with model training.

The analysis pipeline test verifies that the richer ML prediction response is successfully passed through the complete analysis workflow.

---

## 19. Limitations and Assumptions

### 19.1 Feature Dataset Limitation

The current production model uses five features:

```text
Year
renewables_share_elec
Governance_Score
Offshore_Wind_Potential_GW
Hydro_Surface_Water_10^9_m3
```

These are not all direct site-level solar-energy measurements.

Therefore, feature importance should not be interpreted as direct physical causality.

### 19.2 Feature Importance Limitation

Random Forest `feature_importances_` represents model-based feature importance.

It does not prove that a feature physically causes the target variable to change.

### 19.3 Site-Specific Explainability

The current explanation highlights the model's globally learned feature importance.

It does not yet provide a local explanation describing exactly how each feature changed the prediction for one particular site.

A future implementation could introduce techniques such as SHAP or another local explanation method.

### 19.4 Data Quality and Feature Selection

The current ranking suggests that broader renewable-energy and contextual variables strongly influence the model.

Future versions should investigate whether adding stronger site-specific features such as solar irradiance, temperature, geographic information, and other environmental variables improves the physical relevance of the model.

### 19.5 Model Maintenance

The production model depends on the feature schema used during training.

Any changes to the training features must also be reflected in the inference and explainability pipeline.

---

## 20. Future Improvements

Potential future improvements include:

1. Add more physically meaningful solar-energy features.
2. Introduce site-specific feature extraction into ML inference.
3. Investigate SHAP-based local explanations.
4. Explain the contribution of each feature for an individual prediction.
5. Monitor model performance after deployment.
6. Periodically retrain the model using improved datasets.
7. Compare additional regression algorithms.
8. Improve data quality and feature engineering.
9. Add model drift monitoring.
10. Connect explainability results to the upcoming Investment Analysis module.

---

## 21. Day 25 Final Status

| Area                                | Status       |
| ----------------------------------- | ------------ |
| Feature importance generation       | **COMPLETE** |
| Feature ranking validation          | **COMPLETE** |
| Prediction explanation              | **COMPLETE** |
| Inference integration               | **COMPLETE** |
| Analysis API integration            | **COMPLETE** |
| Production model loading            | **COMPLETE** |
| Manual inference verification       | **COMPLETE** |
| Manual `/analysis` API verification | **COMPLETE** |
| Automated testing                   | **COMPLETE** |
| Model behaviour documentation       | **COMPLETE** |

---

## 22. Final Summary

Day 25 successfully transformed the renewable-energy ML prediction engine into an explainable prediction workflow.

The production `RandomForestRegressor` was used to generate feature-importance scores, which were mapped to the five trained features and ranked in descending order.

The most influential feature was:

```text
Hydro_Surface_Water_10^9_m3 — 0.392791
```

followed by:

```text
Governance_Score — 0.220707
Offshore_Wind_Potential_GW — 0.200196
renewables_share_elec — 0.158956
Year — 0.027350
```

The selected model achieved a held-out test:

```text
MAE  = 0.0809
RMSE = 0.1414
R²   = 0.9499
```

The serialized model successfully produced:

```text
Solar PVOUT prediction = 3.2500270000000007
```

The prediction response now includes both the prediction and a concise explanation of the most influential features.

The `/analysis` endpoint was manually verified with an actual `HTTP 200 OK` response, confirming that the explainable ML output is integrated into the complete renewable-energy analysis pipeline.

The full backend test suite completed successfully with:

```text
66 passed
```

Therefore, the Day 25 objective of making the prediction engine explainable was successfully completed.
