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
        #
        # If the user explicitly selected a project type, respect that
        # selection. The analysis still evaluates the site's solar/wind
        # resources, but the final deployment recommendation follows the
        # user's requested technology.
        #
        # Existing callers that do not provide project_type continue to use
        # the original automatic recommendation behaviour.
        requested_type = getattr(request, "project_type", None)

        if requested_type in {"solar", "wind", "hybrid"}:
            # An explicit project type is a user decision and must be
            # respected. Suitability/confidence is reported separately.
            #
            # This prevents the recommendation from silently changing
            # Solar/Wind/Hybrid into "Not Recommended" merely because
            # the overall site score is below the automatic-recommendation
            # threshold.

            if requested_type == "solar":
                deployment_type = "Solar"
                reason = (
                    "Solar project selected by the user. The site analysis "
                    "evaluates the solar resource and project suitability."
                )

            elif requested_type == "wind":
                deployment_type = "Wind"
                reason = (
                    "Wind project selected by the user. The site analysis "
                    "evaluates the wind resource and project suitability."
                )

            else:
                deployment_type = "Hybrid"
                reason = (
                    "Hybrid project selected by the user. The site analysis "
                    "evaluates both solar and wind resources."
                )

        elif overall < 60:
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