"""Unit tests for VectorProcessor."""

import pytest

from backend.app.spatial.vector_processor import VectorProcessor


def test_vector_processor_creation():
    processor = VectorProcessor()

    assert processor is not None
    assert processor.vector_layer is None


def test_load_vector_layer():
    processor = VectorProcessor()

    with pytest.raises(NotImplementedError):
        processor.load_vector_layer("roads.geojson")


def test_find_nearest_feature():
    processor = VectorProcessor()

    with pytest.raises(NotImplementedError):
        processor.find_nearest_feature(
            latitude=17.3850,
            longitude=78.4867,
        )


def test_intersects():
    processor = VectorProcessor()

    with pytest.raises(NotImplementedError):
        processor.intersects(None)


def test_within_distance():
    processor = VectorProcessor()

    with pytest.raises(NotImplementedError):
        processor.within_distance(
            latitude=17.3850,
            longitude=78.4867,
            distance=1000,
        )
