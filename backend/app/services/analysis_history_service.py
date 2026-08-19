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
    def build_pdf(record: AnalysisHistory) -> bytes:
        lines = [
            f"{record.analysis_id} Report",
            f"Location: {record.location_name or 'Unavailable'}",
            f"Coordinates: {record.latitude:.4f}, {record.longitude:.4f}",
            f"Project type: {record.project_type}",
            f"Installation: {record.installation_type}",
            f"Suitability score: {record.overall_site_score:.1f}/100",
            f"Recommended deployment: {record.recommended_deployment}",
            f"Land area: {record.land_area_hectares:.2f} hectares",
            f"Available budget: {record.available_budget:.2f}",
            f"Generated: {record.created_at.isoformat()}",
        ]

        def escape(value: str) -> str:
            return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")

        content_lines = ["BT", "/F1 12 Tf", "50 760 Td"]
        for index, line in enumerate(lines):
            if index:
                content_lines.append("0 -22 Td")
            content_lines.append(f"({escape(line)}) Tj")
        content_lines.append("ET")
        content = "\n".join(content_lines).encode("latin-1", "replace")

        objects = [
            b"<< /Type /Catalog /Pages 2 0 R >>",
            b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
            b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
            b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
            b"<< /Length " + str(len(content)).encode() + b" >>\nstream\n" + content + b"\nendstream",
        ]

        pdf = bytearray(b"%PDF-1.4\n")
        offsets = [0]
        for number, obj in enumerate(objects, start=1):
            offsets.append(len(pdf))
            pdf.extend(f"{number} 0 obj\n".encode())
            pdf.extend(obj)
            pdf.extend(b"\nendobj\n")

        xref_offset = len(pdf)
        pdf.extend(f"xref\n0 {len(objects) + 1}\n".encode())
        pdf.extend(b"0000000000 65535 f \n")
        for offset in offsets[1:]:
            pdf.extend(f"{offset:010d} 00000 n \n".encode())
        pdf.extend(f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF".encode())
        return bytes(pdf)

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
