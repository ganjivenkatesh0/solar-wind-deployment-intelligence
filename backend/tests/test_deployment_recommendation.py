from app.schemas.deployment_recommendation import (
    DeploymentRecommendationRequest,
)
from app.services.deployment_recommendation_service import (
    DeploymentRecommendationService,
)


def test_hybrid_recommendation():
    request = DeploymentRecommendationRequest(
        overall_site_score=92,
        solar_score=95,
        wind_score=90,
        terrain_score=85,
        infrastructure_score=88,
        estimated_solar_energy=18000,
        estimated_wind_energy=15000,
    )

    result = DeploymentRecommendationService.generate_recommendation(request)

    assert result.deployment_type == "Hybrid"
    assert result.priority == "High"
    assert result.confidence == 92
    assert "hybrid" in result.reason.lower()


def test_solar_recommendation():
    request = DeploymentRecommendationRequest(
        overall_site_score=86,
        solar_score=91,
        wind_score=60,
        terrain_score=80,
        infrastructure_score=82,
        estimated_solar_energy=19000,
        estimated_wind_energy=9000,
    )

    result = DeploymentRecommendationService.generate_recommendation(request)

    assert result.deployment_type == "Solar"
    assert result.priority == "High"


def test_wind_recommendation():
    request = DeploymentRecommendationRequest(
        overall_site_score=84,
        solar_score=62,
        wind_score=91,
        terrain_score=82,
        infrastructure_score=81,
        estimated_solar_energy=9000,
        estimated_wind_energy=22000,
    )

    result = DeploymentRecommendationService.generate_recommendation(request)

    assert result.deployment_type == "Wind"
    assert result.priority == "Medium"


def test_not_recommended():
    request = DeploymentRecommendationRequest(
        overall_site_score=45,
        solar_score=40,
        wind_score=42,
        terrain_score=55,
        infrastructure_score=50,
        estimated_solar_energy=3000,
        estimated_wind_energy=2500,
    )

    result = DeploymentRecommendationService.generate_recommendation(request)

    assert result.deployment_type == "Not Recommended"
    assert result.priority == "Not Recommended"