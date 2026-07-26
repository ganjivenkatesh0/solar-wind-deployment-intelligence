class CapacityPlanner:
    """
    Service responsible for estimating the recommended
    installation capacity for a renewable energy site.
    """

    @staticmethod
    def recommend_capacity(
        land_area_hectares: float,
        overall_site_score: float,
    ) -> float:
        """
        Estimate recommended installation capacity (MW)
        using configurable land-area and site-score rules.
        """

        # Base capacity determined by land area
        if land_area_hectares < 10:
            capacity = 10.0

        elif land_area_hectares < 25:
            capacity = 25.0

        elif land_area_hectares < 50:
            capacity = 50.0

        else:
            capacity = 100.0

        # Adjust capacity using site suitability
        if overall_site_score >= 90:
            multiplier = 1.20

        elif overall_site_score >= 80:
            multiplier = 1.10

        elif overall_site_score >= 70:
            multiplier = 1.00

        elif overall_site_score >= 60:
            multiplier = 0.80

        else:
            multiplier = 0.50

        return round(capacity * multiplier, 2)