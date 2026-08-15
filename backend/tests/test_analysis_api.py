import pytest
from fastapi import HTTPException

from app.api.analysis import analyze_site
from app.schemas.analysis import AnalysisRequest


def test_analysis_api_supports_location_outside_local_srtm_coverage(monkeypatch):
    from app.services.analysis_pipeline import AnalysisPipelineService

    monkeypatch.setattr(
        AnalysisPipelineService,
        "analyze_site",
        lambda self, request: None,
    )
