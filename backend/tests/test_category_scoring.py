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


def test_economic_score():
    assert economic_score(
        payback_period=2.0,
        roi=150.0,
    ) == pytest.approx(77.5)


def test_economic_score_bounds():
    assert economic_score(
        payback_period=12.0,
        roi=-10.0,
    ) == pytest.approx(0.0)

    assert economic_score(
        payback_period=0.0,
        roi=250.0,
    ) == pytest.approx(100.0)


def test_economic_score_improves_with_better_financial_conditions():
    favorable = economic_score(
        payback_period=2.0,
        roi=150.0,
    )

    unfavorable = economic_score(
        payback_period=9.0,
        roi=20.0,
    )

    assert favorable > unfavorable
