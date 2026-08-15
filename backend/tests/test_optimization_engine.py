from app.schemas.optimization import OptimizationRequest
from app.services.deployment_plan import DeploymentPlanService


def test_generate_hybrid_plan():
    request = OptimizationRequest(
        overall_site_score=92,
        solar_score=95,
        wind_score=90,
        terrain_score=85,
        infrastructure_score=88,
        estimated_solar_energy=18000,
        estimated_wind_energy=15000,
        land_area_hectares=60,
        available_budget=5000000,
    )

    result = DeploymentPlanService.generate_plan(request)

    assert result.recommended_technology == "Hybrid"
    assert result.recommended_capacity_mw == 1.0
    assert result.expansion_status == "Expandable"


def test_generate_small_site_plan():
    request = OptimizationRequest(
        overall_site_score=60,
        solar_score=65,
        wind_score=55,
        terrain_score=60,
        infrastructure_score=55,
        estimated_solar_energy=7000,
        estimated_wind_energy=5000,
        land_area_hectares=8,
        available_budget=1000000,
    )

    result = DeploymentPlanService.generate_plan(request)

    assert result.recommended_capacity_mw > 0
    assert result.expansion_status == "Not Expandable"