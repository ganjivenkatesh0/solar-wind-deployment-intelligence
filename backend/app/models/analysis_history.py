"""Persistent analysis history model."""

from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base


class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    analysis_id: Mapped[str] = mapped_column(
        String(32),
        unique=True,
        nullable=False,
        index=True,
    )

    client_id: Mapped[str] = mapped_column(
        String(128),
        nullable=False,
        index=True,
    )

    latitude: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    longitude: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    location_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    project_type: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
    )

    installation_type: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
    )

    land_area_hectares: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    available_budget: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    overall_site_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    recommended_deployment: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default="Completed",
    )

    request_data: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False,
    )

    response_data: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )
