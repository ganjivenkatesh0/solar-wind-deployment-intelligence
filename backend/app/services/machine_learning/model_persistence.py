"""Utilities for saving and loading trained ML models."""

from pathlib import Path
from typing import Any

import joblib


class ModelPersistence:
    """Save and load trained machine learning models."""

    @staticmethod
    def save(model: Any, file_path: str) -> None:
        """Save a trained model to disk."""

        path = Path(file_path)
        path.parent.mkdir(parents=True, exist_ok=True)

        joblib.dump(model, path)

    @staticmethod
    def load(file_path: str) -> Any:
        """Load a trained model from disk."""

        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(
                f"Saved model not found: {file_path}"
            )

        return joblib.load(path)