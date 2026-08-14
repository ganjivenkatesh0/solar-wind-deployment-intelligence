"""OpenStreetMap (OSM) infrastructure data source client."""

import math
from typing import Any

import requests


class OSMClient:
    """Client for retrieving nearby infrastructure from OpenStreetMap."""

    OVERPASS_URL = "https://overpass-api.de/api/interpreter"
    OVERPASS_URLS = [
        OVERPASS_URL,
        "https://overpass.kumi.systems/api/interpreter",
        "https://lz4.overpass-api.de/api/interpreter",
    ]

    def __init__(self, timeout: int = 30):
        self.timeout = timeout

    @staticmethod
    def _validate_coordinates(latitude: float, longitude: float) -> None:
        if not (-90 <= latitude <= 90):
            raise ValueError("Latitude must be between -90 and 90.")

        if not (-180 <= longitude <= 180):
            raise ValueError("Longitude must be between -180 and 180.")

    @staticmethod
    def _distance_km(
        latitude_1: float,
        longitude_1: float,
        latitude_2: float,
        longitude_2: float,
    ) -> float:
        """Calculate great-circle distance between two coordinates."""

        earth_radius_km = 6371.0

        lat1 = math.radians(latitude_1)
        lat2 = math.radians(latitude_2)
        delta_lat = math.radians(latitude_2 - latitude_1)
        delta_lon = math.radians(longitude_2 - longitude_1)

        a = (
            math.sin(delta_lat / 2) ** 2
            + math.cos(lat1)
            * math.cos(lat2)
            * math.sin(delta_lon / 2) ** 2
        )

        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

        return earth_radius_km * c

    @staticmethod
    def _nearest_element_distance(
        latitude: float,
        longitude: float,
        elements: list[dict[str, Any]],
    ) -> float | None:
        """Return distance to the nearest usable OSM element."""

        distances = []

        for element in elements:
            element_lat = element.get("lat")
            element_lon = element.get("lon")

            # Nodes have lat/lon directly.
            if element_lat is not None and element_lon is not None:
                distances.append(
                    OSMClient._distance_km(
                        latitude,
                        longitude,
                        float(element_lat),
                        float(element_lon),
                    )
                )
                continue

            # Ways usually contain geometry points.
            geometry = element.get("geometry", [])

            for point in geometry:
                point_lat = point.get("lat")
                point_lon = point.get("lon")

                if point_lat is None or point_lon is None:
                    continue

                distances.append(
                    OSMClient._distance_km(
                        latitude,
                        longitude,
                        float(point_lat),
                        float(point_lon),
                    )
                )

        if not distances:
            return None

        return round(min(distances), 3)

    def _query_overpass(
        self,
        latitude: float,
        longitude: float,
        radius_m: int,
    ) -> dict[str, Any]:
        """Query nearby infrastructure from the Overpass API."""

        query = f"""
        [out:json][timeout:{self.timeout}];
        (
          way(around:{radius_m},{latitude},{longitude})["highway"];
          way(around:{radius_m},{latitude},{longitude})["power"="line"];
          node(around:{radius_m},{latitude},{longitude})["power"="substation"];
          way(around:{radius_m},{latitude},{longitude})["power"="substation"];
        );
        out geom;
        """

        last_error = None

        for overpass_url in self.OVERPASS_URLS:
            try:
                response = requests.post(
                    overpass_url,
                    data={"data": query},
                    headers={
                        "User-Agent": (
                            "SolarWindDeploymentIntelligence/1.0 "
                            "(renewable-energy-analysis-project)"
                        ),
                        "Referer": "https://www.openstreetmap.org/",
                    },
                    timeout=self.timeout,
                )
                response.raise_for_status()
                try:
                    return response.json()
                except ValueError as exc:
                    last_error = exc
            except requests.RequestException as exc:
                last_error = exc

        raise ConnectionError(
            "Unable to connect to the OpenStreetMap Overpass API using all configured endpoints."
        ) from last_error

    def get_infrastructure_data(
        self,
        bounding_box: dict[str, float],
        radius_m: int = 5000,
    ) -> dict[str, Any]:
        """
        Retrieve nearby infrastructure from OpenStreetMap.

        Args:
            bounding_box:
                Dictionary containing:
                    latitude
                    longitude
                Optional:
                    radius_m

            radius_m:
                Search radius in metres.

        Returns:
            Dictionary containing OSM-derived infrastructure distances.

        Raises:
            ValueError:
                If coordinates or radius are invalid.
            ConnectionError:
                If the Overpass API cannot be reached.
            RuntimeError:
                If infrastructure data cannot be processed.
        """

        if not isinstance(bounding_box, dict):
            raise ValueError("bounding_box must be a dictionary.")

        try:
            latitude = float(bounding_box["latitude"])
            longitude = float(bounding_box["longitude"])
        except (KeyError, TypeError, ValueError) as exc:
            raise ValueError(
                "bounding_box must contain valid latitude and longitude."
            ) from exc

        self._validate_coordinates(latitude, longitude)

        if radius_m <= 0:
            raise ValueError("radius_m must be greater than zero.")

        result = self._query_overpass(
            latitude=latitude,
            longitude=longitude,
            radius_m=radius_m,
        )

        elements = result.get("elements", [])

        road_elements = [
            element
            for element in elements
            if element.get("tags", {}).get("highway")
        ]

        power_line_elements = [
            element
            for element in elements
            if element.get("tags", {}).get("power") == "line"
        ]

        substation_elements = [
            element
            for element in elements
            if element.get("tags", {}).get("power") == "substation"
        ]

        road_distance = self._nearest_element_distance(
            latitude,
            longitude,
            road_elements,
        )

        power_line_distance = self._nearest_element_distance(
            latitude,
            longitude,
            power_line_elements,
        )

        substation_distance = self._nearest_element_distance(
            latitude,
            longitude,
            substation_elements,
        )

        grid_distances = [
            distance
            for distance in (
                power_line_distance,
                substation_distance,
            )
            if distance is not None
        ]

        grid_distance = min(grid_distances) if grid_distances else None

        return {
            "latitude": latitude,
            "longitude": longitude,
            "search_radius_m": radius_m,
            "road_distance_km": road_distance,
            "power_line_distance_km": power_line_distance,
            "substation_distance_km": substation_distance,
            "grid_distance_km": (
                round(grid_distance, 3)
                if grid_distance is not None
                else None
            ),
            "road_features_found": len(road_elements),
            "power_line_features_found": len(power_line_elements),
            "substation_features_found": len(substation_elements),
            "source": "OpenStreetMap Overpass API",
        }
