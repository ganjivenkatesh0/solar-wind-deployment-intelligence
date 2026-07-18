class DeploymentStrategyService:
    """
    Service for recommending the most suitable renewable energy
    deployment strategy based on solar and wind resource quality.
    """

    def recommend_deployment(
        self,
        solar_classification: str,
        wind_classification: str,
    ) -> str:
        """Recommend the best deployment strategy."""

        if solar_classification == "Excellent" and wind_classification == "Excellent":
            return "Hybrid"

        elif solar_classification == "Excellent" and wind_classification == "Good":
            return "Hybrid"

        elif solar_classification == "Good" and wind_classification == "Excellent":
            return "Hybrid"

        elif solar_classification == "Excellent":
            return "Solar"

        elif wind_classification == "Excellent":
            return "Wind"

        elif (
            solar_classification == "Poor"
            and wind_classification == "Poor"
        ):
            return "Not Recommended"

        return "Hybrid"

    def generate_reason(
        self,
        solar_classification: str,
        wind_classification: str,
    ) -> str:
        """Generate a human-readable explanation."""

        deployment = self.recommend_deployment(
            solar_classification,
            wind_classification,
        )

        if deployment == "Hybrid":
            return "High solar irradiance and consistently strong wind resource."

        elif deployment == "Solar":
            return "Strong solar resource with limited wind potential."

        elif deployment == "Wind":
            return "Strong wind resource while solar potential is comparatively lower."

        return "Neither solar nor wind resources are sufficient for efficient deployment."

    def confidence_score(
        self,
        solar_classification: str,
        wind_classification: str,
    ) -> int:
        """Estimate recommendation confidence."""

        if (
            solar_classification == "Excellent"
            and wind_classification == "Excellent"
        ):
            return 95

        elif (
            solar_classification == "Excellent"
            and wind_classification == "Good"
        ):
            return 91

        elif (
            solar_classification == "Good"
            and wind_classification == "Excellent"
        ):
            return 90

        elif solar_classification == "Excellent":
            return 88

        elif wind_classification == "Excellent":
            return 86

        elif (
            solar_classification == "Poor"
            and wind_classification == "Poor"
        ):
            return 40

        return 80