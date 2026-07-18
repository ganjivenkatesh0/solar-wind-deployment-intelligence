"""Unit tests for RasterProcessor."""

import pytest

from app.spatial.raster_processor import RasterProcessor


def test_raster_processor_creation():
    processor = RasterProcessor()

    assert processor is not None
    assert processor.raster is None


def test_load_raster_not_implemented():
    processor = RasterProcessor()

    with pytest.raises(NotImplementedError):
        processor.load_raster("sample.tif")


def test_sample_value_not_implemented():
    processor = RasterProcessor()

    with pytest.raises(NotImplementedError):
        processor.sample_value(
            latitude=17.3850,
            longitude=78.4867,
        )


def test_get_metadata_not_implemented():
    processor = RasterProcessor()

    with pytest.raises(NotImplementedError):
        processor.get_metadata()
