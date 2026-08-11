"""Random Forest baseline model for renewable energy prediction."""

from pathlib import Path

import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

from app.services.machine_learning.dataset_preparation import (
    RenewableTrainingDataset,
)


class RenewableBaselineModel:
    """Train a Random Forest regression baseline."""

    RANDOM_STATE = 42
    TEST_SIZE = 0.2

    @classmethod
    def train(
        cls,
        file_path: str,
    ) -> tuple[
        RandomForestRegressor,
        pd.DataFrame,
        pd.DataFrame,
        pd.Series,
        pd.Series,
    ]:
        """Prepare data, split it, and train the baseline model."""

        if not Path(file_path).exists():
            raise FileNotFoundError(
                f"Training dataset not found: {file_path}"
            )

        X, y = RenewableTrainingDataset.prepare(file_path)

        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=cls.TEST_SIZE,
            random_state=cls.RANDOM_STATE,
        )

        model = RandomForestRegressor(
            n_estimators=100,
            random_state=cls.RANDOM_STATE,
            n_jobs=-1,
        )

        model.fit(X_train, y_train)

        return model, X_train, X_test, y_train, y_test