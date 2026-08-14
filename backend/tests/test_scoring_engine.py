from app.services.scoring.category_scoring import (
    infrastructure_score,
    renewable_resource_score,
    terrain_score,
)
from app.services.scoring.ranking_engine import rank_candidate_sites
from app.services.scoring.scoring_engine import calculate_overall_score


def test_calculate_overall_score_uses_weighted_average():
    result = calculate_overall_score(
        renewable=91,
        terrain=84,
        infrastructure=79,
        environmental=93,
        economic=81,
    )

    assert result == {
        "renewable_score": 91.0,
        "terrain_score": 84.0,
        "infrastructure_score": 79.0,
        "environmental_score": 93.0,
        "economic_score": 81.0,
        "overall_score": 86.4,
    }


def test_higher_renewable_resources_improve_overall_score():
    site_a = {
        "renewable": 92,
        "terrain": 88,
        "infrastructure": 85,
        "environmental": 90,
        "economic": 84,
    }
    site_b = {
        "renewable": 75,
        "terrain": 90,
        "infrastructure": 92,
        "environmental": 88,
        "economic": 85,
    }

    site_a_score = calculate_overall_score(**site_a)
    site_b_score = calculate_overall_score(**site_b)

    assert site_a_score["overall_score"] > site_b_score["overall_score"]


def test_poor_infrastructure_reduces_overall_score():
    good_site = calculate_overall_score(
        renewable=90,
        terrain=85,
        infrastructure=90,
        environmental=95,
        economic=88,
    )
    poor_infrastructure_site = calculate_overall_score(
        renewable=90,
        terrain=85,
        infrastructure=30,
        environmental=95,
        economic=88,
    )

    assert good_site["overall_score"] > poor_infrastructure_site["overall_score"]


def test_poor_terrain_reduces_overall_score():
    flat_site = calculate_overall_score(
        renewable=90,
        terrain=90,
        infrastructure=80,
        environmental=95,
        economic=88,
    )
    steep_site = calculate_overall_score(
        renewable=90,
        terrain=20,
        infrastructure=80,
        environmental=95,
        economic=88,
    )

    assert flat_site["overall_score"] > steep_site["overall_score"]


def test_ranking_updates_when_scores_change():
    sites = [
        {"site_name": "Site A", "overall_score": 91.0},
        {"site_name": "Site B", "overall_score": 84.0},
        {"site_name": "Site C", "overall_score": 78.0},
    ]

    ranked_sites = rank_candidate_sites(sites)
    assert ranked_sites[0]["site_name"] == "Site A"

    sites[0]["overall_score"] = 79.0
    ranked_sites = rank_candidate_sites(sites)

    assert ranked_sites[0]["site_name"] == "Site B"


def test_repeated_evaluations_are_consistent():
    score1 = calculate_overall_score(
        renewable=90,
        terrain=85,
        infrastructure=80,
        environmental=95,
        economic=88,
    )
    score2 = calculate_overall_score(
        renewable=90,
        terrain=85,
        infrastructure=80,
        environmental=95,
        economic=88,
    )

    assert score1 == score2


def test_category_scoring_helpers_match_pipeline_expectations():
    renewable = renewable_resource_score(7.2, 8.4)
    terrain = terrain_score(3.0)
    infrastructure = infrastructure_score(5.0, 2.0)

    assert renewable == 74.0
    assert terrain == 90.0
    assert infrastructure == 91.66


def test_sentinel2_score_is_optional_and_does_not_change_overall_score():
    result_without_sentinel = calculate_overall_score(
        renewable=70,
        terrain=80,
        infrastructure=90,
        environmental=75,
        economic=85,
    )

    result_with_sentinel = calculate_overall_score(
        renewable=70,
        terrain=80,
        infrastructure=90,
        environmental=75,
        economic=85,
        sentinel2=85,
    )

    assert result_with_sentinel["sentinel2_score"] == 85.0
    assert (
        result_with_sentinel["overall_score"]
        == result_without_sentinel["overall_score"]
    )
