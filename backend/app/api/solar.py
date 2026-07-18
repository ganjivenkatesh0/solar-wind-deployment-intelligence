"""Solar feature API endpoints."""

from fastapi import APIRouter, HTTPException, Query

from app.services.solar_service import SolarFeatureService

router = APIRouter(
    prefix="/solar",
    tags=["Solar Features"],
)

solar_service = SolarFeatureService()


@router.get("/features")
def get_solar_features(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
):
    """Retrieve solar environmental features for a location."""
    try:
        return solar_service.get_solar_features(latitude, longitude)

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))