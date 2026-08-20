"""Persistence and derived information for application settings."""

from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.analysis_history import AnalysisHistory
from app.models.settings import Settings
from app.schemas.settings import SettingsPayload


DEFAULTS = SettingsPayload().model_dump(mode="json")


class SettingsService:
    @staticmethod
    def get_or_create(db: Session, client_id: str) -> Settings:
        settings = db.scalar(select(Settings).where(Settings.client_id == client_id))
        if settings is not None:
            return settings

        settings = Settings(client_id=client_id, values=DEFAULTS)
        db.add(settings)
        db.commit()
        db.refresh(settings)
        return settings

    @staticmethod
    def update(db: Session, client_id: str, payload: SettingsPayload) -> Settings:
        settings = SettingsService.get_or_create(db, client_id)
        settings.values = payload.model_dump(mode="json")
        settings.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(settings)
        return settings

    @staticmethod
    def reset(db: Session, client_id: str) -> Settings:
        return SettingsService.update(db, client_id, SettingsPayload())

    @staticmethod
    def response(db: Session, settings: Settings) -> dict:
        total_analyses = db.scalar(
            select(func.count()).select_from(AnalysisHistory).where(
                AnalysisHistory.client_id == settings.client_id
            )
        ) or 0
        completed = db.scalar(
            select(func.count()).select_from(AnalysisHistory).where(
                AnalysisHistory.client_id == settings.client_id,
                AnalysisHistory.status == "Completed",
            )
        ) or 0

        feed = []
        if settings.values["notifications"]["analysis_complete"] and completed:
            feed.append({
                "id": "analysis-complete",
                "title": "Analysis completed",
                "description": f"{completed} completed analysis{'es' if completed != 1 else ''} available in history.",
            })
        if settings.values["notifications"]["report_ready"] and completed:
            feed.append({
                "id": "report-ready",
                "title": "Reports available",
                "description": "Completed analysis reports are ready to view or download.",
            })

        return {
            **settings.values,
            "updated_at": settings.updated_at,
            "statistics": {
                "Total Analyses": str(total_analyses),
                "Reports Generated": str(completed),
            },
            "system": {
                "Application Version": "0.1.0",
                "Backend Version": "0.1.0",
                "Database": "PostgreSQL",
                "Environment": "Configured",
                "Last Updated": settings.updated_at.strftime("%b %d, %Y %I:%M %p"),
            },
            "notifications_feed": feed,
        }
