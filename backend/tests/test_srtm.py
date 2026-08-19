from unittest.mock import patch

from app.data_sources.srtm import SRTMClient


def test_srtm_returns_location_specific_elevation():
    client = SRTMClient()

    result = client.get_elevation(
        latitude=17.3850,
        longitude=78.4867,
    )

    assert result["source"] in {"SRTM", "OpenTopoData SRTM30m"}
    assert result["unit"] == "m"
    assert result["elevation"] > 0


def test_srtm_returns_local_slope():
    client = SRTMClient()

    result = client.get_slope(
        latitude=17.3850,
        longitude=78.4867,
    )

    assert result["source"] in {"SRTM", "OpenTopoData SRTM30m"}
    assert result["unit"] == "degrees"
    assert result["slope"] >= 0


def test_srtm_returns_combined_terrain_data():
    client = SRTMClient()

    result = client.get_terrain_data(
        latitude=17.3850,
        longitude=78.4867,
    )

    assert result["elevation"] > 0
    assert result["slope"] >= 0
    assert result["elevation_unit"] == "m"
    assert result["slope_unit"] == "degrees"


def test_srtm_remote_fallback_elevation():
    client = SRTMClient()

    mocked = {
        (21.2711, 81.7362): 293.0,
    }

    with patch.object(
        client,
        "_get_remote_elevations",
        return_value=mocked,
    ):
        result = client.get_elevation(
            21.2711,
            81.7362,
        )

    assert result["elevation"] == 293.0
    assert result["unit"] == "m"
    assert result["source"] == "OpenTopoData SRTM30m"


def test_srtm_remote_fallback_slope():
    client = SRTMClient()

    delta = 0.01

    mocked = {
        (21.2711, 81.7362 - delta): 290.0,
        (21.2711, 81.7362 + delta): 296.0,
        (21.2711 - delta, 81.7362): 292.0,
        (21.2711 + delta, 81.7362): 294.0,
    }

    with patch.object(
        client,
        "_get_remote_elevations",
        return_value=mocked,
    ):
        result = client.get_slope(
            21.2711,
            81.7362,
        )

    assert result["slope"] >= 0
    assert result["unit"] == "degrees"
    assert result["source"] == "OpenTopoData SRTM30m"


def test_srtm_remote_fallback_combined_terrain():
    client = SRTMClient()

    center = (21.2711, 81.7362)
    delta = 0.01

    mocked = {
        center: 293.0,
        (21.2711, 81.7362 - delta): 290.0,
        (21.2711, 81.7362 + delta): 296.0,
        (21.2711 - delta, 81.7362): 292.0,
        (21.2711 + delta, 81.7362): 294.0,
    }

    with patch.object(
        client,
        "_get_remote_elevations",
        return_value=mocked,
    ):
        result = client.get_terrain_data(
            21.2711,
            81.7362,
        )

    assert result["elevation"] == 293.0
    assert result["slope"] >= 0
    assert result["elevation_unit"] == "m"
    assert result["slope_unit"] == "degrees"


def test_srtm_invalid_coordinates():
    client = SRTMClient()

    try:
        client.get_elevation(100, 78.4867)
        assert False
    except ValueError:
        assert True

    try:
        client.get_elevation(17.3850, 200)
        assert False
    except ValueError:
        assert True
