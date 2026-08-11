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