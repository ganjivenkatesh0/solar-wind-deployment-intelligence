"""Sentinel-2 / EuroSAT land-cover suitability intelligence."""

from typing import Final


class Sentinel2Service:
    """Convert Sentinel-2 land-cover classes into deployment suitability."""

    CLASS_SCORES: Final[dict[str, float]] = {
        "AnnualCrop": 70.0,
        "Forest": 10.0,
        "HerbaceousVegetation": 60.0,
        "Highway": 20.0,
        "Industrial": 85.0,
        "Pasture": 65.0,
        "PermanentCrop": 60.0,
        "Residential": 10.0,
        "River": 5.0,
        "SeaLake": 5.0,
    }

    def get_suitability_score(self, land_cover_class: str) -> float:
        """Return renewable deployment suitability for a land-cover class."""

        if not land_cover_class:
            raise ValueError("Land-cover class is required.")

        normalized = land_cover_class.strip()

        if normalized not in self.CLASS_SCORES:
            raise ValueError(
                f"Unsupported Sentinel-2 land-cover class: {land_cover_class}"
            )

        return self.CLASS_SCORES[normalized]

    def analyze_land_cover(self, land_cover_class: str) -> dict[str, object]:
        """Return land-cover classification and suitability information."""

        score = self.get_suitability_score(land_cover_class)

        return {
            "land_cover_class": land_cover_class.strip(),
            "suitability_score": score,
            "source": "Sentinel-2 / EuroSAT",
        }
