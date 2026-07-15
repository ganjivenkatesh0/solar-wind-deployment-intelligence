"""NASA POWER data source client."""


class NASAPowerClient:
    """Client for retrieving solar-related data from NASA POWER dataset."""

    def get_solar_data(self, latitude: float, longitude: float):
        """
        Retrieve solar-related data.

        Args:
            latitude: Location latitude coordinate
            longitude: Location longitude coordinate

        Returns:
            Solar dataset containing radiation, insolation, and other parameters

        Raises:
            ValueError: If coordinates are invalid
            ConnectionError: If unable to connect to NASA POWER API
            RuntimeError: If data retrieval fails
        """
        raise NotImplementedError
