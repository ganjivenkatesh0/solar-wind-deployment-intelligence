"""Time-based feature extraction for renewable energy forecasting."""

import pandas as pd


class TimeFeatureExtractor:
    """Generate useful temporal features from a date column."""

    @staticmethod
    def extract(data: pd.DataFrame) -> pd.DataFrame:
        """
        Add time-based features to a historical time-series dataset.

        Required column:
            date
        """

        if "date" not in data.columns:
            raise ValueError("Dataset must contain a 'date' column.")

        result = data.copy()

        result["date"] = pd.to_datetime(result["date"])

        result["year"] = result["date"].dt.year
        result["month"] = result["date"].dt.month
        result["day"] = result["date"].dt.day
        result["day_of_year"] = result["date"].dt.dayofyear
        result["week_number"] = result["date"].dt.isocalendar().week.astype(int)

        return result
