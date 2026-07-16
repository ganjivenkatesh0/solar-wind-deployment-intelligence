"""Utility functions for geographic coordinates."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Coordinate:
    """Represents a geographic coordinate."""

    latitude: float
    longitude: float


def validate_latitude(latitude: float) -> bool:
    """
    Validate latitude.

    Valid range:
    -90 <= latitude <= 90
    """

    return -90.0 <= latitude <= 90.0


def validate_longitude(longitude: float) -> bool:
    """
    Validate longitude.

    Valid range:
    -180 <= longitude <= 180
    """

    return -180.0 <= longitude <= 180.0


def validate_coordinates(latitude: float, longitude: float) -> bool:
    """
    Validate a latitude/longitude pair.
    """

    return validate_latitude(latitude) and validate_longitude(longitude)


def create_coordinate(
    latitude: float,
    longitude: float,
) -> Coordinate:
    """
    Create a Coordinate object after validation.
    """

    if not validate_coordinates(latitude, longitude):
        raise ValueError("Invalid latitude or longitude.")

    return Coordinate(
        latitude=latitude,
        longitude=longitude,
    )
