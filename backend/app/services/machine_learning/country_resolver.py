"""Resolve latitude/longitude to a country ISO-3 code."""

from typing import Any

import requests


class CountryResolver:
    """Resolve geographic coordinates to an ISO-3166 alpha-3 country code."""

    BASE_URL = "https://nominatim.openstreetmap.org/reverse"

    # ISO-3166 alpha-2 → alpha-3 mapping for countries used by the ML dataset.
    # Extend this mapping as additional countries are required.
    COUNTRY_CODES = {
        "in": "IND",
        "us": "USA",
        "cn": "CHN",
        "de": "DEU",
        "fr": "FRA",
        "gb": "GBR",
        "au": "AUS",
        "br": "BRA",
        "ca": "CAN",
        "jp": "JPN",
        "ru": "RUS",
        "za": "ZAF",
        "ae": "ARE",
        "sa": "SAU",
        "sg": "SGP",
        "id": "IDN",
        "my": "MYS",
        "bd": "BGD",
        "pk": "PAK",
        "lk": "LKA",
        "np": "NPL",
        "af": "AFG",
    }

    def __init__(self, timeout: float = 10.0):
        self.timeout = timeout

    def resolve_iso_code(
        self,
        latitude: float,
        longitude: float,
    ) -> str:
        """Return the ISO-3166 alpha-3 country code."""

        if not (-90 <= latitude <= 90):
            raise ValueError("Latitude must be between -90 and 90.")

        if not (-180 <= longitude <= 180):
            raise ValueError("Longitude must be between -180 and 180.")

        try:
            response = requests.get(
                self.BASE_URL,
                params={
                    "lat": latitude,
                    "lon": longitude,
                    "format": "jsonv2",
                    "zoom": 3,
                    "addressdetails": 1,
                },
                headers={
                    "User-Agent": (
                        "SolarWindDeploymentIntelligence/1.0 "
                        "(renewable-energy-analysis-project)"
                    ),
                },
                timeout=self.timeout,
            )

            response.raise_for_status()
            data: dict[str, Any] = response.json()

        except requests.RequestException as exc:
            raise RuntimeError(
                f"Unable to resolve country for coordinates: {exc}"
            ) from exc

        address = data.get("address", {})
        country_code = str(
            address.get("country_code", "")
        ).lower()

        if not country_code:
            raise ValueError(
                "Country code was not returned for the provided coordinates."
            )

        iso_code = self.COUNTRY_CODES.get(country_code)

        if not iso_code:
            raise ValueError(
                f"Unsupported country code returned by geocoder: "
                f"{country_code}"
            )

        return iso_code
