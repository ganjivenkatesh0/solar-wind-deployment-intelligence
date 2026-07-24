import pytest

from app.services.scoring.normalization import (
    normalize,
    normalize_grid_distance,
    normalize_road_distance,
    normalize_slope,
    normalize_solar,
    normalize_wind,
)


def test_normalize_returns_expected_score_for_positive_direction():
    assert normalize(7.5, 3.0, 8.0) == pytest.approx(90.0)


def test_normalize_returns_expected_score_for_reverse_direction():
    assert normalize(2, 0, 30, reverse=True) == pytest.approx(93.33)


def test_normalize_clamps_values_to_range():
    assert normalize(100, 0, 50) == pytest.approx(100.0)
    assert normalize(-10, 0, 50) == pytest.approx(0.0)


def test_parameter_specific_normalizers():
    assert normalize_solar(7.5) == pytest.approx(90.0)
    assert normalize_wind(10.0) == pytest.approx(80.0)
    assert normalize_slope(2.0) == pytest.approx(93.33)
    assert normalize_grid_distance(3.0) == pytest.approx(94.0)
    assert normalize_road_distance(1.0) == pytest.approx(96.67)


def test_normalize_raises_for_invalid_bounds():
    with pytest.raises(ValueError):
        normalize(10, 5, 5)
