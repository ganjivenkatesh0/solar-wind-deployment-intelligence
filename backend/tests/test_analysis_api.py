import pytest
from fastapi import HTTPException

from app.api.analysis import analyze_site
from app.schemas.analysis import AnalysisRequest


def test_analysis_api_rejects_location_outside_srtm_coverage(monkeypatch):
    request = AnalysisRequest(
        latitude=16.5062,
        longitude=80.6480,
        land_area_hectares=5.0,
        available_budget=500_000,
    )

    def raise_srtm_coverage_error(_request):
        raise ValueError(
            "Requested coordinates are outside the SRTM raster coverage."
        )

    monkeypatch.setattr(
        "app.api.analysis.analysis_service.analyze_site",
        raise_srtm_coverage_error,
    )

    with pytest.raises(HTTPException) as exc_info:
        analyze_site(request)

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == (
        "Terrain data is unavailable for the selected location. "
        "Please choose a location within the supported SRTM coverage."
    )
