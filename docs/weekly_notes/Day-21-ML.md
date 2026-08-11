# Infosys Virtual Internship – Day 21

**Date:** 28 July 2026

## Objective

Implement the first Machine Learning baseline for the Solar & Wind Deployment Intelligence Platform using historical renewable-energy data.

The Day 21 implementation focused on preparing a supervised learning dataset, training a `RandomForestRegressor`, evaluating its performance using regression metrics, persisting the trained model using `joblib`, validating model reload and prediction, adding automated tests, and verifying that all previously implemented project modules continue to work correctly.

---

# Tasks Completed

## Task 1 — Prepare the Machine Learning Training Dataset

Reviewed the available renewable-energy datasets and selected the Global Wind Atlas dataset as the initial source for the ML baseline.

Dataset used:

```text
datasets/raw/global_wind_atlas/global_data.xlsx
```

Dataset characteristics:

```text
Rows: 1,872
Columns: 9
```

Available columns:

```text
Country
ISO_Code
Year
renewables_share_elec
Governance_Score
Solar_PVOUT_Potential
Offshore_Wind_Potential_GW
Hydro_Surface_Water_10^9_m3
Region
```

### Selected Prediction Problem

The first ML problem was implemented as a **regression task**.

Target variable:

```text
Solar_PVOUT_Potential
```

### Selected Input Features

The following five numerical features were selected:

```text
Year
renewables_share_elec
Governance_Score
Offshore_Wind_Potential_GW
Hydro_Surface_Water_10^9_m3
```

Categorical fields such as:

```text
Country
ISO_Code
Region
```

were not used in the first baseline in order to keep the initial Random Forest implementation simple and focused on numerical features.

### Dataset Preparation Module

Created:

```text
backend/app/services/machine_learning/dataset_preparation.py
```

Implemented:

```text
RenewableTrainingDataset
```

Responsibilities:

* Load the Global Wind Atlas Excel dataset.
* Validate the required columns.
* Select the required ML features.
* Select `Solar_PVOUT_Potential` as the target.
* Remove rows containing missing values.
* Return the feature matrix `X` and target vector `y`.

Final prepared dataset:

```text
Features (X): 1,872 rows × 5 features
Target (y):    1,872 values
```

---

## Task 2 — Train the Baseline Random Forest Model

Created:

```text
backend/app/services/machine_learning/baseline_model.py
```

Implemented:

```text
RenewableBaselineModel
```

The model uses Scikit-learn's:

```text
RandomForestRegressor
```

### Training Configuration

```text
Model: RandomForestRegressor
Number of trees: 100
Test size: 20%
Random state: 42
Parallel processing: n_jobs=-1
```

### Train/Test Split

The prepared dataset was divided using an 80/20 train-test split.

```text
Total samples:     1,872

Training samples:  1,497
Testing samples:     375
```

Pipeline:

```text
Global Wind Atlas Dataset
          ↓
Dataset Preparation
          ↓
Feature Selection
          ↓
Target Selection
          ↓
80/20 Train-Test Split
          ↓
RandomForestRegressor
          ↓
Trained ML Model
```

The Random Forest model was successfully trained using the real project dataset.

---

## Task 3 — Evaluate Model Performance

Created:

```text
backend/app/services/machine_learning/evaluation.py
```

Implemented:

```text
RegressionEvaluator
```

The model was evaluated using the required regression metrics:

* Mean Absolute Error (MAE)
* Root Mean Squared Error (RMSE)
* R² Score

### Baseline Results

```text
MAE  = 0.0674
RMSE = 0.1341
R²   = 0.9585
```

### Metric Interpretation

#### MAE — Mean Absolute Error

```text
0.0674
```

Measures the average absolute difference between the actual and predicted values.

Lower values indicate smaller average prediction errors.

#### RMSE — Root Mean Squared Error

```text
0.1341
```

Measures prediction error while giving greater weight to larger errors.

Lower values indicate better prediction performance.

#### R² — R-squared

```text
0.9585
```

The baseline model explains approximately **95.85% of the variation** in the target variable on the test dataset.

