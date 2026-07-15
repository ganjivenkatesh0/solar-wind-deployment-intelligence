"""Pydantic schemas for Feature model."""

from datetime import datetime

from pydantic import BaseModel


class FeatureCreate(BaseModel):
    """Schema for creating a new feature record."""

    latitude: float
    longitude: float

    solar_irradiance: float
    wind_speed: float
    temperature: float
    humidity: float

    elevation: float
    slope: float


class FeatureResponse(FeatureCreate):
    """Schema for returning feature records from the API."""

    id: int
    created_at: datetime

    class Config:
        from_attributes = True
