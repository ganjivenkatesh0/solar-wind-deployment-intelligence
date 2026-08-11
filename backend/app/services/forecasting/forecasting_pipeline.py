"""Forecasting input pipeline."""

import pandas as pd

from app.services.forecasting.data_loader import TimeSeriesDataLoader
from app.services.forecasting.time_features import TimeFeatureExtractor
from app.services.forecasting.forecasting_engine import ForecastingEngine


class ForecastingPipeline:
    """
    Prepare historical renewable energy data and
    generate baseline forecasts.
    """

    @staticmethod
    def prepare_data(file_path: str) -> pd.DataFrame:
        """Load historical data and add time-based features."""

        data = TimeSeriesDataLoader.load_csv(file_path)

        return TimeFeatureExtractor.extract(data)

    @staticmethod
    def forecast(file_path: str) -> dict[str, float]:
        """
        Prepare historical data and generate
        solar, wind, and hybrid forecasts.
        """

        data = ForecastingPipeline.prepare_data(file_path)

        if "solar_irradiance" not in data.columns:
            raise ValueError(
                "Dataset must contain 'solar_irradiance' column."
            )

        if "wind_speed" not in data.columns:
            raise ValueError(
                "Dataset must contain 'wind_speed' column."
            )

        solar_values = data["solar_irradiance"].astype(float).tolist()
        wind_values = data["wind_speed"].astype(float).tolist()

        return ForecastingEngine.forecast_hybrid(
            solar_values=solar_values,
            wind_values=wind_values,
        )
