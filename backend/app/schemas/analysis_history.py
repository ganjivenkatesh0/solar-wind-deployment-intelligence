"""Schemas for persistent analysis history."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel


class AnalysisHistorySummary(BaseModel):
    id: int
    analysis_id: str
    location_name: str | None
    latitude: float
    longitude: float
    project_type: str
    installation_type: str
    land_area_hectares: float
    available_budget: float
    overall_site_score: float
    recommended_deployment: str
    status: str
    created_at: datetime
    response_data: dict[str, Any]


class AnalysisHistoryDetail(AnalysisHistorySummary):
    request_data: dict[str, Any]
    response_data: dict[str, Any]


class AnalysisHistoryListResponse(BaseModel):
    items: list[AnalysisHistorySummary]
    total: int
    page: int
    page_size: int
    pages: int
