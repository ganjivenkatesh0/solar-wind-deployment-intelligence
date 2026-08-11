from app.schemas.analysis import AnalysisRequest
from app.services.analysis_pipeline import AnalysisPipelineService
from app.services.machine_learning.inference import RenewableModelInference


def test_analysis_pipeline():
    request = AnalysisRequest(
        latitude=17.3850,
        longitude=78.4867,
        land_area_hectares=40.0,
        available_budget=5_000_000,
    )

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
    assert isinstance(result.overall_site_score, float)
    assert isinstance(result.deployment_plan, dict)


if __name__ == "__main__":
    test_analysis_pipeline()