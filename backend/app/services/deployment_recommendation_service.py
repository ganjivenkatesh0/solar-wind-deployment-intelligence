from app.schemas.deployment_recommendation import (
    DeploymentRecommendationRequest,
    DeploymentRecommendationResponse,
)


class DeploymentRecommendationService:
    """
    Service responsible for generating renewable energy
    deployment recommendations based on site analysis results.
    """

    @staticmethod
    def generate_recommendation(
        request: DeploymentRecommendationRequest,
    ) -> DeploymentRecommendationResponse:

        overall = request.overall_site_score
        solar = request.solar_score
        wind = request.wind_score

        # -----------------------------
        # Determine Deployment Type
        # -----------------------------
        if overall < 60:
            deployment_type = "Not Recommended"
            reason = (
                "The overall site suitability score is too low for a "
                "renewable energy deployment."
            )

        elif solar >= 80 and wind >= 80:
            deployment_type = "Hybrid"
            reason = (
                "Both solar and wind resources are strong. "
                "A hybrid renewable energy system is recommended."
            )

        elif solar >= 80:
            deployment_type = "Solar"
            reason = (
                "Solar resource potential is significantly higher than "
                "wind potential."
            )

        elif wind >= 80:
            deployment_type = "Wind"
            reason = (
                "Wind resource potential is significantly higher than "
                "solar potential."
            )

        elif solar >= wind:
            deployment_type = "Solar"
            reason = (
                "Solar resource is comparatively better than wind."
            )

        else:
            deployment_type = "Wind"
            reason = (
                "Wind resource is comparatively better than solar."
            )

        # -----------------------------
        # Priority
        # -----------------------------
        if overall >= 95:
            priority = "Critical"

        elif overall >= 85:
            priority = "High"

        elif overall >= 70:
            priority = "Medium"

        elif overall >= 60:
            priority = "Low"

        else:
            priority = "Not Recommended"

        # -----------------------------
        # Confidence
        # -----------------------------
        confidence = round(min(overall, 100.0), 2)

        return DeploymentRecommendationResponse(
            deployment_type=deployment_type,
            confidence=confidence,
            priority=priority,
            reason=reason,
        )