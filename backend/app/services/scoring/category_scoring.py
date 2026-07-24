"""Category-based scoring utilities for renewable energy site assessment."""

from app.services.scoring.normalization import (
    normalize_grid_distance,
    normalize_road_distance,
    normalize_slope,
    normalize_solar,
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


def environmental_score(score: float) -> float:
    """Return a bounded environmental suitability score."""
    return max(0.0, min(score, 100.0))


def economic_score(score: float) -> float:
    """Return a bounded economic feasibility score."""
    return max(0.0, min(score, 100.0))
