from app.schemas.analysis import AnalysisRequest
from app.services import analysis_pipeline as pipeline_module
from app.services.analysis_pipeline import AnalysisPipelineService
from app.services.machine_learning.inference import RenewableModelInference


from unittest.mock import patch

MOCK_OSM_INFRASTRUCTURE = {
    "latitude": 17.3850,
    "longitude": 78.4867,
    "search_radius_m": 5000,
    "road_distance_km": 0.023,
    "power_line_distance_km": 0.714,
    "substation_distance_km": 0.970,
    "grid_distance_km": 0.714,
    "road_features_found": 19020,
    "power_line_features_found": 1,
    "substation_features_found": 16,
    "source": "OpenStreetMap Overpass API",
}


def test_analysis_pipeline():
    request = AnalysisRequest(
        latitude=17.3850,
        longitude=78.4867,
        land_area_hectares=40.0,
        available_budget=5_000_000,
    )

    service = AnalysisPipelineService()

    with patch.object(
        pipeline_module.OSMClient,
        "get_infrastructure_data",
        return_value=MOCK_OSM_INFRASTRUCTURE,
    ):
        service = AnalysisPipelineService()

        assert isinstance(service.ml_inference, RenewableModelInference)

        result = service.analyze_site(request)

        assert isinstance(result.ml_prediction, dict)
        assert "solar_pvout_potential" in result.ml_prediction
        assert isinstance(result.ml_prediction["solar_pvout_potential"], float)
        assert isinstance(result.solar_features, dict)
        assert isinstance(result.wind_assessment, dict)
        assert isinstance(result.renewable_score, float)
        assert isinstance(result.terrain_score, float)
        assert isinstance(result.infrastructure_score, float)
        assert result.infrastructure_score > 0.0  # New assertion
        assert isinstance(result.overall_site_score, float)
        assert isinstance(result.deployment_plan, dict)
        assert hasattr(result.technical_feasibility, "is_feasible")
        assert isinstance(result.deployment_plan["energy_estimation"], dict)
        assert isinstance(result.deployment_plan["energy_estimation"]["solar_energy"], float)
        assert isinstance(result.deployment_plan["energy_estimation"]["wind_energy"], float)
        assert isinstance(result.deployment_plan["energy_estimation"]["total_energy"], float)
        assert result.deployment_plan["energy_estimation"]["solar_energy"] >= 0.0
        assert result.deployment_plan["energy_estimation"]["wind_energy"] >= 0.0
        assert result.deployment_plan["energy_estimation"]["total_energy"] >= 0.0
        # Energy & Financial represents generation potential,
        # while Recommendation represents the final deployment decision.
        assert result.deployment_plan["energy_estimation"]["deployment_type"] in {
            "Solar",
            "Wind",
            "Hybrid",
            "Not Recommended",
        }


def test_analysis_pipeline_feasibility_occurs_before_energy_estimation(monkeypatch):
    order = []

    def mock_evaluate(self, *args, **kwargs):
        order.append("feasibility")
        return {
            "is_feasible": True,
            "feasibility_score": 100.0,
            "decision": "Feasible",
            "hard_constraints": {
                "passed": True,
                "constraints": {},
                "failed_constraints": [],
            },
            "soft_constraints": {
                "score": 100.0,
                "constraints": {},
            },
            "constraint_summary": "",
        }

    def mock_estimate_hybrid_energy_yield(
        installed_capacity,
        solar_capacity_factor,
        wind_capacity_factor,
        system_efficiency,
    ):
        order.append("energy")
        assert system_efficiency == pipeline_module.DEFAULT_SYSTEM_EFFICIENCY
        return {
            # This test verifies pipeline execution order.
            # Use financially viable mock energy values.
            "solar_energy": 1000.0,
            "wind_energy": 1000.0,
            "total_energy": 2000.0,
        }

    monkeypatch.setattr(pipeline_module.FeasibilityEngine, "evaluate", mock_evaluate)
    monkeypatch.setattr(
        pipeline_module,
        "estimate_hybrid_energy_yield",
        mock_estimate_hybrid_energy_yield,
    )

    request = AnalysisRequest(
        latitude=17.3850,
        longitude=78.4867,
        land_area_hectares=40.0,
        available_budget=5_000_000,
    )

    with patch.object(
        pipeline_module.OSMClient,
        "get_infrastructure_data",
        return_value=MOCK_OSM_INFRASTRUCTURE,
    ):
        service = AnalysisPipelineService()
        result = service.analyze_site(request)


    # The provisional energy calculation must happen after feasibility.
    # Final energy may be recalculated from the final recommendation/capacity.
    assert order == ["feasibility", "energy"]
    assert result.deployment_plan["energy_estimation"]["total_energy"] >= 0.0
    assert result.technical_feasibility.is_feasible is True


