from fastapi import APIRouter, HTTPException

from app.schemas.analysis import AnalysisRequest, AnalysisResponse
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
def analyze_site(request: AnalysisRequest):
    """
    Perform complete renewable energy site analysis.

    This endpoint runs the end-to-end analysis pipeline,
    including:
    - Solar feature extraction
    - Wind assessment
    - Category scoring
    - Overall suitability scoring
    - Energy estimation
    - Deployment recommendation
    - Capacity planning
    - Expansion analysis
    - Deployment optimization
    """
    try:
        return analysis_service.analyze_site(request)

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
