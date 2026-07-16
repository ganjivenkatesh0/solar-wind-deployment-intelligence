"""Unit tests for coordinate utilities."""

import pytest

from backend.app.utils.coordinates import (
    create_coordinate,
    validate_coordinates,
)


def test_valid_coordinates():
    assert validate_coordinates(17.3850, 78.4867)


def test_invalid_latitude():
    assert not validate_coordinates(100.0, 78.0)


def test_invalid_longitude():
    assert not validate_coordinates(17.0, 200.0)


def test_create_coordinate():
    coordinate = create_coordinate(
        17.3850,
        78.4867,
    )

    assert coordinate.latitude == 17.3850
    assert coordinate.longitude == 78.4867


def test_invalid_coordinate_creation():
    with pytest.raises(ValueError):
        create_coordinate(
            100.0,
            200.0,
        )
