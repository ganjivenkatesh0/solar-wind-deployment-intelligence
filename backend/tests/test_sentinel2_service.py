import pytest

from app.services.sentinel2_service import Sentinel2Service


def test_industrial_land_has_high_suitability():
    service = Sentinel2Service()

    assert service.get_suitability_score("Industrial") == 85.0


def test_forest_land_has_low_suitability():
    service = Sentinel2Service()

    assert service.get_suitability_score("Forest") == 10.0


def test_water_has_very_low_suitability():
    service = Sentinel2Service()

    assert service.get_suitability_score("River") == 5.0
    assert service.get_suitability_score("SeaLake") == 5.0


def test_unknown_land_cover_is_rejected():
    service = Sentinel2Service()

    with pytest.raises(ValueError):
        service.get_suitability_score("UnknownClass")


def test_land_cover_analysis_response():
    service = Sentinel2Service()

    result = service.analyze_land_cover("Industrial")

    assert result["land_cover_class"] == "Industrial"
    assert result["suitability_score"] == 85.0
    assert result["source"] == "Sentinel-2 / EuroSAT"
