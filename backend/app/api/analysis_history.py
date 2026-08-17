from fastapi import APIRouter, Depends, Header, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.analysis_history import (
    AnalysisHistoryDetail,
    AnalysisHistoryListResponse,
)
from app.services.analysis_history_service import AnalysisHistoryService

router = APIRouter(
    prefix="/analysis-history",
    tags=["Analysis History"],
)


def get_client_id(
    x_client_id: str | None = Header(default=None),
) -> str:
    return x_client_id or "anonymous"


@router.get(
    "",
    response_model=AnalysisHistoryListResponse,
)
def list_analysis_history(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=100),
    query: str | None = Query(default=None),
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    return AnalysisHistoryService.list(
        db,
        client_id=client_id,
        page=page,
        page_size=page_size,
        query=query,
    )


@router.get(
    "/{analysis_id}",
    response_model=AnalysisHistoryDetail,
)
def get_analysis_history(
    analysis_id: str,
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    record = AnalysisHistoryService.get(
        db,
        analysis_id=analysis_id,
        client_id=client_id,
    )

    if record is None:
        raise HTTPException(
            status_code=404,
            detail="Analysis history record not found.",
        )

    return AnalysisHistoryDetail.model_validate(
        record,
        from_attributes=True,
    )


@router.delete(
    "/{analysis_id}",
)
def delete_analysis_history(
    analysis_id: str,
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    deleted = AnalysisHistoryService.delete(
        db,
        analysis_id=analysis_id,
        client_id=client_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Analysis history record not found.",
        )

    return {
        "status": "deleted",
        "analysis_id": analysis_id,
    }
