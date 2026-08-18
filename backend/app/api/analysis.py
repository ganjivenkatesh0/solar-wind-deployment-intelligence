from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.services.analysis_history_service import AnalysisHistoryService
from app.services.analysis_pipeline import AnalysisPipelineService

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)

analysis_service = AnalysisPipelineService()


@router.post(
    "",
    response_model=AnalysisResponse,
    summary="Analyze Renewable Energy Site",
)
def analyze_site(
    request: AnalysisRequest,
    x_client_id: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    """
    Perform complete renewable energy site analysis and
    persist the completed result in analysis history.
    """

    try:
        result = analysis_service.analyze_site(request)

        AnalysisHistoryService.create(
            db,
            request=request,
            response=result,
            client_id=x_client_id or "anonymous",
        )

        return result

    except ValueError as exc:
        message = str(exc)

        if (
            "Terrain" in message
            or "SRTM" in message
            or "Country code" in message
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Terrain or location data is unavailable for the selected "
                    "coordinates. Please select a valid land location."
                ),
            ) from exc

        raise
