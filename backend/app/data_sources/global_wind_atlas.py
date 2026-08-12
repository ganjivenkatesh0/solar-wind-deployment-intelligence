"""Global Wind Atlas local raster data source client."""

import os
from pathlib import Path
from typing import Any

import math
import rasterio


class GlobalWindAtlasClient:
    """Client for retrieving wind-speed data from Global Wind Atlas."""

    DEFAULT_HEIGHT_M = 50

    def __init__(
        self,
        raster_path: str | Path | None = None,
        height_m: int = DEFAULT_HEIGHT_M,
    ) -> None:
        self.height_m = height_m

        if raster_path is None:
            raster_path = os.getenv("GWA_RASTER_PATH")

        if raster_path is None:
            raster_path = (
                Path(__file__).resolve().parents[3]
                / "datasets"
                / "raw"
                / "global_wind_atlas"
                / "IND_wind-speed_50m.tif"
            )

        self.raster_path = Path(raster_path)

    def get_wind_data(
        self,
        latitude: float,
        longitude: float,
    ) -> dict[str, Any]:
        """
        Retrieve location-specific wind speed from the GWA raster.

        Wind speed is returned in metres per second at the configured
        measurement height.
        """

        self._validate_coordinates(latitude, longitude)

        if not self.raster_path.exists():
            raise RuntimeError(
                f"Global Wind Atlas raster not found: {self.raster_path}"
            )

        try:
            with rasterio.open(self.raster_path) as src:
                if not self._is_inside_raster(src, latitude, longitude):
                    raise ValueError(
                        "Requested coordinates are outside the "
                        "Global Wind Atlas raster coverage."
                    )

                value = next(
                    src.sample([(longitude, latitude)])
                )[0]

                wind_speed = float(value)

                if math.isnan(wind_speed):
                    raise RuntimeError(
                        "Global Wind Atlas returned NoData for "
                        "the requested location."
                    )

                return {
                    "wind_speed": round(wind_speed, 4),
                    "height_m": self.height_m,
                    "source": "Global Wind Atlas",
                    "unit": "m/s",
                    "latitude": latitude,
                    "longitude": longitude,
                }

        except ValueError:
            raise

        except rasterio.errors.RasterioError as exc:
            raise RuntimeError(
                f"Unable to read Global Wind Atlas raster: {exc}"
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
    def _is_inside_raster(
        src,
        latitude: float,
        longitude: float,
    ) -> bool:
        """Check whether coordinates fall inside raster coverage."""

        bounds = src.bounds

        return (
            bounds.left <= longitude <= bounds.right
            and bounds.bottom <= latitude <= bounds.top
        )
