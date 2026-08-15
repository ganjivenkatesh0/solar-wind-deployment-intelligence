from app.schemas.deployment_recommendation import (
    DeploymentRecommendationRequest,
)
from app.schemas.optimization import (
    OptimizationRequest,
    OptimizationResponse,
)

from app.services.capacity_planner import CapacityPlanner
from app.services.deployment_recommendation_service import (
    DeploymentRecommendationService,
)
from app.services.expansion_analysis import (
    ExpansionAnalysis,
)


class DeploymentPlanService:
    """
    Generate a complete renewable energy deployment plan by
    combining deployment recommendation, capacity planning,
    and expansion feasibility analysis.
    """

    @staticmethod
    def generate_plan(
        request: OptimizationRequest,
    ) -> OptimizationResponse:

        # -----------------------------
        # Deployment Recommendation
        # -----------------------------
        recommendation_request = DeploymentRecommendationRequest(
            overall_site_score=request.overall_site_score,
            solar_score=request.solar_score,
            wind_score=request.wind_score,
            terrain_score=request.terrain_score,
            infrastructure_score=request.infrastructure_score,
            estimated_solar_energy=request.estimated_solar_energy,
            estimated_wind_energy=request.estimated_wind_energy,
        )

        recommendation = (
            DeploymentRecommendationService
            .generate_recommendation(recommendation_request)
        )

        # -----------------------------
        # Capacity Planning
        # -----------------------------
        # Optimization planning preserves the site's land/suitability
        # capacity model. Budget-aware capacity is handled by the main
        # analysis pipeline where the user's available budget is a hard
        # project constraint.
        capacity = CapacityPlanner.recommend_capacity(
            land_area_hectares=request.land_area_hectares,
            overall_site_score=request.overall_site_score,
        )

        # -----------------------------
        # Expansion Analysis
        # -----------------------------
        expansion_status = (
            ExpansionAnalysis.analyze_expansion(
                land_area_hectares=request.land_area_hectares,
                infrastructure_score=request.infrastructure_score,
                overall_site_score=request.overall_site_score,
            )
        )

        # -----------------------------
        # Optimization Remarks
        # -----------------------------
        remarks = (
            f"{recommendation.deployment_type} deployment "
            f"recommended with {capacity} MW capacity. "
            f"Expansion Status: {expansion_status}."
        )

        # -----------------------------
        # Final Deployment Plan
        # -----------------------------
        return OptimizationResponse(
            recommended_technology=recommendation.deployment_type,
            recommended_capacity_mw=capacity,
            expansion_status=expansion_status,
            optimization_remarks=remarks,
        )