if __name__ == "__main__":
    test_analysis_pipeline()



def test_analysis_pipeline_succeeds_when_grid_distance_is_missing():
    request = AnalysisRequest(
        latitude=17.6999,
        longitude=82.2070,
        land_area_hectares=40.0,
        available_budget=5_000_000,
    )

    missing_grid_infrastructure = {
        **MOCK_OSM_INFRASTRUCTURE,
        "latitude": 17.6999,
        "longitude": 82.2070,
        "grid_distance_km": None,
        "power_line_distance_km": None,
        "substation_distance_km": None,
    }

    service = AnalysisPipelineService()

    with patch.object(
        pipeline_module.OSMClient,
        "get_infrastructure_data",
        return_value=missing_grid_infrastructure,
    ):
        result = service.analyze_site(request)

    assert result.technical_feasibility.is_feasible is True
    assert result.technical_feasibility.feasibility_score >= 0.0
    assert result.infrastructure_score > 0.0
    assert result.deployment_plan["energy_estimation"]["total_energy"] >= 0.0



def test_analysis_pipeline_includes_financial_analysis():
    request = AnalysisRequest(
        latitude=17.3850,
        longitude=78.4867,
        land_area_hectares=40.0,
        available_budget=5_000_000,
    )

    with patch.object(
        pipeline_module.OSMClient,
        "get_infrastructure_data",
        return_value=MOCK_OSM_INFRASTRUCTURE,
    ):
        service = AnalysisPipelineService()
        result = service.analyze_site(request)

        financial = result.deployment_plan["financial_analysis"]

        assert isinstance(financial, dict)

        assert "annual_revenue" in financial
        assert "estimated_project_cost" in financial
        assert "payback_period" in financial
        assert "roi" in financial

        assert isinstance(financial["annual_revenue"], float)
        assert isinstance(financial["estimated_project_cost"], float)
        assert isinstance(financial["payback_period"], float)
        assert isinstance(financial["roi"], float)

        assert financial["annual_revenue"] >= 0.0
        assert financial["estimated_project_cost"] > 0.0
        assert financial["payback_period"] >= 0.0


def test_project_type_changes_recommended_deployment(monkeypatch):
    from app.schemas.analysis import AnalysisRequest
    from app.services import analysis_pipeline as pipeline_module

    monkeypatch.setattr(
        pipeline_module.OSMClient,
        "get_infrastructure_data",
        lambda self, location: MOCK_OSM_INFRASTRUCTURE,
    )

    service = pipeline_module.AnalysisPipelineService()

    solar_request = AnalysisRequest(
        latitude=17.3850,
        longitude=78.4867,
        land_area_hectares=40.0,
        available_budget=5_000_000,
        project_type="solar",
        installation_type="ground-mounted",
    )

    wind_request = AnalysisRequest(
        latitude=17.3850,
        longitude=78.4867,
        land_area_hectares=40.0,
        available_budget=5_000_000,
        project_type="wind",
        installation_type="ground-mounted",
    )

    solar_result = service.analyze_site(solar_request)
    wind_result = service.analyze_site(wind_request)

    assert solar_result.recommended_deployment == "Solar"
    assert wind_result.recommended_deployment == "Wind"



