

def test_capacity_is_limited_by_available_budget():
    from app.services.capacity_planner import CapacityPlanner

    result = CapacityPlanner.recommend_capacity(
        land_area_hectares=60,
        overall_site_score=92,
        available_budget=550_000_000,
    )

    assert result == 50.0


def test_high_budget_preserves_land_and_score_capacity():
    from app.services.capacity_planner import CapacityPlanner

    result = CapacityPlanner.recommend_capacity(
        land_area_hectares=60,
        overall_site_score=92,
        available_budget=2_000_000_000,
    )

    assert result == 120.0


def test_small_budget_returns_minimum_viable_capacity():
    from app.services.capacity_planner import CapacityPlanner

    result = CapacityPlanner.recommend_capacity(
        land_area_hectares=60,
        overall_site_score=92,
        available_budget=1_000_000,
    )

    assert result == 1.0


def test_better_site_score_increases_capacity_when_budget_allows():
    from app.services.capacity_planner import CapacityPlanner

    low_score = CapacityPlanner.recommend_capacity(
        land_area_hectares=60,
        overall_site_score=60,
        available_budget=2_000_000_000,
    )

    high_score = CapacityPlanner.recommend_capacity(
        land_area_hectares=60,
        overall_site_score=90,
        available_budget=2_000_000_000,
    )

    assert high_score > low_score
