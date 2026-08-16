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


def project_resource_score(
    solar_irradiance: float,
    wind_speed: float,
    project_type: str,
) -> float:
    """
    Calculate the renewable resource score according to the
    requested project type.

    Solar:
        Uses solar resource only.

    Wind:
        Uses wind resource only.

    Hybrid:
        Uses the combined solar + wind resource score.
    """

    normalized_type = project_type.strip().lower()

    solar_score = normalize_solar(solar_irradiance)
    wind_score = normalize_wind(wind_speed)

    if normalized_type == "solar":
        return round(solar_score, 2)

    if normalized_type == "wind":
        return round(wind_score, 2)

    if normalized_type == "hybrid":
        return round((solar_score + wind_score) / 2, 2)

    raise ValueError(
        "project_type must be one of: solar, wind, hybrid"
    )


def terrain_score(slope: float) -> float:
    """Calculate the Terrain Score from slope data."""
    return normalize_slope(slope)


def infrastructure_score(
    grid_distance: float | None,
    road_distance: float,
) -> float:
    """Calculate infrastructure score from available grid and road data."""

    scores = []

    if grid_distance is not None:
        scores.append(normalize_grid_distance(grid_distance))

    if road_distance is not None:
        scores.append(normalize_road_distance(road_distance))

    return round(sum(scores) / len(scores), 2)


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


def economic_score(
    payback_period: float,
    roi: float,
) -> float:
    """Calculate economic feasibility from payback period and ROI.

    Lower payback periods and higher ROI indicate stronger economic
    feasibility.
    """
    payback_score = max(
        0.0,
        min((10.0 - payback_period) / 10.0 * 100.0, 100.0),
    )

    roi_score = max(
        0.0,
        min(roi / 200.0 * 100.0, 100.0),
    )

    return round((payback_score + roi_score) / 2, 2)
