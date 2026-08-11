"""Reusable loader for historical renewable energy time-series data."""

from pathlib import Path

import pandas as pd


class TimeSeriesDataLoader:
    """
    Load and prepare historical renewable energy data for forecasting.
    """

    @staticmethod
    def load_csv(file_path: str) -> pd.DataFrame:
        """
        Load a CSV dataset and return it in chronological order.

        The CSV must contain a 'date' column.
        """

        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"Dataset not found: {file_path}")

        data = pd.read_csv(path)

        if "date" not in data.columns:
            raise ValueError("Dataset must contain a 'date' column.")

        data["date"] = pd.to_datetime(data["date"])

        data = data.sort_values("date").reset_index(drop=True)

        return data
