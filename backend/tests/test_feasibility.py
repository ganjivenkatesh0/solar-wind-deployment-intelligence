from app.services.feasibility.feasibility_engine import FeasibilityEngine


def test_good_site_passes_hard_constraints_and_is_feasible():
    engine = FeasibilityEngine()

    result = engine.evaluate(
        slope=5.0,
        grid_distance=1.0,
        road_distance=1.0,
        land_use_restricted=False,
    )

    assert isinstance(result, dict)
    assert result["is_feasible"] is True
    assert result["decision"] == "TECHNICALLY FEASIBLE"
    assert isinstance(result["feasibility_score"], float)
    assert result["feasibility_score"] > 90.0
    assert "hard_constraints" in result
    assert "soft_constraints" in result


def test_terrain_hard_constraint_fails_when_slope_too_high():
    engine = FeasibilityEngine()

    result = engine.evaluate(
        slope=20.0,
        grid_distance=1.0,
        road_distance=1.0,
        land_use_restricted=False,
    )

    assert result["is_feasible"] is False
    assert result["decision"] == "NOT TECHNICALLY FEASIBLE"
    assert result["feasibility_score"] == 0.0
    assert "terrain" in result["hard_constraints"]["constraints"]
    assert "terrain" in result["hard_constraints"]["failed_constraints"]


def test_land_use_hard_constraint_fails_when_restricted():
    engine = FeasibilityEngine()

    result = engine.evaluate(
        slope=5.0,
        grid_distance=1.0,
        road_distance=1.0,
        land_use_restricted=True,
    )

    assert result["is_feasible"] is False
    assert "land_use" in result["hard_constraints"]["failed_constraints"]


def test_soft_scores_reflect_better_infrastructure():
    engine = FeasibilityEngine()

    good = engine.evaluate(
        slope=5.0,
        grid_distance=1.0,
        road_distance=1.0,
        land_use_restricted=False,
    )

    poor = engine.evaluate(
        slope=5.0,
        grid_distance=20.0,
        road_distance=15.0,
        land_use_restricted=False,
    )

    assert good["is_feasible"] is True
    assert poor["is_feasible"] is True
    assert good["feasibility_score"] > poor["feasibility_score"]


def test_poor_soft_constraints_do_not_make_site_infeasible_if_hard_constraints_pass():
    engine = FeasibilityEngine()

    result = engine.evaluate(
        slope=5.0,
        grid_distance=50.0,
        road_distance=30.0,
        land_use_restricted=False,
    )

    # soft constraints are poor, but hard constraints still pass
    assert result["is_feasible"] is True
    assert result["feasibility_score"] >= 0.0


def test_failed_constraints_report_multiple_failures():
    engine = FeasibilityEngine()

    result = engine.evaluate(
        slope=20.0,
        grid_distance=1.0,
        road_distance=1.0,
        land_use_restricted=True,
    )

    assert result["is_feasible"] is False
    failed = result["hard_constraints"]["failed_constraints"]
    assert "terrain" in failed
    assert "land_use" in failed
    assert result["constraint_summary"].startswith("Mandatory technical constraints failed")

def test_missing_grid_distance_is_supported():
    """Missing grid data must not make technical feasibility fail."""

    engine = FeasibilityEngine()

    result = engine.evaluate(
        slope=2.0,
        grid_distance=None,
        road_distance=0.5,
    )

    assert result["is_feasible"] is True
    assert result["soft_constraints"]["constraints"]["grid_proximity"]["score"] is None
    assert result["soft_constraints"]["constraints"]["grid_proximity"]["value"] is None
    assert result["soft_constraints"]["constraints"]["road_accessibility"]["score"] is not None

