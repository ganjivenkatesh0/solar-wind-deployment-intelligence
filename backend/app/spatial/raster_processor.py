"""Raster processing skeleton for future GIS operations."""

from pathlib import Path
from typing import Any


class RasterProcessor:
    """
    Handles raster dataset operations.

    This class defines the interface for loading raster datasets,
    sampling values at geographic coordinates, and retrieving
    raster metadata.

    Actual raster processing will be implemented in future
    iterations using Rasterio.
    """

    def __init__(self) -> None:
        """Initialize the raster processor."""

        self.raster = None
        self.file_path: Path | None = None

    def load_raster(self, file_path: str) -> None:
        """
        Load a raster dataset.

        Parameters
        ----------
        file_path : str
            Path to the raster dataset.

        Raises
        ------
        NotImplementedError
            Raster loading is not implemented yet.
        """

        self.file_path = Path(file_path)

        raise NotImplementedError(
            "Raster loading will be implemented using Rasterio."
        )

    def sample_value(
        self,
        latitude: float,
        longitude: float,
    ) -> float:
        """
        Sample a raster value at the given coordinate.

        Parameters
        ----------
        latitude : float
            Latitude coordinate.

        longitude : float
            Longitude coordinate.

        Returns
        -------
        float
            Sampled raster value.

        Raises
        ------
        NotImplementedError
            Raster sampling is not implemented yet.
        """

        raise NotImplementedError(
            "Raster sampling will be implemented later."
        )

    def get_metadata(self) -> dict[str, Any]:
        """
        Return raster metadata.

        Returns
        -------
        dict
            Metadata describing the raster.

        Raises
        ------
        NotImplementedError
            Metadata extraction is not implemented yet.
        """

        raise NotImplementedError(
            "Metadata extraction will be implemented later."
        )
