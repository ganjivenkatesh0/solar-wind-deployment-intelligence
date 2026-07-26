from datetime import UTC, datetime
from typing import Optional

from pydantic import BaseModel, Field


class DeploymentRecommendationBase(BaseModel):
    deployment_type: str = Field(
        ...,
        description="Recommended deployment type (Solar, Wind, Hybrid, or Not Recommended)"
    )

    confidence: float = Field(
        ...,
        ge=0,
        le=100,
        description="Confidence score of the recommendation"
    )

    priority: str = Field(
        ...,
        description="Deployment priority level"
    )

    reason: str = Field(
        ...,
        description="Human-readable explanation for the recommendation"
    )


class DeploymentRecommendationResponse(DeploymentRecommendationBase):
    generated_at: datetime = Field(
    default_factory=lambda: datetime.now(UTC),
    description="Recommendation generation timestamp"
)


class DeploymentRecommendationRequest(BaseModel):
    overall_site_score: float

    solar_score: float

    wind_score: float

    terrain_score: float

    infrastructure_score: float

    estimated_solar_energy: float

    estimated_wind_energy: float