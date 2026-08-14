"""
Normalization utilities for renewable energy site scoring.

All functions return a score between 0 and 100.
"""

from typing import Union

Number = Union[int, float]


def normalize(
    value: Number,
    min_value: Number,
    max_value: Number,
    reverse: bool = False,
) -> float:
    """
    Normalize a value to a score between 0 and 100.

    Parameters
    ----------
    value : float
        Actual value.

    min_value : float
        Minimum expected value.

    max_value : float
        Maximum expected value.

    reverse : bool
        True if lower values are better.

    Returns
    -------
    float
        Score between 0 and 100.
    """

    if max_value <= min_value:
        raise ValueError("max_value must be greater than min_value")

    value = max(min(value, max_value), min_value)

    score = ((value - min_value) / (max_value - min_value)) * 100

    if reverse:
        score = 100 - score

    return round(score, 2)


def normalize_solar(irradiance: Number) -> float:
    """
    Normalize solar irradiance.

    Expected range:
    3–8 kWh/m²/day.
    """
    return normalize(irradiance, min_value=3.0, max_value=8.0)


def normalize_wind(speed: Number) -> float:
    """
    Normalize wind speed.

    Expected range:
    2–12 m/s.
    """
    return normalize(speed, min_value=2.0, max_value=12.0)


def normalize_slope(slope: Number) -> float:
    """Normalize slope where lower values are better."""
    return normalize(slope, min_value=0, max_value=30, reverse=True)


def normalize_grid_distance(distance: Number) -> float:
    """Normalize distance to the electrical grid where lower values are better."""
    return normalize(distance, min_value=0, max_value=50, reverse=True)


def normalize_road_distance(distance: Number) -> float:
    """Normalize distance to roads where lower values are better."""
    return normalize(distance, min_value=0, max_value=30, reverse=True)



def normalize_temperature(temperature: Number) -> float:
    """
    Normalize temperature for environmental suitability.

    Expected suitability range:
    15–35 °C.

    Temperatures below 15 °C or above 35 °C are
    progressively less suitable for renewable-energy deployment.
    """
    return normalize(
        temperature,
        min_value=15.0,
        max_value=35.0,
    )


def normalize_humidity(humidity: Number) -> float:
    """
    Normalize relative humidity for environmental suitability.

    Expected suitability range:
    30–80%.

    Lower humidity is generally more favorable within
    the defined environmental suitability range.
    """
    return normalize(
        humidity,
        min_value=30.0,
        max_value=80.0,
        reverse=True,
    )