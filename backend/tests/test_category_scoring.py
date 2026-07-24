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


def test_environmental_score_bounds():
    assert environmental_score(92.0) == 92.0
    assert environmental_score(-10.0) == 0.0
    assert environmental_score(120.0) == 100.0


def test_economic_score_bounds():
    assert economic_score(81.0) == 81.0
    assert economic_score(-3.0) == 0.0
    assert economic_score(150.0) == 100.0
