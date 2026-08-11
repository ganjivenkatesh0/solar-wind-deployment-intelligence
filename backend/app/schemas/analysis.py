from pydantic import BaseModel


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

    deployment_plan: dict
    