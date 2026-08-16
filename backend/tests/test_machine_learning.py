"""Tests for the renewable energy machine learning baseline."""

from pathlib import Path

from app.services.machine_learning.baseline_model import (
    RenewableBaselineModel,
)
from app.services.machine_learning.dataset_preparation import (
    RenewableTrainingDataset,
)
from app.services.machine_learning.model_persistence import (
    ModelPersistence,
)
from app.services.machine_learning.explainability import (
    ModelExplainability,
)

from app.services.machine_learning.evaluation import (
    RegressionEvaluator,
)



DATASET_PATH = (
    "datasets/raw/global_wind_atlas/global_data.xlsx"
)


def test_training_dataset_preparation():
    """Verify the training dataset is prepared correctly."""

    X, y = RenewableTrainingDataset.prepare(DATASET_PATH)

    assert len(X) == 1872
    assert len(y) == 1872
    assert len(X.columns) == 5
    assert RenewableTrainingDataset.TARGET == "Solar_PVOUT_Potential"


def test_random_forest_training():
    """Verify the Random Forest baseline trains successfully."""

    model, X_train, X_test, y_train, y_test = (
        RenewableBaselineModel.train(DATASET_PATH)
    )

    assert type(model).__name__ == "RandomForestRegressor"
    assert len(X_train) == 1497
    assert len(X_test) == 375
    assert len(y_train) == 1497
    assert len(y_test) == 375
    assert model.n_estimators == 100


def test_model_persistence(tmp_path):
    """Verify a trained model can be saved and loaded."""

    model, _, _, _, _ = RenewableBaselineModel.train(
        DATASET_PATH
    )

    model_path = Path(tmp_path) / "test_model.joblib"

    ModelPersistence.save(model, str(model_path))

    assert model_path.exists()

    loaded_model = ModelPersistence.load(
        str(model_path)
    )

    assert type(loaded_model).__name__ == "RandomForestRegressor"
    assert loaded_model.n_estimators == 100


def test_regression_evaluation():
    """Verify regression metrics are calculated correctly."""

    model, _, X_test, _, y_test = (
        RenewableBaselineModel.train(DATASET_PATH)
    )

    predictions = model.predict(X_test)

    metrics = RegressionEvaluator.evaluate(
        y_test,
        predictions,
    )

    assert set(metrics.keys()) == {"mae", "rmse", "r2"}
    assert metrics["mae"] >= 0
    assert metrics["rmse"] >= 0
    assert metrics["r2"] <= 1




'''DAY 22 TEST FOR MACHINE LEARNING MODEL COMPARISON'''

def test_three_way_dataset_split():
    from app.services.machine_learning.dataset_preparation import (
        RenewableTrainingDataset,
    )
    from app.services.machine_learning.model_comparison import ModelComparison

    X, y = RenewableTrainingDataset.prepare(
        "datasets/raw/global_wind_atlas/global_data.xlsx"
    )

    X_train, X_validation, X_test, y_train, y_validation, y_test = (
        ModelComparison.split_dataset(X, y)
    )

    assert len(X_train) == 1310
    assert len(X_validation) == 281
    assert len(X_test) == 281

    assert len(y_train) == 1310
    assert len(y_validation) == 281
    assert len(y_test) == 281

    assert len(X_train) + len(X_validation) + len(X_test) == 1872


def test_two_baseline_models_are_trained():
    from app.services.machine_learning.dataset_preparation import (
        RenewableTrainingDataset,
    )
    from app.services.machine_learning.model_comparison import ModelComparison

    X, y = RenewableTrainingDataset.prepare(
        "datasets/raw/global_wind_atlas/global_data.xlsx"
    )

    X_train, _, _, y_train, _, _ = ModelComparison.split_dataset(X, y)

    models = ModelComparison.train_models(X_train, y_train)

    assert "decision_tree" in models
    assert "random_forest" in models

    assert type(models["decision_tree"]["model"]).__name__ == "DecisionTreeRegressor"
    assert type(models["random_forest"]["model"]).__name__ == "RandomForestRegressor"


def test_random_forest_is_selected_as_best_model():
    from app.services.machine_learning.dataset_preparation import (
        RenewableTrainingDataset,
    )
    from app.services.machine_learning.model_comparison import ModelComparison

    X, y = RenewableTrainingDataset.prepare(
        "datasets/raw/global_wind_atlas/global_data.xlsx"
    )

    X_train, X_validation, _, y_train, y_validation, _ = (
        ModelComparison.split_dataset(X, y)
    )

    models = ModelComparison.train_models(X_train, y_train)

    results = {
        name: ModelComparison.evaluate_model(
            model_info["model"],
            X_train,
            y_train,
            X_validation,
            y_validation,
        )
        for name, model_info in models.items()
    }

    best_name, best_model_info = ModelComparison.select_best_model(
        models,
        results,
    )

    assert best_name == "random_forest"
    assert type(best_model_info["model"]).__name__ == "RandomForestRegressor"
    assert results[best_name]["validation_r2"] == 0.9385


