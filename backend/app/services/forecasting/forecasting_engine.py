"""Renewable energy forecasting engine."""


class ForecastingEngine:
    """
    Basic forecasting engine for renewable energy resources.

    Supports solar, wind, and hybrid forecasting workflows.
    """

    @staticmethod
    def forecast_solar(values: list[float]) -> float:
        """Return the average historical solar value as a baseline forecast."""
        if not values:
            raise ValueError("Solar values cannot be empty.")

        return round(sum(values) / len(values), 2)

    @staticmethod
    def forecast_wind(values: list[float]) -> float:
        """Return the average historical wind value as a baseline forecast."""
        if not values:
            raise ValueError("Wind values cannot be empty.")

        return round(sum(values) / len(values), 2)

    @staticmethod
    def forecast_hybrid(
        solar_values: list[float],
        wind_values: list[float],
    ) -> dict[str, float]:
        """Return baseline forecasts for both solar and wind."""
        return {
            "solar_forecast": ForecastingEngine.forecast_solar(solar_values),
            "wind_forecast": ForecastingEngine.forecast_wind(wind_values),
        }
