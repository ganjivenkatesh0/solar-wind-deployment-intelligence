from typing import Any

from pydantic import BaseModel


class HardConstraintResult(BaseModel):
    passed: bool
    status: str
    reason: str


class HardConstraintsResponse(BaseModel):
    passed: bool
    constraints: dict[str, HardConstraintResult]
    failed_constraints: list[str]


class SoftConstraintResult(BaseModel):
    score: float
    value: float
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
    latitude: float
    longitude: float

    land_area_hectares: float
    available_budget: float


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

    deployment_plan: dict