import pytest

from app.services.scoring.category_scoring import (
    economic_score,
    environmental_score,
    infrastructure_score,
    renewable_resource_score,
    terrain_score,
)


def test_renewable_resource_score():
    assert renewable_resource_score(7.2, 8.4) == pytest.approx(74.0)


def test_terrain_score():
    assert terrain_score(3.0) == pytest.approx(90.0)


def test_infrastructure_score():
    assert infrastructure_score(5.0, 2.0) == pytest.approx(91.66)


def test_environmental_score():
    score = environmental_score(
        solar_irradiance=6.5,
        temperature=28.0,
        relative_humidity=40.0,
    )

    assert score == pytest.approx(71.25)


def test_environmental_score_bounds():
    low_score = environmental_score(
        solar_irradiance=3.0,
        temperature=15.0,
        relative_humidity=80.0,
    )

    high_score = environmental_score(
        solar_irradiance=8.0,
        temperature=35.0,
        relative_humidity=30.0,
    )

    assert low_score == pytest.approx(0.0)
    assert high_score == pytest.approx(100.0)


def test_environmental_score_changes_with_conditions():
    favorable = environmental_score(
        solar_irradiance=6.5,
        temperature=28.0,
        relative_humidity=40.0,
    )

    unfavorable = environmental_score(
        solar_irradiance=3.2,
        temperature=18.0,
        relative_humidity=75.0,
    )

    assert favorable > unfavorable


def test_economic_score_bounds():
    assert economic_score(81.0) == 81.0
    assert economic_score(-3.0) == 0.0
    assert economic_score(150.0) == 100.0