A value closer to 1 indicates stronger predictive performance.

### Evaluation Workflow

```text
Trained Random Forest
        ↓
375 Unseen Test Samples
        ↓
Generate Predictions
        ↓
Compare Actual vs Predicted
        ↓
MAE
RMSE
R²
```

---

## Task 4 — Persist the Trained Machine Learning Model

Created:

```text
backend/app/services/machine_learning/model_persistence.py
```

Implemented:

```text
ModelPersistence
```

The model is persisted using:

```text
joblib
```

Created model directory:

```text
models/
```

Saved model:

```text
models/solar_pvout_baseline.joblib
```

### Model Persistence Workflow

```text
Train Random Forest
        ↓
joblib.dump()
        ↓
solar_pvout_baseline.joblib
        ↓
joblib.load()
        ↓
Reloaded RandomForestRegressor
```

The saved model was successfully loaded again.

Verification result:

```text
Model saved: models/solar_pvout_baseline.joblib
File exists: True
Loaded model: RandomForestRegressor
Trees: 100
```

### Post-Reload Prediction Verification

The persisted model was loaded from disk and used to generate predictions without retraining.

Sample predictions:

```text
5.0159
4.923866
5.0159
4.896422
5.0159
```

Prediction count:

```text
5
```

This confirms that the trained model can be persisted and later reused by the application.

---

# Task 5 — Automated Machine Learning Tests

Created:

```text
backend/tests/test_machine_learning.py
```

Four automated tests were implemented.

### Test 1 — Training Dataset Preparation

Verifies:

* Dataset loads successfully.
* 1,872 samples are available.
* Five input features are selected.
* Correct target variable is used.

```text
test_training_dataset_preparation
```

Result:

```text
PASSED
```

### Test 2 — Random Forest Training

Verifies:

* `RandomForestRegressor` is created.
* Training/test split is correct.
* 1,497 training samples are generated.
* 375 testing samples are generated.
* Model contains 100 trees.

```text
test_random_forest_training
```

Result:

```text
PASSED
```

### Test 3 — Model Persistence

Verifies:

* Model can be saved.
* Saved model file exists.
* Model can be loaded again.
* Reloaded model is a `RandomForestRegressor`.
* Model retains its 100-tree configuration.

```text
test_model_persistence
```

Result:

```text
PASSED
```

### Test 4 — Regression Evaluation

Verifies:

* MAE is calculated.
* RMSE is calculated.
* R² is calculated.
* Evaluation result contains the expected metric fields.

```text
test_regression_evaluation
```

Result:

```text
PASSED
```

### ML Test Result

```text
4 passed
```

---

# Python Packages and Dependencies Added

The Day 21 ML implementation required additional machine-learning and data-processing packages.

The main packages installed were:

```text
pandas
openpyxl
scikit-learn
joblib
```

Additional supporting dependencies installed as part of the ML environment included:

```text
numpy
scipy
python-dateutil
six
threadpoolctl
narwhals
et-xmlfile
```

### Installed Versions

```text
pandas          3.0.5
numpy           2.5.2
scipy           1.18.0
scikit-learn   1.9.0
joblib          1.5.3
openpyxl        3.1.5
python-dateutil 2.9.0.post0
six             1.17.0
threadpoolctl   3.6.0
narwhals        2.24.0
et-xmlfile      2.0.0
```

These dependencies were recorded in:

```text
requirements.txt
```

---

# Machine Learning Module Structure

The following new ML components were added:

```text
backend/app/services/machine_learning/
├── __init__.py
├── dataset_preparation.py
├── baseline_model.py
├── evaluation.py
└── model_persistence.py
```

### Module Responsibilities

```text
dataset_preparation.py
        ↓
Prepare X and y

baseline_model.py
        ↓
Train RandomForestRegressor

evaluation.py
        ↓
Calculate MAE, RMSE and R²

model_persistence.py
        ↓
Save and load trained models
```

---

# Complete Day 21 ML Workflow

The complete implementation now follows:

