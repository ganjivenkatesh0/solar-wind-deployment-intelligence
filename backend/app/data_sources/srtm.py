"""SRTM elevation and terrain data source client."""

import os
from pathlib import Path
from typing import Any

import math

import numpy as np
import rasterio
import requests


class SRTMClient:
    REMOTE_TERRAIN_URL = "https://api.opentopodata.org/v1/srtm30m"
    REMOTE_TIMEOUT_SECONDS = 20
    """Client for retrieving elevation and terrain data from an SRTM raster."""

    def __init__(
        self,
        raster_path: str | Path | None = None,
    ) -> None:
        if raster_path is None:
            raster_path = os.getenv("SRTM_RASTER_PATH")

        if raster_path is None:
            raster_path = (
                Path(__file__).resolve().parents[3]
                / "datasets"
                / "raw"
                / "srtm"
                / "output_SRTMGL1.tif"
            )

        self.raster_path = Path(raster_path)

    def get_elevation(self, latitude: float, longitude: float) -> dict:
        """
        Return location-specific elevation.

        Local SRTM is preferred when the coordinate is inside the bundled
        raster. If the local raster does not cover the coordinate, use the
        OpenTopoData SRTM30m service as a remote fallback.
        """
        if not (-90 <= latitude <= 90):
            raise ValueError("Latitude must be between -90 and 90.")

        if not (-180 <= longitude <= 180):
            raise ValueError("Longitude must be between -180 and 180.")

        try:
            with rasterio.open(self.raster_path) as src:
                if (
                    src.bounds.left <= longitude <= src.bounds.right
                    and src.bounds.bottom <= latitude <= src.bounds.top
                ):
                    row, col = src.index(longitude, latitude)
                    elevation = float(src.read(1)[row, col])

                    if elevation != src.nodata:
                        return {
                            "elevation": round(elevation, 2),
                            "unit": "m",
                            "source": "SRTM",
                            "latitude": latitude,
                            "longitude": longitude,
                        }
        except (IndexError, rasterio.errors.RasterioError):
            pass

        return self._get_remote_elevation(latitude, longitude)

    def _get_remote_elevations(
        self,
        locations: list[tuple[float, float]],
    ) -> dict[tuple[float, float], float]:
        """
        Retrieve multiple SRTM elevations using one OpenTopoData request.

        This avoids making several rapid requests when calculating remote
        terrain slope.
        """
        if not locations:
            return {}

        # Remove duplicates while preserving order.
        unique_locations = list(dict.fromkeys(locations))

        location_string = "|".join(
            f"{latitude},{longitude}"
            for latitude, longitude in unique_locations
        )

        response = requests.get(
            self.REMOTE_TERRAIN_URL,
            params={"locations": location_string},
            headers={
                "User-Agent": "SolarWindDeploymentIntelligence/1.0"
            },
            timeout=self.REMOTE_TIMEOUT_SECONDS,
        )

        if response.status_code == 429:
            raise ValueError(
                "Remote terrain service is temporarily rate limited."
            )

        response.raise_for_status()

        payload = response.json()
        results = payload.get("results") or []

        if len(results) != len(unique_locations):
            raise ValueError(
                "Terrain elevation is unavailable for the selected location."
            )

        elevations = {}

        for location, result in zip(unique_locations, results):
            elevation = result.get("elevation")

            if elevation is None:
                raise ValueError(
                    "Terrain elevation is unavailable for the selected location."
                )

            elevations[location] = float(elevation)

        return elevations

    def _get_remote_elevations(
        self,
        locations: list[tuple[float, float]],
    ) -> dict[tuple[float, float], float]:
        """
        Retrieve multiple SRTM elevations using one OpenTopoData request.

        This avoids making several rapid requests when calculating remote
        terrain slope.
        """
        if not locations:
            return {}

        # Remove duplicates while preserving order.
        unique_locations = list(dict.fromkeys(locations))

        location_string = "|".join(
            f"{latitude},{longitude}"
            for latitude, longitude in unique_locations
        )

        response = requests.get(
            self.REMOTE_TERRAIN_URL,
            params={"locations": location_string},
            headers={
                "User-Agent": "SolarWindDeploymentIntelligence/1.0"
            },
            timeout=self.REMOTE_TIMEOUT_SECONDS,
        )

        if response.status_code == 429:
            raise ValueError(
                "Remote terrain service is temporarily rate limited."
            )

        response.raise_for_status()

        payload = response.json()
        results = payload.get("results") or []

        if len(results) != len(unique_locations):
            raise ValueError(
                "Terrain elevation is unavailable for the selected location."
            )

        elevations = {}

        for location, result in zip(unique_locations, results):
            elevation = result.get("elevation")

            if elevation is None:
                raise ValueError(
                    "Terrain elevation is unavailable for the selected location."
                )

            elevations[location] = float(elevation)

        return elevations

    def _get_remote_elevation(
        self,
        latitude: float,
        longitude: float,
    ) -> dict:
        """
        Retrieve one remote SRTM elevation.
        """
        elevations = self._get_remote_elevations(
            [(latitude, longitude)]
        )

        return {
            "elevation": round(
                elevations[(latitude, longitude)],
                2,
            ),
            "unit": "m",
            "source": "OpenTopoData SRTM30m",
            "latitude": latitude,
            "longitude": longitude,
        }

    def get_slope(self, latitude: float, longitude: float) -> dict:
        """
        Return location-specific terrain slope.

        Local SRTM is used when available. Otherwise, remote SRTM30m
        elevations are sampled in one batched request.
        """
        import math

        try:
            with rasterio.open(self.raster_path) as src:
                if (
                    src.bounds.left <= longitude <= src.bounds.right
                    and src.bounds.bottom <= latitude <= src.bounds.top
                ):
                    row, col = src.index(longitude, latitude)

                    window = 1
                    r0 = max(0, row - window)
                    r1 = min(src.height, row + window + 1)
                    c0 = max(0, col - window)
                    c1 = min(src.width, col + window + 1)

                    raster = src.read(1)
                    elevations = raster[r0:r1, c0:c1]

                    valid = elevations[elevations != src.nodata]

                    if valid.size > 1:
                        elevation_range = float(
                            valid.max() - valid.min()
                        )

                        pixel_lat_km = abs(
                            float(src.res[1])
                        ) * 111.32

                        pixel_lon_km = (
                            abs(float(src.res[0]))
                            * 111.32
                            * max(
                                abs(
                                    math.cos(
                                        math.radians(latitude)
                                    )
                                ),
                                0.01,
                            )
                        )

                        horizontal_km = max(
                            (
                                (2 * pixel_lat_km) ** 2
                                + (2 * pixel_lon_km) ** 2
                            ) ** 0.5,
                            0.001,
                        )

                        slope_degrees = math.degrees(
                            math.atan(
                                elevation_range
                                / (horizontal_km * 1000)
                            )
                        )

                        return {
                            "slope": round(
                                max(slope_degrees, 0.0),
                                2,
                            ),
                            "unit": "degrees",
                            "source": "SRTM",
                            "latitude": latitude,
                            "longitude": longitude,
                        }

        except (IndexError, rasterio.errors.RasterioError):
            pass

        # ----------------------------------------------------
        # Remote fallback.
        # One request containing all four neighbouring points.
        # ----------------------------------------------------

        delta = 0.01

        west = (latitude, longitude - delta)
        east = (latitude, longitude + delta)
        south = (latitude - delta, longitude)
        north = (latitude + delta, longitude)

        elevations = self._get_remote_elevations(
            [west, east, south, north]
        )

        west_elevation = elevations[west]
        east_elevation = elevations[east]
        south_elevation = elevations[south]
        north_elevation = elevations[north]

        lat_distance_m = delta * 111_320.0

        lon_distance_m = (
            delta
            * 111_320.0
            * max(
                abs(math.cos(math.radians(latitude))),
                0.01,
            )
        )

        east_west_gradient = abs(
            east_elevation - west_elevation
        ) / (2 * lon_distance_m)

        north_south_gradient = abs(
            north_elevation - south_elevation
        ) / (2 * lat_distance_m)

        gradient = max(
            east_west_gradient,
            north_south_gradient,
        )

        slope_degrees = math.degrees(
            math.atan(gradient)
        )

        return {
            "slope": round(
                max(slope_degrees, 0.0),
                2,
            ),
            "unit": "degrees",
            "source": "OpenTopoData SRTM30m",
            "latitude": latitude,
            "longitude": longitude,
        }

    def get_terrain_data(
        self,
        latitude: float,
        longitude: float,
    ) -> dict[str, Any]:
        """
        Retrieve both elevation and local slope for a location.
        """

        elevation = self.get_elevation(
            latitude=latitude,
            longitude=longitude,
        )

        slope = self.get_slope(
            latitude=latitude,
            longitude=longitude,
        )

        return {
            "elevation": elevation["elevation"],
            "elevation_unit": elevation["unit"],
            "slope": slope["slope"],
            "slope_unit": slope["unit"],
            "source": "SRTM",
            "latitude": latitude,
            "longitude": longitude,
        }

    def _open_raster(self):
        """Open the SRTM raster and translate raster errors."""

        if not self.raster_path.exists():
            raise RuntimeError(
                f"SRTM raster not found: {self.raster_path}"
            )

        try:
            return rasterio.open(self.raster_path)
        except rasterio.errors.RasterioError as exc:
            raise RuntimeError(
                f"Unable to read SRTM raster: {exc}"
            ) from exc

    @staticmethod
    def _validate_coordinates(
        latitude: float,
        longitude: float,
    ) -> None:
        """Validate geographic coordinates."""

        if not -90 <= latitude <= 90:
            raise ValueError(
                "Latitude must be between -90 and 90."
            )

        if not -180 <= longitude <= 180:
            raise ValueError(
                "Longitude must be between -180 and 180."
            )

    @staticmethod
    def _validate_coverage(
        src,
        latitude: float,
        longitude: float,
    ) -> None:
        """Validate that coordinates are inside raster coverage."""

        bounds = src.bounds

        if not (
            bounds.left <= longitude <= bounds.right
            and bounds.bottom <= latitude <= bounds.top
        ):
            raise ValueError(
                "Requested coordinates are outside "
                "the SRTM raster coverage."
            )

    @staticmethod
    def _is_nodata(
        src,
        value: float,
    ) -> bool:
        """Check whether an elevation value represents NoData."""

        if not math.isfinite(value):
            return True

        if src.nodata is not None and value == src.nodata:
            return True

        return False
