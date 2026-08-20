"""Schemas for client-scoped application settings."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class GeneralSettings(BaseModel):
    analysis_type: str = "Solar Project"
    currency: str = "USD ($)"
    distance_unit: str = "Kilometers (km)"
    area_unit: str = "Hectares (ha)"
    date_format: str = "Aug 13, 2026 (MMM DD, YYYY)"
    time_zone: str = "(UTC+05:30) Asia/Kolkata"
    theme: str = "light"
    compact: bool = False


class AccountSettings(BaseModel):
    name: str = "Ganji Venkatesh"
    email: str = "ganji.venkatesh@example.com"
    organization: str = "Renewables Intelligence Lab"
    phone: str = "+91 98765 43210"

    @field_validator("name", "email", "organization", "phone")
    @classmethod
    def validate_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Profile fields cannot be empty.")
        return value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        if "@" not in value or "." not in value.rsplit("@", 1)[-1]:
            raise ValueError("Email address is invalid.")
        return value


class NotificationSettings(BaseModel):
    analysis_complete: bool = True
    report_ready: bool = True
    data_source: bool = True
    weekly_digest: bool = False
    product_updates: bool = False


class PreferenceSettings(BaseModel):
    resource: int = Field(default=30, ge=0, le=50)
    financial: int = Field(default=25, ge=0, le=50)
    infrastructure: int = Field(default=20, ge=0, le=50)
    environment: int = Field(default=15, ge=0, le=50)
    risk: int = Field(default=10, ge=0, le=50)

    @model_validator(mode="after")
    def validate_total(self) -> "PreferenceSettings":
        if sum(self.model_dump().values()) != 100:
            raise ValueError("Analysis preference weights must total 100%.")
        return self


class SecuritySettings(BaseModel):
    two_factor: bool = True
    session_timeout: bool = True
    login_alerts: bool = False


class SettingsPayload(BaseModel):
    general: GeneralSettings = Field(default_factory=GeneralSettings)
    account: AccountSettings = Field(default_factory=AccountSettings)
    notifications: NotificationSettings = Field(default_factory=NotificationSettings)
    preferences: PreferenceSettings = Field(default_factory=PreferenceSettings)
    security: SecuritySettings = Field(default_factory=SecuritySettings)


class SettingsResponse(SettingsPayload):
    model_config = ConfigDict(from_attributes=True)

    updated_at: datetime | None = None
    statistics: dict[str, str] = Field(default_factory=dict)
    system: dict[str, str] = Field(default_factory=dict)
    notifications_feed: list[dict[str, Any]] = Field(default_factory=list)
