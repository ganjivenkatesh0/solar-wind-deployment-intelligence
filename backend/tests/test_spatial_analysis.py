"""Unit tests for SpatialAnalysisService."""

import pytest

from backend.app.services.spatial_analysis import (
    SpatialAnalysisService,
)


def test_service_creation():
    service = SpatialAnalysisService()

    assert service is not None


def test_prepare_coordinate():
    service = SpatialAnalysisService()

    coordinate = service.prepare_coordinate(
        17.3850,
        78.4867,
    )

    assert coordinate.latitude == 17.3850
    assert coordinate.longitude == 78.4867


def test_collect_raster_features():
    service = SpatialAnalysisService()

    coordinate = service.prepare_coordinate(
        17.0,
        78.0,
    )

    with pytest.raises(NotImplementedError):
        service.collect_raster_features(
            coordinate
        )


def test_collect_vector_features():
    service = SpatialAnalysisService()

    coordinate = service.prepare_coordinate(
        17.0,
        78.0,
    )

    with pytest.raises(NotImplementedError):
        service.collect_vector_features(
            coordinate
        )


def test_analyze_site():
    service = SpatialAnalysisService()

    with pytest.raises(NotImplementedError):
        service.analyze_site(
            17.3850,
            78.4867,
        )