```text
Historical Renewable Energy Data
                ↓
Global Wind Atlas Dataset
                ↓
Dataset Preparation
                ↓
Feature Selection
                ↓
Target Selection
                ↓
Train/Test Split
                ↓
RandomForestRegressor
                ↓
Model Training
                ↓
Model Prediction
                ↓
MAE / RMSE / R²
                ↓
Model Persistence
                ↓
solar_pvout_baseline.joblib
                ↓
Model Reload
                ↓
Prediction Without Retraining
```

---

# Testing and Verification Commands

## Verify Python Environment

```bash
source .venv/bin/activate
```

Verify Python:

```bash
which python
```

Result:

```text
/workspaces/solar-wind-deployment-intelligence/.venv/bin/python
```

Verify ML environment:

```bash
python -c "import sklearn, pandas, joblib, openpyxl; print('ML environment: OK')"
```

Result:

```text
ML environment: OK
```

---

## Verify Dataset Preparation

```bash
PYTHONPATH=backend python -c "from app.services.machine_learning.dataset_preparation import RenewableTrainingDataset; X, y = RenewableTrainingDataset.prepare('datasets/raw/global_wind_atlas/global_data.xlsx'); print('Features:', X.shape); print('Target:', y.shape)"
```

Result:

```text
Features: (1872, 5)
Target: (1872,)
```

---

## Verify Random Forest Training

```bash
PYTHONPATH=backend python -c "from app.services.machine_learning.baseline_model import RenewableBaselineModel; model, X_train, X_test, y_train, y_test = RenewableBaselineModel.train('datasets/raw/global_wind_atlas/global_data.xlsx'); print('Model:', type(model).__name__); print('Training samples:', len(X_train)); print('Testing samples:', len(X_test)); print('Trees:', model.n_estimators)"
```

Result:

```text
Model: RandomForestRegressor
Training samples: 1497
Testing samples: 375
Trees: 100
```

---

## Verify Model Evaluation

```bash
PYTHONPATH=backend python -c "from app.services.machine_learning.baseline_model import RenewableBaselineModel; from app.services.machine_learning.evaluation import RegressionEvaluator; model, X_train, X_test, y_train, y_test = RenewableBaselineModel.train('datasets/raw/global_wind_atlas/global_data.xlsx'); predictions = model.predict(X_test); metrics = RegressionEvaluator.evaluate(y_test, predictions); print('MAE:', metrics['mae']); print('RMSE:', metrics['rmse']); print('R2:', metrics['r2'])"
```

Result:

```text
MAE: 0.0674
RMSE: 0.1341
R2: 0.9585
```

---

## Verify Model Persistence

```bash
PYTHONPATH=backend python -c "from app.services.machine_learning.baseline_model import RenewableBaselineModel; from app.services.machine_learning.model_persistence import ModelPersistence; dataset='datasets/raw/global_wind_atlas/global_data.xlsx'; model, X_train, X_test, y_train, y_test = RenewableBaselineModel.train(dataset); path='models/solar_pvout_baseline.joblib'; ModelPersistence.save(model, path); loaded_model=ModelPersistence.load(path); print('Model saved:', path); print('File exists:', __import__('pathlib').Path(path).exists()); print('Loaded model:', type(loaded_model).__name__); print('Trees:', loaded_model.n_estimators)"
```

Result:

```text
Model saved: models/solar_pvout_baseline.joblib
File exists: True
Loaded model: RandomForestRegressor
Trees: 100
```

---

## Verify Prediction After Model Reload

```bash
PYTHONPATH=backend python -c "from app.services.machine_learning.dataset_preparation import RenewableTrainingDataset; from app.services.machine_learning.model_persistence import ModelPersistence; X, y = RenewableTrainingDataset.prepare('datasets/raw/global_wind_atlas/global_data.xlsx'); model = ModelPersistence.load('models/solar_pvout_baseline.joblib'); predictions = model.predict(X.iloc[:5]); print('Predictions:', predictions.tolist()); print('Prediction count:', len(predictions))"
```

Result:

