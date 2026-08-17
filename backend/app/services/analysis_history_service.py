"""Persistence and retrieval service for analysis history."""

from math import ceil
from uuid import uuid4

from fastapi.encoders import jsonable_encoder

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.analysis_history import AnalysisHistory
from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.schemas.analysis_history import (
    AnalysisHistoryDetail,
    AnalysisHistoryListResponse,
    AnalysisHistorySummary,
)


class AnalysisHistoryService:
    @staticmethod
    def create(
        db: Session,
        *,
        request: AnalysisRequest,
        response: AnalysisResponse,
        client_id: str,
        location_name: str | None = None,
    ) -> AnalysisHistory:
        record = AnalysisHistory(
            analysis_id=f"AN-{uuid4().hex[:10].upper()}",
            client_id=client_id,
            latitude=request.latitude,
            longitude=request.longitude,
            location_name=location_name,
            project_type=request.project_type,
            installation_type=request.installation_type,
            land_area_hectares=request.land_area_hectares,
            available_budget=request.available_budget,
            overall_site_score=response.overall_site_score,
            recommended_deployment=response.recommended_deployment,
            status="Completed",
            request_data=jsonable_encoder(request),
            response_data=jsonable_encoder(response),
        )

        db.add(record)
        db.commit()
        db.refresh(record)

        return record

    @staticmethod
    def list(
        db: Session,
        *,
        client_id: str,
        page: int = 1,
        page_size: int = 12,
        query: str | None = None,
    ) -> AnalysisHistoryListResponse:
        page = max(page, 1)
        page_size = min(max(page_size, 1), 100)

        base_query = select(AnalysisHistory).where(
            AnalysisHistory.client_id == client_id
        )

        if query:
            pattern = f"%{query.strip()}%"
            base_query = base_query.where(
                (
                    AnalysisHistory.analysis_id.ilike(pattern)
                    | AnalysisHistory.location_name.ilike(pattern)
                    | AnalysisHistory.project_type.ilike(pattern)
                )
            )

        total = db.scalar(
            select(func.count()).select_from(
                base_query.order_by(None).subquery()
            )
        ) or 0

        records = db.scalars(
            base_query.order_by(
                AnalysisHistory.created_at.desc()
            )
            .offset((page - 1) * page_size)
            .limit(page_size)
        ).all()

        pages = ceil(total / page_size) if total else 0

        return AnalysisHistoryListResponse(
            items=[
                AnalysisHistorySummary.model_validate(
                    record,
                    from_attributes=True,
                )
                for record in records
            ],
            total=total,
            page=page,
            page_size=page_size,
            pages=pages,
        )

    @staticmethod
    def get(
        db: Session,
        *,
        analysis_id: str,
        client_id: str,
    ) -> AnalysisHistory | None:
        return db.scalar(
            select(AnalysisHistory).where(
                AnalysisHistory.analysis_id == analysis_id,
                AnalysisHistory.client_id == client_id,
            )
        )

    @staticmethod
    def delete(
        db: Session,
        *,
        analysis_id: str,
        client_id: str,
    ) -> bool:
        record = AnalysisHistoryService.get(
            db,
            analysis_id=analysis_id,
            client_id=client_id,
        )

        if record is None:
            return False

        db.delete(record)
        db.commit()

        return True
