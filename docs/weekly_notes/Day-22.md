# Infosys Virtual Internship – Day 22

**Date:** 29 July 2026

## Objective

Train and evaluate the first baseline machine learning models for the Solar & Wind Deployment Intelligence Platform.

The objective of Day 22 was to move from a single baseline Random Forest model to a proper model comparison workflow by:

- Preparing training, validation, and testing datasets.
- Training two different regression algorithms.
- Comparing their performance.
- Analyzing model behavior.
- Selecting the best-performing model.
- Persisting the selected model for future FastAPI integration.

---

## Task 1 — Prepare the Dataset Split

The machine learning dataset prepared during Day 21 was used.

### Dataset

Source:

```text
datasets/raw/global_wind_atlas/global_data.xlsx
````

Dataset size:

```text
1,872 records
```

### Input Features

The model uses five numerical input features:

```text
Year
renewables_share_elec
Governance_Score
Offshore_Wind_Potential_GW
Hydro_Surface_Water_10^9_m3
```

### Target Variable

```text
Solar_PVOUT_Potential
```

### Dataset Shape

```text
Features: (1872, 5)
Target:   (1872,)
```

### Three-Way Split

The dataset was divided into:

```text
Training:   1,310 samples
Validation:   281 samples
Testing:     281 samples
Total:      1,872 samples
```

Approximate ratio:

```text
70% Training
15% Validation
15% Testing
```

### Reason for the Split

The training set is used to learn the model parameters.

The validation set is used to compare different models and select the best-performing model without using the final test data.

The testing set is reserved for future final evaluation after the model-selection process.

---

## Task 2 — Train Two Baseline Models

Two regression algorithms were implemented and trained.

### Model 1 — Decision Tree Regressor

Algorithm:

```text
DecisionTreeRegressor
```

The Decision Tree provides a simple tree-based baseline and allows comparison against the ensemble model.

### Model 2 — Random Forest Regressor

Algorithm:

```text
RandomForestRegressor
```

Configuration:

```text
Number of Trees: 100
```

The Random Forest combines multiple decision trees to improve robustness and generalization.

---

## Task 3 — Compare Model Performance

Both models were evaluated using regression metrics.

The following metrics were used:

* MAE
* RMSE
* R² Score

### Validation Comparison

| Model         | Training MAE | Validation MAE | Training RMSE | Validation RMSE | Training R² | Validation R² |
| ------------- | -----------: | -------------: | ------------: | --------------: | ----------: | ------------: |
| Decision Tree |       0.0000 |         0.0777 |        0.0000 |          0.2521 |      1.0000 |        0.8497 |
| Random Forest |       0.0340 |         0.0950 |        0.0654 |          0.1612 |      0.9897 |    **0.9385** |

### Best Model

The selected model was:

```text
Random Forest Regressor
```

Validation R²:

```text
0.9385
```

Validation RMSE:

```text
0.1612
```

The Random Forest achieved a substantially higher validation R² and lower validation RMSE than the Decision Tree.

Therefore, Random Forest was selected as the better-performing baseline model.

---

## Task 4 — Analyze Model Behaviour

### Decision Tree

Training performance:

```text
R² = 1.0000
RMSE = 0.0000
MAE = 0.0000
```

Validation performance:

```text
R² = 0.8497
RMSE = 0.2521
MAE = 0.0777
```

The Decision Tree achieves perfect performance on the training data but performs considerably worse on validation data.

This indicates that the model has learned the training data too closely and does not generalize as effectively to unseen data.

**Conclusion: Overfitting**

---

### Random Forest

Training performance:

```text
R² = 0.9897
RMSE = 0.0654
MAE = 0.0340
```

Validation performance:

```text
R² = 0.9385
RMSE = 0.1612
MAE = 0.0950
```

The Random Forest has a small performance gap between training and validation compared with the Decision Tree.

It maintains a strong validation R² of 0.9385 and a lower validation RMSE of 0.1612.

**Conclusion: Generalizes better than the Decision Tree**

---

## Task 5 — Select and Persist the Best Model

The trained models were compared automatically using their validation performance.

The selected model was:

```text
Random Forest Regressor
```

The model was persisted using `joblib`.

Saved model:

```text
models/best_solar_pvout_model.joblib
```

The saved model was successfully loaded again and verified.

Verification:

```text
Loaded: RandomForestRegressor
Trees: 100
```

This persisted model will be used during the upcoming FastAPI integration stage.

---

## Machine Learning Module Structure

The machine learning service now contains:

```text
backend/app/services/machine_learning/
├── __init__.py
├── baseline_model.py
├── dataset_preparation.py
├── evaluation.py
├── model_comparison.py
└── model_persistence.py
```

### Module Responsibilities

`dataset_preparation.py`

* Loads the training dataset.
* Validates required columns.
* Selects input features.
* Selects the target variable.

`baseline_model.py`

* Trains the initial Random Forest regression model.

`evaluation.py`

* Calculates MAE.
* Calculates RMSE.
* Calculates R² score.

`model_comparison.py`

* Performs the three-way dataset split.
* Trains Decision Tree and Random Forest models.
* Evaluates both models.
* Compares model performance.
* Selects the best model.

`model_persistence.py`

* Saves trained models using joblib.
* Loads persisted models for later inference.

---

## Testing

### Machine Learning Test Suite

Command:

```bash
PYTHONPATH=backend pytest backend/tests/test_machine_learning.py -v
```

Result:

```text
8 passed, 600 warnings
```

The eight tests verify:

1. Training dataset preparation
2. Random Forest training
3. Model persistence
4. Regression evaluation
5. Three-way dataset split
6. Training of two baseline models
7. Selection of Random Forest as the best model
8. Persistence of the best model

---

## Full Project Test Suite

Command:

```bash
PYTHONPATH=backend pytest backend/tests -v
```

Result:

```text
61 passed, 600 warnings in 6.38s
```

All existing project modules continued to pass after the Day 22 machine learning implementation.

This confirms that the new machine learning functionality did not break the existing:

* Analysis pipeline
* Scoring engine
* Energy estimation
* Optimization engine
* Deployment recommendation
* Spatial analysis
* Vector processing
* Raster processing
* Coordinate validation
* Machine learning modules

---

## Warning Information

The test suite produced 600 deprecation warnings related to the current NumPy 2.5 and joblib interaction:

```text
DeprecationWarning:
Setting the shape on a NumPy array has been deprecated in NumPy 2.5.
```

These warnings did not cause test failures.

All 61 tests completed successfully.

---

## Day 22 Files Added or Modified

### Added

```text
backend/app/services/machine_learning/model_comparison.py
```

### Updated

```text
backend/tests/test_machine_learning.py
```

### Generated Model

```text
models/best_solar_pvout_model.joblib
```

### Documentation

```text
docs/weekly_notes/Day-22.md
```

---

## Day 22 Final Status

### Completed

* [x] Prepared training, validation, and testing datasets
* [x] Implemented 70/15/15 dataset split
* [x] Trained Decision Tree Regressor
* [x] Trained Random Forest Regressor
* [x] Evaluated both models
* [x] Compared validation performance
* [x] Analyzed overfitting and generalization
* [x] Selected Random Forest as the best model
* [x] Persisted the best model using joblib
* [x] Verified model loading
* [x] Added machine learning tests
* [x] Passed all machine learning tests
* [x] Passed the complete project test suite

### Final Test Result

```text
Machine Learning Tests:
8 passed

Complete Project Tests:
61 passed
```

## Next Step

The next stage is to integrate the persisted Random Forest model into the FastAPI backend so that the application can perform machine learning-based predictions instead of relying only on the existing rule-based logic.

````

