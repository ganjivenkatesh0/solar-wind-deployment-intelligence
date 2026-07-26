from fastapi import APIRouter

from app.schemas.optimization import (
    OptimizationRequest,
    OptimizationResponse,
)
from app.services.deployment_plan import DeploymentPlanService

router = APIRouter(
    prefix="/optimization",
    tags=["Optimization"],
)


@router.post(
    "/",
    response_model=OptimizationResponse,
)
def generate_optimization_plan(
    request: OptimizationRequest,
):
    return DeploymentPlanService.generate_plan(request)