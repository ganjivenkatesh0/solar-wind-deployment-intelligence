"""SRTM elevation and terrain data source client."""

import os
from pathlib import Path
from typing import Any

import math

import numpy as np
import rasterio


class SRTMClient:
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

    def get_elevation(
        self,
        latitude: float,
        longitude: float,
    ) -> dict[str, Any]:
        """
        Retrieve elevation for a geographic coordinate.

        Elevation is returned in metres.
        """

        self._validate_coordinates(latitude, longitude)

        with self._open_raster() as src:
            self._validate_coverage(src, latitude, longitude)

            value = next(
                src.sample([(longitude, latitude)])
            )[0]

            elevation = float(value)

            if self._is_nodata(src, elevation):
                raise RuntimeError(
                    "SRTM returned NoData for "
                    "the requested location."
                )

            return {
                "elevation": round(elevation, 2),
                "unit": "m",
                "source": "SRTM",
                "latitude": latitude,
                "longitude": longitude,
            }

    def get_slope(
        self,
        latitude: float,
        longitude: float,
    ) -> dict[str, Any]:
        """
        Calculate local terrain slope from a 3x3 SRTM DEM neighborhood.

        Slope is calculated using the Horn method and returned in degrees.
        """

        self._validate_coordinates(latitude, longitude)

        with self._open_raster() as src:
            self._validate_coverage(src, latitude, longitude)

            row, col = src.index(longitude, latitude)

            if (
                row <= 0
                or row >= src.height - 1
                or col <= 0
                or col >= src.width - 1
            ):
                raise ValueError(
                    "Requested coordinates are too close to "
                    "the SRTM raster boundary for slope calculation."
                )

            window = rasterio.windows.Window(
                col_off=col - 1,
                row_off=row - 1,
                width=3,
                height=3,
            )

            data = src.read(1, window=window).astype(float)

            if data.shape != (3, 3):
                raise RuntimeError(
                    "Unable to retrieve the required 3x3 "
                    "SRTM neighborhood."
                )

            if src.nodata is not None:
                if np.any(data == src.nodata):
                    raise RuntimeError(
                        "SRTM returned NoData in the terrain "
                        "neighborhood."
                    )

            if np.any(~np.isfinite(data)):
                raise RuntimeError(
                    "SRTM returned invalid elevation values "
                    "in the terrain neighborhood."
                )

            # SRTM is EPSG:4326, so raster resolution is in degrees.
            # Convert degrees to approximate metres at the requested latitude.
            latitude_m_per_degree = 111_320.0
            longitude_m_per_degree = (
                111_320.0 * math.cos(math.radians(latitude))
            )

            cell_size_y = abs(src.transform.e) * latitude_m_per_degree
            cell_size_x = (
                abs(src.transform.a) * longitude_m_per_degree
            )

            if cell_size_x <= 0 or cell_size_y <= 0:
                raise RuntimeError(
                    "Invalid SRTM raster resolution."
                )

            # Horn method.
            dz_dx = (
                (data[0, 2] + 2 * data[1, 2] + data[2, 2])
                - (data[0, 0] + 2 * data[1, 0] + data[2, 0])
            ) / (8.0 * cell_size_x)

            dz_dy = (
                (data[2, 0] + 2 * data[2, 1] + data[2, 2])
                - (data[0, 0] + 2 * data[0, 1] + data[0, 2])
            ) / (8.0 * cell_size_y)

            slope_degrees = math.degrees(
                math.atan(
                    math.sqrt(
                        dz_dx**2 + dz_dy**2
                    )
                )
            )

            return {
                "slope": round(slope_degrees, 2),
                "unit": "degrees",
                "source": "SRTM",
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
