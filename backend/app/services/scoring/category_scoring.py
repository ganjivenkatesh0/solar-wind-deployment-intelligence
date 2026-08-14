"""Category-based scoring utilities for renewable energy site assessment."""

from app.services.scoring.normalization import (
    normalize_grid_distance,
    normalize_humidity,
    normalize_road_distance,
    normalize_slope,
    normalize_solar,
    normalize_temperature,
    normalize_wind,
)


def renewable_resource_score(solar_irradiance: float, wind_speed: float) -> float:
    """Calculate the Renewable Resource Score from solar and wind inputs."""
    solar_score = normalize_solar(solar_irradiance)
    wind_score = normalize_wind(wind_speed)

    return round((solar_score + wind_score) / 2, 2)


def terrain_score(slope: float) -> float:
    """Calculate the Terrain Score from slope data."""
    return normalize_slope(slope)


def infrastructure_score(grid_distance: float, road_distance: float) -> float:
    """Calculate the Infrastructure Score from grid and road proximity."""
    grid_score = normalize_grid_distance(grid_distance)
    road_score = normalize_road_distance(road_distance)

    return round((grid_score + road_score) / 2, 2)


def environmental_score(
    solar_irradiance: float,
    temperature: float,
    relative_humidity: float,
) -> float:
    """
    Calculate environmental suitability from location-specific
    NASA POWER environmental features.

    Weighting:
    - Solar irradiance: 50%
    - Temperature: 25%
    - Relative humidity: 25%

    Returns:
        Environmental suitability score between 0 and 100.
    """
    solar_score = normalize_solar(solar_irradiance)
    temperature_score = normalize_temperature(temperature)
    humidity_score = normalize_humidity(relative_humidity)

    score = (
        solar_score * 0.50
        + temperature_score * 0.25
        + humidity_score * 0.25
    )

    return round(score, 2)


def economic_score(score: float) -> float:
    """Return a bounded economic feasibility score."""
    return max(0.0, min(score, 100.0))