def test_budget_constraint_affects_capacity_when_budget_is_binding():
    from app.services.capacity_planner import CapacityPlanner

    low_budget = CapacityPlanner.recommend_capacity(
        land_area_hectares=40.0,
        overall_site_score=70.0,
        available_budget=12_000_000,
        installation_type="ground-mounted",
    )

    high_budget = CapacityPlanner.recommend_capacity(
        land_area_hectares=40.0,
        overall_site_score=70.0,
        available_budget=50_000_000,
        installation_type="ground-mounted",
    )

    assert low_budget >= CapacityPlanner.MINIMUM_CAPACITY_MW
    assert high_budget > low_budget


def test_land_area_changes_capacity_when_budget_is_not_binding():
    from app.services.capacity_planner import CapacityPlanner

    # Use a sufficiently large budget so land area, rather than
    # the budget ceiling, determines the recommended capacity.
    small_land = CapacityPlanner.recommend_capacity(
        land_area_hectares=5.0,
        overall_site_score=80.0,
        available_budget=2_000_000_000,
        installation_type="ground-mounted",
    )

    large_land = CapacityPlanner.recommend_capacity(
        land_area_hectares=40.0,
        overall_site_score=80.0,
        available_budget=2_000_000_000,
        installation_type="ground-mounted",
    )

    assert large_land > small_land


def test_installation_type_changes_capacity_when_budget_is_not_binding():
    from app.services.capacity_planner import CapacityPlanner

    # Use a sufficiently large budget so installation configuration,
    # rather than the budget ceiling, determines capacity.
    ground = CapacityPlanner.recommend_capacity(
        land_area_hectares=40.0,
        overall_site_score=80.0,
        available_budget=2_000_000_000,
        installation_type="ground-mounted",
    )

    rooftop = CapacityPlanner.recommend_capacity(
        land_area_hectares=40.0,
        overall_site_score=80.0,
        available_budget=2_000_000_000,
        installation_type="rooftop",
    )

    other = CapacityPlanner.recommend_capacity(
        land_area_hectares=40.0,
        overall_site_score=80.0,
        available_budget=2_000_000_000,
        installation_type="other",
    )

    assert ground > other > rooftop



def test_installation_type_changes_recommended_capacity():
    from app.services.capacity_planner import CapacityPlanner

    ground = CapacityPlanner.recommend_capacity(
        land_area_hectares=40,
        overall_site_score=90,
        available_budget=2_000_000_000,
        installation_type="ground-mounted",
    )

    rooftop = CapacityPlanner.recommend_capacity(
        land_area_hectares=40,
        overall_site_score=90,
        available_budget=2_000_000_000,
        installation_type="rooftop",
    )

    other = CapacityPlanner.recommend_capacity(
        land_area_hectares=40,
        overall_site_score=90,
        available_budget=2_000_000_000,
        installation_type="other",
    )

    assert ground > other > rooftop


def test_project_type_changes_resource_score_and_energy(monkeypatch):
    """Solar, wind and hybrid requests must use different resource logic."""

    request_base = dict(
        latitude=17.3850,
        longitude=78.4867,
        land_area_hectares=40.0,
        available_budget=2_000_000_000,
        installation_type="ground-mounted",
    )

    results = {}

    for project_type in ("solar", "wind", "hybrid"):
        request = AnalysisRequest(
            **request_base,
            project_type=project_type,
        )

        service = AnalysisPipelineService()

        with patch.object(
            pipeline_module.OSMClient,
            "get_infrastructure_data",
            return_value=MOCK_OSM_INFRASTRUCTURE,
        ):
            results[project_type] = service.analyze_site(request)

    solar = results["solar"]
    wind = results["wind"]
    hybrid = results["hybrid"]

    assert solar.renewable_score != wind.renewable_score

    assert solar.energy_yield["deployment_type"] == "Solar"
    assert wind.energy_yield["deployment_type"] == "Wind"
    assert hybrid.energy_yield["deployment_type"] == "Hybrid"

    assert solar.energy_yield["wind_energy"] == 0.0
    assert wind.energy_yield["solar_energy"] == 0.0

    assert solar.energy_yield["total_energy"] > 0
    assert wind.energy_yield["total_energy"] > 0
    assert hybrid.energy_yield["total_energy"] > 0


