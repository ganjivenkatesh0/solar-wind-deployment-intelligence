from app.data_sources.global_wind_atlas import GlobalWindAtlasClient


def test_global_wind_atlas_returns_location_specific_wind_speed():
    client = GlobalWindAtlasClient()

    result = client.get_wind_data(
        latitude=17.3850,
        longitude=78.4867,
    )

    assert result["source"] in {
        "Global Wind Atlas",
        "Open-Meteo wind fallback",
    }
    assert result["height_m"] in {10, 50}
    assert result["unit"] == "m/s"
    assert result["wind_speed"] > 0
    assert result["latitude"] == 17.3850
    assert result["longitude"] == 78.4867


def test_global_wind_atlas_rejects_invalid_coordinates():
    client = GlobalWindAtlasClient()

    try:
        client.get_wind_data(100, 78.4867)
        assert False, "Invalid latitude was accepted"
    except ValueError:
        pass

    try:
        client.get_wind_data(17.3850, 200)
        assert False, "Invalid longitude was accepted"
    except ValueError:
        pass
