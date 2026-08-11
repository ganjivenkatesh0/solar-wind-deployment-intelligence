from pathlib import Path
from typing import Any

from app.services.machine_learning.dataset_preparation import RenewableTrainingDataset
from app.services.machine_learning.model_persistence import ModelPersistence


class ModelExplainability:
    """Explainability utilities for trained renewable energy models."""

    def __init__(self, model_path: str | Path | None = None) -> None:
        self.model_path = Path(model_path or Path("models/best_solar_pvout_model.joblib"))

        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Trained model not found: {self.model_path}"
            )

        self.model = ModelPersistence.load(str(self.model_path))

    def feature_importances(self) -> list[dict[str, float]]:
        """Return feature importances for the trained model in descending order."""

        importances = getattr(self.model, "feature_importances_", None)

        if importances is None:
            raise AttributeError(
                "The loaded model does not expose feature_importances_."
            )

        if len(importances) != len(RenewableTrainingDataset.FEATURES):
            raise ValueError(
                "The number of feature importances does not match the model features."
            )

        features = list(RenewableTrainingDataset.FEATURES)
        paired = [
            {"feature": feature, "importance": float(round(value, 6))}
            for feature, value in zip(features, importances)
        ]

        return sorted(
            paired,
            key=lambda entry: entry["importance"],
            reverse=True,
        )

    def explanation(self, top_n: int = 3) -> dict[str, Any]:
        """Return a concise explanation payload for the model's feature ranking."""

        sorted_importances = self.feature_importances()
        top_features = sorted_importances[:top_n]

        if top_features:
            top_names = ", ".join(
                feature["feature"] for feature in top_features
            )
            summary = (
                f"The RandomForestRegressor predicts Solar PVOUT potential by "
                f"prioritizing {top_names}, with the remaining features contributing "
                "in descending importance."
            )
        else:
            summary = (
                "The model did not expose feature importance values for explanation."
            )

        return {
            "top_features": top_features,
            "summary": summary,
        }