def test_budget_changes_recommended_capacity_and_energy():
    """Lower budget must constrain capacity and therefore energy."""

    high_budget_request = AnalysisRequest(
        latitude=17.3850,
        longitude=78.4867,
        land_area_hectares=60.0,
        available_budget=2_000_000_000,
        project_type="solar",
        installation_type="ground-mounted",
    )

    low_budget_request = AnalysisRequest(
        latitude=17.3850,
        longitude=78.4867,
        land_area_hectares=60.0,
        available_budget=20_000_000,
        project_type="solar",
        installation_type="ground-mounted",
    )

    high_service = AnalysisPipelineService()
    low_service = AnalysisPipelineService()

    with patch.object(
        pipeline_module.OSMClient,
        "get_infrastructure_data",
        return_value=MOCK_OSM_INFRASTRUCTURE,
    ):
        high_result = high_service.analyze_site(high_budget_request)
        low_result = low_service.analyze_site(low_budget_request)

    high_capacity = high_result.deployment_plan["recommended_capacity_mw"]
    low_capacity = low_result.deployment_plan["recommended_capacity_mw"]

    assert low_capacity <= high_capacity
    assert low_result.energy_yield["total_energy"] <= high_result.energy_yield["total_energy"]


def test_land_area_changes_recommended_capacity_and_energy():
    """More usable land must allow greater capacity when budget is not limiting."""

    small_land_request = AnalysisRequest(
        latitude=17.3850,
        longitude=78.4867,
        land_area_hectares=8.0,
        available_budget=2_000_000_000,
        project_type="solar",
        installation_type="ground-mounted",
    )

    large_land_request = AnalysisRequest(
        latitude=17.3850,
        longitude=78.4867,
        land_area_hectares=60.0,
        available_budget=2_000_000_000,
        project_type="solar",
        installation_type="ground-mounted",
    )

    small_service = AnalysisPipelineService()
    large_service = AnalysisPipelineService()

    with patch.object(
        pipeline_module.OSMClient,
        "get_infrastructure_data",
        return_value=MOCK_OSM_INFRASTRUCTURE,
    ):
        small_result = small_service.analyze_site(small_land_request)
        large_result = large_service.analyze_site(large_land_request)

    small_capacity = small_result.deployment_plan["recommended_capacity_mw"]
    large_capacity = large_result.deployment_plan["recommended_capacity_mw"]

    assert large_capacity > small_capacity
    assert large_result.energy_yield["total_energy"] > small_result.energy_yield["total_energy"]


def test_analysis_pipeline_succeeds_when_road_distance_is_missing():
    """Missing road data must not crash the analysis pipeline."""

    request = AnalysisRequest(
        latitude=17.6999,
        longitude=82.2070,
        land_area_hectares=40.0,
        available_budget=5_000_000,
    )

    missing_road_infrastructure = {
        **MOCK_OSM_INFRASTRUCTURE,
        "latitude": 17.6999,
        "longitude": 82.2070,
        "road_distance_km": None,
    }

    service = AnalysisPipelineService()

    with patch.object(
        pipeline_module.OSMClient,
        "get_infrastructure_data",
        return_value=missing_road_infrastructure,
    ):
        result = service.analyze_site(request)

    assert result.technical_feasibility.is_feasible is True
    assert result.technical_feasibility.feasibility_score >= 0.0
    assert result.infrastructure_score >= 0.0
    assert result.deployment_plan["energy_estimation"]["total_energy"] >= 0.0

    road_constraint = (
        result.technical_feasibility
        .soft_constraints
        .constraints["road_accessibility"]
    )

    assert road_constraint.value is None
    assert road_constraint.score is None
