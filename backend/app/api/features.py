"""Feature API endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.schemas.feature import FeatureResponse
from backend.app.services.feature_store import FeatureStoreService
from backend.app.models.feature import Feature

router = APIRouter(
    prefix="/features",
    tags=["Features"],
)


@router.get("/", response_model=list[FeatureResponse])
def get_features(db: Session = Depends(get_db)):
    """Return all stored feature records."""

    service = FeatureStoreService(db)
    return service.get_all_features()


@router.get("/{feature_id}", response_model=FeatureResponse)
def get_feature(feature_id: int, db: Session = Depends(get_db)):
    """Return a single feature record by ID."""

    feature = (
        db.query(Feature)
        .filter(Feature.id == feature_id)
        .first()
    )

    if feature is None:
        raise HTTPException(
            status_code=404,
            detail="Feature not found",
        )

    return feature
