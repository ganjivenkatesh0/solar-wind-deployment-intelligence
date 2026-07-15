"""Global Wind Atlas data source client."""


class GlobalWindAtlasClient:
    """Client for retrieving wind resource data from Global Wind Atlas."""

    def get_wind_data(self, latitude: float, longitude: float):
        """
        Retrieve wind resource data.

        Args:
            latitude: Location latitude coordinate
            longitude: Location longitude coordinate

        Returns:
            Wind dataset containing wind speed, direction, and power density

        Raises:
            ValueError: If coordinates are invalid
            ConnectionError: If unable to connect to Global Wind Atlas API
            RuntimeError: If data retrieval fails
        """
        raise NotImplementedError
