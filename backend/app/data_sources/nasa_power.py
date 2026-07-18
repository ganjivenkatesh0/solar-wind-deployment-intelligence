"""NASA POWER data source client."""

from typing import Any, Dict

import httpx


class NasaPowerClient:
    """Client for retrieving environmental data from the NASA POWER API."""

    BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"

    def fetch_data(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """
        Fetch raw environmental data from the NASA POWER API.

        Args:
            latitude: Latitude (-90 to 90)
            longitude: Longitude (-180 to 180)

        Returns:
            Raw JSON response from NASA POWER.

        Raises:
            ValueError: If coordinates are invalid.
            RuntimeError: If the API request fails.
        """

        if not (-90 <= latitude <= 90):
            raise ValueError("Latitude must be between -90 and 90.")

        if not (-180 <= longitude <= 180):
            raise ValueError("Longitude must be between -180 and 180.")

        params = {
            "parameters": "ALLSKY_SFC_SW_DWN,T2M,RH2M",
            "community": "RE",
            "latitude": latitude,
            "longitude": longitude,
            "start": "20250101",
            "end": "20250101",
            "format": "JSON",
        }

        try:
            response = httpx.get(
                self.BASE_URL,
                params=params,
                timeout=30.0,
            )

            response.raise_for_status()

            return response.json()

        except httpx.RequestError as exc:
            raise RuntimeError(
                f"Unable to connect to the NASA POWER service: {exc}"
            ) from exc

        except httpx.HTTPStatusError as exc:
            raise RuntimeError(
                f"NASA POWER API returned HTTP {exc.response.status_code}"
            ) from exc

    def extract_features(self, raw_data: Dict[str, Any]) -> Dict[str, float]:
        """
        Extract the required environmental features from the NASA POWER response.

        Args:
            raw_data: Raw JSON response from NASA POWER.

        Returns:
            Dictionary containing the required solar features.

        Raises:
            ValueError: If expected data is missing.
        """

        try:
            parameters = raw_data["properties"]["parameter"]

            return {
                "solar_irradiance": next(iter(parameters["ALLSKY_SFC_SW_DWN"].values())),
                "temperature": next(iter(parameters["T2M"].values())),
                "relative_humidity": next(iter(parameters["RH2M"].values())),
            }

        except KeyError as exc:
            raise ValueError(
                f"Required parameter missing from NASA POWER response: {exc}"
            ) from exc
