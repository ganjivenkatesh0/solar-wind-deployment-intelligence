from app.data_sources.nasa_power import NasaPowerClient


class SolarFeatureService:
    """Service for retrieving solar environmental features."""

    def __init__(self):
        self.nasa_client = NasaPowerClient()

    def get_solar_features(self, latitude: float, longitude: float):
        """
        Retrieve processed solar environmental features for a location.
        """

        raw_data = self.nasa_client.fetch_data(latitude, longitude)

        return self.nasa_client.extract_features(raw_data)