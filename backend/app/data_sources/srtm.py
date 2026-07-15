"""SRTM (Shuttle Radar Topography Mission) data source client."""


class SRTMClient:
    """Client for retrieving terrain information from SRTM dataset."""

    def get_terrain_data(self, latitude: float, longitude: float):
        """
        Retrieve terrain information.

        Args:
            latitude: Location latitude coordinate
            longitude: Location longitude coordinate

        Returns:
            Elevation and slope data for the specified location

        Raises:
            ValueError: If coordinates are invalid
            ConnectionError: If unable to connect to SRTM data source
            RuntimeError: If terrain data retrieval fails
        """
        raise NotImplementedError
