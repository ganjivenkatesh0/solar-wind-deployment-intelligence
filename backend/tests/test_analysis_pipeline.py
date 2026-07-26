from app.schemas.analysis import AnalysisRequest
from app.services.analysis_pipeline import AnalysisPipelineService


def test_analysis_pipeline():
    request = AnalysisRequest(
        latitude=17.3850,
        longitude=78.4867,
        land_area_hectares=40.0,
        available_budget=5_000_000,
    )

    service = AnalysisPipelineService()

    result = service.analyze_site(request)

    print("\n===== ANALYSIS RESULT =====")
    print(result.model_dump())


if __name__ == "__main__":
    test_analysis_pipeline()