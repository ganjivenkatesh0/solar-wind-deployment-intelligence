from app.data_sources.srtm import SRTMClient


def test_srtm_returns_location_specific_elevation():
    client = SRTMClient()

    result = client.get_elevation(
        latitude=17.3850,
        longitude=78.4867,
    )

    assert result["source"] == "SRTM"
    assert result["unit"] == "m"
    assert result["elevation"] > 0
    assert result["latitude"] == 17.3850
    assert result["longitude"] == 78.4867


def test_srtm_returns_local_slope():
    client = SRTMClient()

    result = client.get_slope(
        latitude=17.3850,
        longitude=78.4867,
    )

    assert result["source"] == "SRTM"
    assert result["unit"] == "degrees"
    assert result["slope"] >= 0
    assert result["latitude"] == 17.3850
    assert result["longitude"] == 78.4867


def test_srtm_returns_combined_terrain_data():
    client = SRTMClient()

    result = client.get_terrain_data(
        latitude=17.3850,
        longitude=78.4867,
    )

    assert result["source"] == "SRTM"
    assert result["elevation"] > 0
    assert result["slope"] >= 0
    assert result["elevation_unit"] == "m"
    assert result["slope_unit"] == "degrees"


def test_srtm_rejects_invalid_coordinates():
    client = SRTMClient()

    try:
        client.get_elevation(100, 78.4867)
        assert False, "Invalid latitude was accepted"
    except ValueError:
        pass

    try:
        client.get_elevation(17.3850, 200)
        assert False, "Invalid longitude was accepted"
    except ValueError:
        pass


def test_srtm_returns_different_elevations_for_different_locations():
    client = SRTMClient()

    hyderabad = client.get_elevation(
        17.3850,
        78.4867,
    )

    hyderabad_north = client.get_elevation(
        17.4500,
        78.5000,
    )

    assert hyderabad["elevation"] != hyderabad_north["elevation"]
