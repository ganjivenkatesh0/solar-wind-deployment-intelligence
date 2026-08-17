from typing import Any, Literal

from pydantic import BaseModel, Field

from app.schemas.deployment_recommendation import (
    DeploymentRecommendationResponse,
)


class HardConstraintResult(BaseModel):
    passed: bool
    status: str
    reason: str


class HardConstraintsResponse(BaseModel):
    passed: bool
    constraints: dict[str, HardConstraintResult]
    failed_constraints: list[str]


class SoftConstraintResult(BaseModel):
    score: float | None
    value: float | None
    unit: str


class SoftConstraintsResponse(BaseModel):
    score: float
    constraints: dict[str, SoftConstraintResult]


class TechnicalFeasibilityResponse(BaseModel):
    is_feasible: bool
    feasibility_score: float
    decision: str
    hard_constraints: HardConstraintsResponse
    soft_constraints: SoftConstraintsResponse
    constraint_summary: str


class AnalysisRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

    land_area_hectares: float = Field(..., gt=0)
    available_budget: float = Field(..., gt=0)

    location_name: str | None = Field(
        default=None,
        max_length=255,
        description="Human-readable site location name.",
    )

    # Optional for backward compatibility with existing API clients/tests.
    # New Analysis UI always sends these values.
    project_type: Literal["solar", "wind", "hybrid"] = Field(
        default="hybrid",
        description="Requested project type: solar, wind, or hybrid",
    )
    installation_type: Literal[
        "ground-mounted",
        "rooftop",
        "other",
    ] = Field(
        default="ground-mounted",
        description="Installation configuration: ground-mounted, rooftop, or other",
    )


class AnalysisResponse(BaseModel):
    solar_features: dict
    wind_assessment: dict

    renewable_score: float
    terrain_score: float
    infrastructure_score: float
    environmental_score: float
    economic_score: float

    overall_site_score: float
    ml_prediction: dict

    technical_feasibility: TechnicalFeasibilityResponse

    # Standardized Day-29 response fields
    site_suitability: float
    recommended_deployment: str
    energy_yield: dict
    financial_metrics: dict
    recommendation_reason: str

    # Dynamic deployment recommendation.
    # Exposes priority, confidence, deployment type and reason
    # directly to frontend consumers.
    recommendation: DeploymentRecommendationResponse

    # Extended intelligence
    deployment_plan: dict
    sentinel2: dict | None = None
