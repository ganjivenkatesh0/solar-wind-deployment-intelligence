class ExpansionAnalysis:
    """
    Service responsible for determining whether
    a renewable energy site has future expansion potential.
    """

    @staticmethod
    def analyze_expansion(
        land_area_hectares: float,
        infrastructure_score: float,
        overall_site_score: float,
    ) -> str:
        """
        Determine expansion feasibility using
        configurable land area, infrastructure,
        and site suitability rules.
        """

        # Excellent expansion opportunity
        if (
            land_area_hectares >= 50
            and infrastructure_score >= 80
            and overall_site_score >= 80
        ):
            return "Expandable"

        # Moderate expansion opportunity
        if (
            land_area_hectares >= 20
            and infrastructure_score >= 60
            and overall_site_score >= 60
        ):
            return "Limited Expansion"

        # Otherwise
        return "Not Expandable"