def test_best_model_persistence():
    from pathlib import Path

    from app.services.machine_learning.model_persistence import (
        ModelPersistence,
    )

    model_path = (
        Path(__file__).resolve().parents[2]
        / "models"
        / "best_solar_pvout_model.joblib"
    )

    assert model_path.exists()

    model = ModelPersistence.load(str(model_path))

    assert type(model).__name__ == "RandomForestRegressor"
    assert model.n_estimators == 100


def test_compare_candidate_models_returns_metrics_and_serializes_best_model():
    from app.services.machine_learning.model_comparison import ModelComparison
    from app.services.machine_learning.model_persistence import ModelPersistence

    result = ModelComparison.compare_candidate_models(
        DATASET_PATH,
    )

    assert "decision_tree" in result["models"]
    assert "random_forest" in result["models"]

    for metrics in result["models"].values():
        assert isinstance(metrics["validation_mae"], float)
        assert isinstance(metrics["validation_rmse"], float)
        assert isinstance(metrics["validation_r2"], float)
        assert isinstance(metrics["training_time"], float)

    assert result["best_model"]["name"] in result["models"]

    model_path = (
        Path(__file__).resolve().parents[2]
        / "models"
        / "best_solar_pvout_model.joblib"
    )
    assert model_path.exists()

    loaded_model = ModelPersistence.load(str(model_path))
    assert type(loaded_model).__name__ in {
        "DecisionTreeRegressor",
        "RandomForestRegressor",
    }

    prediction = loaded_model.predict(
        [[2026, 25.0, 70.0, 10.0, 50.0]]
    )
    assert len(prediction) == 1
    assert isinstance(float(prediction[0]), float)


def test_model_explainability_feature_importances():
    from pathlib import Path

    explainability = ModelExplainability()
    importances = explainability.feature_importances()

    assert isinstance(importances, list)
    assert len(importances) == len(RenewableTrainingDataset.FEATURES)

    previous_importance = 1.0
    total_importance = 0.0
    seen_features = set()

    for entry in importances:
        assert isinstance(entry["feature"], str)
        assert isinstance(entry["importance"], float)
        assert 0.0 <= entry["importance"] <= 1.0
        assert entry["feature"] not in seen_features
        seen_features.add(entry["feature"])

        total_importance += entry["importance"]
        assert entry["importance"] <= previous_importance
        previous_importance = entry["importance"]

    assert len(seen_features) == len(RenewableTrainingDataset.FEATURES)
    assert abs(total_importance - 1.0) < 1e-6



def test_model_inference_prediction():
    """Verify the trained model can generate a prediction."""

    from app.services.machine_learning.inference import RenewableModelInference

    inference = RenewableModelInference()

    features = {
        "Year": 2020,
        "renewables_share_elec": 25.0,
        "Governance_Score": 70.0,
        "Offshore_Wind_Potential_GW": 10.0,
        "Hydro_Surface_Water_10^9_m3": 50.0,
    }

    prediction = inference.predict(features)

    assert isinstance(prediction, dict)
    assert "solar_pvout_potential" in prediction
    assert isinstance(prediction["solar_pvout_potential"], float)
    assert "explanation" in prediction
    assert isinstance(prediction["explanation"], dict)


def test_model_inference_feature_validation():
    """Verify incomplete feature sets are rejected."""

    import pytest

    from app.services.machine_learning.inference import RenewableModelInference

    inference = RenewableModelInference()

    incomplete_features = {
        "Year": 2020,
        "renewables_share_elec": 25.0,
    }

    with pytest.raises(ValueError, match="Missing required features"):
        inference.predict(incomplete_features)


def test_model_inference_feature_order():
    """Verify predictions are independent of dictionary insertion order."""

    from app.services.machine_learning.inference import RenewableModelInference

    inference = RenewableModelInference()

    features = {
        "Hydro_Surface_Water_10^9_m3": 50.0,
        "Governance_Score": 70.0,
        "Year": 2020,
        "Offshore_Wind_Potential_GW": 10.0,
        "renewables_share_elec": 25.0,
    }

    prediction = inference.predict(features)

    assert isinstance(prediction, dict)
    assert "solar_pvout_potential" in prediction
    assert "explanation" in prediction
    assert isinstance(prediction["solar_pvout_potential"], float)
    assert isinstance(prediction["explanation"], dict)