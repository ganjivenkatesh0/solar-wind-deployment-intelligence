"""Reusable machine learning inference service."""

from pathlib import Path
from typing import Any

import pandas as pd

from app.services.machine_learning.explainability import ModelExplainability
from app.services.machine_learning.model_persistence import ModelPersistence


class RenewableModelInference:
    """Load the trained renewable-energy model once and perform predictions."""

    _FILE_PATH = Path(__file__).resolve()
    _PROJECT_ROOT = next(
        (
            parent
            for parent in _FILE_PATH.parents
            if (parent / "models" / "best_solar_pvout_model.joblib").exists()
        ),
        _FILE_PATH.parents[3],
    )
    MODEL_PATH = (
        _PROJECT_ROOT
        / "models"
        / "best_solar_pvout_model.joblib"
    )

    FEATURE_COLUMNS = [
        "Year",
        "renewables_share_elec",
        "Governance_Score",
        "Offshore_Wind_Potential_GW",
        "Hydro_Surface_Water_10^9_m3",
    ]

    def __init__(self, model_path: str | Path | None = None) -> None:
        """Initialize the inference service and load the model once."""

        self.model_path = Path(model_path or self.MODEL_PATH)

        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Trained model not found: {self.model_path}"
            )

        self.model = ModelPersistence.load(str(self.model_path))
        self.explainability = ModelExplainability(self.model_path)

    def validate_features(self, features: dict[str, Any]) -> pd.DataFrame:
        """
        Validate feature completeness and order.

        Returns:
            A one-row DataFrame with the exact feature order expected by the model.
        """

        missing = [
            column
            for column in self.FEATURE_COLUMNS
            if column not in features
        ]

        if missing:
            raise ValueError(
                f"Missing required features: {missing}"
            )

        ordered_features = {
            column: features[column]
            for column in self.FEATURE_COLUMNS
        }

        return pd.DataFrame([ordered_features], columns=self.FEATURE_COLUMNS)

    def predict(self, features: dict[str, Any]) -> float:
        """Validate features and return the model prediction."""

        input_data = self.validate_features(features)

        prediction = self.model.predict(input_data)

        return {
            "solar_pvout_potential": float(prediction[0]),
            "explanation": self.explainability.explanation(),
        }