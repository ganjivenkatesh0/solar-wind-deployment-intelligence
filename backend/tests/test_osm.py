from unittest.mock import patch

import pytest

from app.data_sources.osm import OSMClient


def test_validate_coordinates_accepts_valid_coordinates():
    OSMClient._validate_coordinates(17.3850, 78.4867)


@pytest.mark.parametrize(
    "latitude,longitude",
    [
        (91.0, 78.4867),
        (-91.0, 78.4867),
        (17.3850, 181.0),
        (17.3850, -181.0),
    ],
)
def test_validate_coordinates_rejects_invalid_coordinates(
    latitude,
    longitude,
):
    with pytest.raises(ValueError):
        OSMClient._validate_coordinates(latitude, longitude)


def test_distance_km_returns_zero_for_same_point():
    distance = OSMClient._distance_km(
        17.3850,
        78.4867,
        17.3850,
        78.4867,
    )

    assert distance == pytest.approx(0.0)


def test_get_infrastructure_data_returns_expected_structure():
    client = OSMClient()

    mock_response = {
        "elements": [
            {
                "type": "way",
                "tags": {"highway": "primary"},
                "geometry": [
                    {"lat": 17.3851, "lon": 78.4867},
                    {"lat": 17.3860, "lon": 78.4867},
                ],
            },
            {
                "type": "way",
                "tags": {"power": "line"},
                "geometry": [
                    {"lat": 17.3900, "lon": 78.4867},
                ],
            },
            {
                "type": "node",
                "tags": {"power": "substation"},
                "lat": 17.3950,
                "lon": 78.4867,
            },
        ]
    }

    with patch.object(
        client,
        "_query_overpass",
        return_value=mock_response,
    ):
        result = client.get_infrastructure_data(
            {
                "latitude": 17.3850,
                "longitude": 78.4867,
            },
            radius_m=5000,
        )

    assert result["source"] == "OpenStreetMap Overpass API"
    assert result["road_distance_km"] is not None
    assert result["power_line_distance_km"] is not None
    assert result["substation_distance_km"] is not None
    assert result["grid_distance_km"] is not None
    assert result["road_features_found"] == 1
    assert result["power_line_features_found"] == 1
    assert result["substation_features_found"] == 1


def test_get_infrastructure_data_rejects_invalid_input():
    client = OSMClient()

    with pytest.raises(ValueError):
        client.get_infrastructure_data(
            {
                "latitude": 150,
                "longitude": 78.4867,
            }
        )