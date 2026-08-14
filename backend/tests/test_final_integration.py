import pytest

from app.schemas.analysis import AnalysisRequest
from app.services.analysis_pipeline import AnalysisPipelineService


TEST_LOCATIONS = [
    (17.3850, 78.4867),  # Hyderabad
    (17.4500, 78.5000),  # Hyderabad North
    (17.3000, 78.4500),  # Hyderabad South
]


def test_final_integration_multiple_locations():
    service = AnalysisPipelineService()

    for latitude, longitude in TEST_LOCATIONS:
        request = AnalysisRequest(
            latitude=latitude,
            longitude=longitude,
            land_area_hectares=40.0,
            available_budget=5_000_000,
        )

        result = service.analyze_site(request)

        # Standardized response fields
        assert isinstance(result.site_suitability, float)
        assert isinstance(result.recommended_deployment, str)
        assert result.technical_feasibility is not None
        assert isinstance(result.energy_yield, dict)
        assert isinstance(result.financial_metrics, dict)
        assert isinstance(result.recommendation_reason, str)

        # Energy validation
        assert result.energy_yield["solar_energy"] >= 0.0
        assert result.energy_yield["wind_energy"] >= 0.0
        assert result.energy_yield["total_energy"] >= 0.0

        # Financial validation
        assert result.financial_metrics["annual_revenue"] >= 0.0
        assert result.financial_metrics["estimated_project_cost"] > 0.0
        assert result.financial_metrics["payback_period"] >= 0.0


def test_final_integration_rejects_invalid_coordinates():
    invalid_locations = [
        (91.0, 78.4867),
        (-91.0, 78.4867),
        (17.3850, 181.0),
        (17.3850, -181.0),
    ]

    for latitude, longitude in invalid_locations:
        with pytest.raises(ValueError):
            AnalysisRequest(
                latitude=latitude,
                longitude=longitude,
                land_area_hectares=40.0,
                available_budget=5_000_000,
            )


def test_final_response_has_consistent_structure():
    service = AnalysisPipelineService()

    request = AnalysisRequest(
        latitude=17.3850,
        longitude=78.4867,
        land_area_hectares=40.0,
        available_budget=5_000_000,
    )

    result = service.analyze_site(request)

    assert hasattr(result, "site_suitability")
    assert hasattr(result, "recommended_deployment")
    assert hasattr(result, "technical_feasibility")
    assert hasattr(result, "energy_yield")
    assert hasattr(result, "financial_metrics")
    assert hasattr(result, "recommendation_reason")
