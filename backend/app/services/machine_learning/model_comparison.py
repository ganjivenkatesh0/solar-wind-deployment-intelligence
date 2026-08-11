"""Model comparison and dataset splitting utilities."""

from typing import Tuple

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


class ModelComparison:
    """Utilities for preparing data for model comparison."""

    TRAIN_SIZE = 0.70
    VALIDATION_SIZE = 0.15
    TEST_SIZE = 0.15
    RANDOM_STATE = 42

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

        decision_tree.fit(X_train, y_train)
        random_forest.fit(X_train, y_train)

        return {
            "decision_tree": decision_tree,
            "random_forest": random_forest,
        }



    @staticmethod
    def select_best_model(
        models: dict,
        validation_results: dict,
    ):
        """
        Select the best model using validation R².

        Higher R² indicates better validation performance.
        """

        best_name = max(
            validation_results,
            key=lambda name: validation_results[name]["validation_r2"],
        )

        return best_name, models[best_name]


    
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