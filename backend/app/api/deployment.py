from fastapi import APIRouter

from app.schemas.deployment_recommendation import (
    DeploymentRecommendationRequest,
    DeploymentRecommendationResponse,
)
from app.services.deployment_recommendation_service import (
    DeploymentRecommendationService,
)

router = APIRouter(
    prefix="/deployment",
    tags=["Deployment Recommendation"],
)


@router.post(
    "/",
    response_model=DeploymentRecommendationResponse,
    summary="Generate Deployment Recommendation",
)
def generate_deployment_recommendation(
    request: DeploymentRecommendationRequest,
):
    """
    Generate a renewable energy deployment recommendation
    based on site analysis results.
    """
    return DeploymentRecommendationService.generate_recommendation(request)