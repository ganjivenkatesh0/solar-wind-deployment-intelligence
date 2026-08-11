"""Model comparison and dataset splitting utilities."""

from pathlib import Path
from typing import Tuple
import time

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from app.services.machine_learning.dataset_preparation import RenewableTrainingDataset
from app.services.machine_learning.evaluation import RegressionEvaluator
from app.services.machine_learning.model_persistence import ModelPersistence


class ModelComparison:
    """Utilities for preparing data for model comparison."""

    TRAIN_SIZE = 0.70
    VALIDATION_SIZE = 0.15
    TEST_SIZE = 0.15
    RANDOM_STATE = 42
    PRODUCTION_MODEL_PATH = Path("models/best_solar_pvout_model.joblib")

    @classmethod
    def split_dataset(
        cls,
        X: pd.DataFrame,
        y: pd.Series,
    ) -> Tuple[
        pd.DataFrame,
        pd.DataFrame,
        pd.DataFrame,
        pd.Series,
        pd.Series,
        pd.Series,
    ]:
        """
        Split the dataset into training, validation, and testing sets.

        Returns:
            X_train, X_validation, X_test,
            y_train, y_validation, y_test
        """

        if len(X) != len(y):
            raise ValueError("Features and target must have the same number of rows.")

        if len(X) < 3:
            raise ValueError("Dataset must contain at least three samples.")

        # First split: 70% training, 30% temporary data.
        X_train, X_temp, y_train, y_temp = train_test_split(
            X,
            y,
            test_size=0.30,
            random_state=cls.RANDOM_STATE,
        )

        # Split the remaining 30% equally:
        # 15% validation and 15% testing.
        X_validation, X_test, y_validation, y_test = train_test_split(
            X_temp,
            y_temp,
            test_size=0.50,
            random_state=cls.RANDOM_STATE,
        )

        return (
            X_train,
            X_validation,
            X_test,
            y_train,
            y_validation,
            y_test,
        )
    @classmethod
    def train_models(
        cls,
        X_train: pd.DataFrame,
        y_train: pd.Series,
    ) -> dict:
        """
        Train Decision Tree and Random Forest regression models.
        """

        decision_tree = DecisionTreeRegressor(
            random_state=cls.RANDOM_STATE,
        )

        random_forest = RandomForestRegressor(
            n_estimators=100,
            random_state=cls.RANDOM_STATE,
        )

        dt_start = time.time()
        decision_tree.fit(X_train, y_train)
        dt_time = time.time() - dt_start

        rf_start = time.time()
        random_forest.fit(X_train, y_train)
        rf_time = time.time() - rf_start

        return {
            "decision_tree": {
                "model": decision_tree,
                "training_time": dt_time,
            },
            "random_forest": {
                "model": random_forest,
                "training_time": rf_time,
            },
        }

    @classmethod
    def evaluate_models(
        cls,
        models: dict,
        X_train: pd.DataFrame,
        y_train: pd.Series,
        X_validation: pd.DataFrame,
        y_validation: pd.Series,
    ) -> dict:
        """Evaluate multiple models and return metrics for each."""

        results = {}

        for name, model_info in models.items():
            model = model_info["model"]
            evaluation = cls.evaluate_model(
                model,
                X_train,
                y_train,
                X_validation,
                y_validation,
            )
            results[name] = {
                **evaluation,
                "training_time": round(model_info["training_time"], 4),
                "model_type": type(model).__name__,
            }

        return results

    @classmethod
    def compare_candidate_models(
        cls,
        file_path: str,
    ) -> dict:
        """Train candidate models, evaluate them, select the best, and serialize it."""

        X, y = RenewableTrainingDataset.prepare(file_path)
        X_train, X_validation, X_test, y_train, y_validation, y_test = (
            cls.split_dataset(X, y)
        )

        models = cls.train_models(X_train, y_train)
        results = cls.evaluate_models(
            models,
            X_train,
            y_train,
            X_validation,
            y_validation,
        )

        best_name, best_model_info = cls.select_best_model(models, results)
        best_model = best_model_info["model"]
        test_metrics = cls.evaluate_model_on_test(best_model, X_test, y_test)

        cls.serialize_best_model(best_model, cls.PRODUCTION_MODEL_PATH)

        return {
            "models": results,
            "best_model": {
                "name": best_name,
                "model_type": type(best_model).__name__,
                "training_time": round(best_model_info["training_time"], 4),
            },
            "test_set": {
                "X_test_length": len(X_test),
                "y_test_length": len(y_test),
                "metrics": test_metrics,
            },
        }

    @staticmethod
    def evaluate_model_on_test(
        model,
        X_test: pd.DataFrame,
        y_test: pd.Series,
    ) -> dict[str, float]:
        """Evaluate the selected model on the held-out test set."""

        predictions = model.predict(X_test)

        return {
            "test_mae": round(mean_absolute_error(y_test, predictions), 4),
            "test_rmse": round(mean_squared_error(y_test, predictions) ** 0.5, 4),
            "test_r2": round(r2_score(y_test, predictions), 4),
        }

    @staticmethod
    def select_best_model(
        models: dict,
        validation_results: dict,
    ):
        """
        Select the best model using validation performance and simplicity.

        Higher validation R² is preferred, with RMSE and MAE as secondary criteria.
        """

        def sort_key(name: str):
            result = validation_results[name]
            return (
                result["validation_r2"],
                -result["validation_rmse"],
                -result["validation_mae"],
                -models[name]["training_time"],
            )

        best_name = max(validation_results, key=sort_key)

        return best_name, models[best_name]

    @staticmethod
    def serialize_best_model(
        model,
        file_path: str | Path,
    ) -> None:
        """Serialize the selected model to disk using existing persistence."""

        ModelPersistence.save(model, str(file_path))

    @staticmethod
    def evaluate_model(
        model,
        X_train: pd.DataFrame,
        y_train: pd.Series,
        X_validation: pd.DataFrame,
        y_validation: pd.Series,
    ) -> dict[str, float]:
        """Evaluate a model on training and validation datasets."""

        train_predictions = model.predict(X_train)
        validation_predictions = model.predict(X_validation)

        return {
            "train_mae": round(
                mean_absolute_error(y_train, train_predictions),
                4,
            ),
            "validation_mae": round(
                mean_absolute_error(y_validation, validation_predictions),
                4,
            ),
            "train_rmse": round(
                mean_squared_error(
                    y_train,
                    train_predictions,
                ) ** 0.5,
                4,
            ),
            "validation_rmse": round(
                mean_squared_error(
                    y_validation,
                    validation_predictions,
                ) ** 0.5,
                4,
            ),
            "train_r2": round(
                r2_score(y_train, train_predictions),
                4,
            ),
            "validation_r2": round(
                r2_score(y_validation, validation_predictions),
                4,
            ),
        }