```text
Predictions:
[5.0159, 4.923866, 5.0159, 4.896422, 5.0159]

Prediction count: 5
```

---

# Machine Learning Test Suite

Command:

```bash
PYTHONPATH=backend pytest backend/tests/test_machine_learning.py -v
```

Result:

```text
4 passed
```

All four ML tests passed successfully.

---

# Full Project Test Suite

After implementing the Day 21 ML components, the complete project test suite was executed to ensure that existing functionality remained stable.

Command:

```bash
PYTHONPATH=backend pytest backend/tests -v
```

### Final Result

```text
57 passed, 300 warnings in 6.30s
```

All existing and newly added tests passed successfully.

### Test Coverage Areas

The 57 passing tests cover:

```text
Analysis Pipeline
Category Scoring
Coordinate Validation
Deployment Recommendation
Energy Estimation
Machine Learning
Normalization
Optimization Engine
Ranking Engine
Raster Processing
Scoring Engine
Spatial Analysis
Vector Processing
```

The Day 21 ML tests were included in the complete test suite.

---

# Warning During Testing

The test suite reported:

```text
300 warnings
```

The warnings are `DeprecationWarning` messages originating from the current `joblib` and NumPy interaction:

```text
joblib/numpy_pickle.py
```

The warnings did not cause test failures.

Final test status remained:

```text
57 passed
```

Therefore, the Day 21 implementation and existing project functionality remain successfully validated.

---

# Files Added or Updated

### New ML service files

```text
backend/app/services/machine_learning/__init__.py
backend/app/services/machine_learning/dataset_preparation.py
backend/app/services/machine_learning/baseline_model.py
backend/app/services/machine_learning/evaluation.py
backend/app/services/machine_learning/model_persistence.py
```

### New test file

```text
backend/tests/test_machine_learning.py
```

### New trained model

```text
models/solar_pvout_baseline.joblib
```

### Updated dependency file

```text
requirements.txt
```

### Documentation

```text
docs/weekly_notes/Day-21.md
```

---

# Day 21 Architecture Addition

The ML layer has now been added to the existing project architecture:

```text
Solar & Wind Deployment Intelligence Platform
                    │
                    ├── Data Sources
                    │
                    ├── Feature Engineering
                    │
                    ├── Scoring Engine
                    │
                    ├── Energy Estimation
                    │
                    ├── Optimization
                    │
                    ├── Forecasting
                    │
                    └── Machine Learning
                           │
                           ├── Dataset Preparation
                           ├── Random Forest Baseline
                           ├── Model Evaluation
                           └── Model Persistence
```

The saved model can be loaded by the backend in future sessions instead of retraining every time the application starts.

---

# Day 21 Final Status

All assigned Day 21 Machine Learning baseline tasks have been successfully implemented and tested.

### Final Checklist

```text
☑ Historical renewable-energy dataset selected
☑ Training dataset prepared
☑ Features selected
☑ Target selected
☑ Random Forest regression implemented
☑ Train/test split implemented
☑ Model trained successfully
☑ MAE calculated
☑ RMSE calculated
☑ R² calculated
☑ Model saved using joblib
☑ Saved model successfully reloaded
☑ Reloaded model successfully generated predictions
☑ ML automated tests implemented
☑ 4 ML tests passed
☑ Existing project modules verified
☑ Full test suite passed
☑ 57 total tests passed
☑ ML dependencies added to requirements.txt
☑ Day 21 documentation prepared
```

## Day 21 Outcome

The Solar & Wind Deployment Intelligence Platform now contains its first supervised Machine Learning baseline.

The implemented Random Forest regression model predicts `Solar_PVOUT_Potential` from selected renewable-energy and contextual features and achieved:

```text
MAE  = 0.0674
RMSE = 0.1341
R²   = 0.9585
```

The trained model has also been persisted as:

```text
models/solar_pvout_baseline.joblib
```

and successfully reloaded for prediction.

The complete project test suite finished with:

```text
57 passed
```

This provides a stable Machine Learning foundation for the upcoming forecasting, investment, model-serving, and FastAPI integration work.
