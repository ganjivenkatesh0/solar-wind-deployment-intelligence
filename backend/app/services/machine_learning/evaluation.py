"""Evaluation utilities for renewable energy regression models."""

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


class RegressionEvaluator:
    """Evaluate regression model predictions."""

    @staticmethod
    def evaluate(
        actual: pd.Series,
        predicted: np.ndarray,
    ) -> dict[str, float]:
        """Calculate MAE, RMSE, and R² metrics."""

        mae = mean_absolute_error(actual, predicted)
        rmse = np.sqrt(mean_squared_error(actual, predicted))
        r2 = r2_score(actual, predicted)

        return {
            "mae": round(float(mae), 4),
            "rmse": round(float(rmse), 4),
            "r2": round(float(r2), 4),
        }