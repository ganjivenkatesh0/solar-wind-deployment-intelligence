from datetime import UTC, datetime

from pydantic import BaseModel, Field


class OptimizationRequest(BaseModel):
    project_type: str | None = None
    installation_type: str | None = None

    overall_site_score: float
    solar_score: float
    wind_score: float
    terrain_score: float
    infrastructure_score: float

    estimated_solar_energy: float
    estimated_wind_energy: float

    land_area_hectares: float
    available_budget: float


class OptimizationResponse(BaseModel):
    recommended_technology: str
    recommended_capacity_mw: float
    expansion_status: str
    optimization_remarks: str

    generated_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC)
    )