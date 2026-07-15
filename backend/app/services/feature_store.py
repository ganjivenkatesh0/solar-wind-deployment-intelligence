"""Feature store service for managing feature records."""

from sqlalchemy.orm import Session

from backend.app.models.feature import Feature
from backend.app.schemas.feature import FeatureCreate


class FeatureStoreService:
    """Service for managing feature records."""

    def __init__(self, db: Session):
        self.db = db

    def create_feature(self, feature: FeatureCreate):
        """Save a new feature record."""

        db_feature = Feature(
            latitude=feature.latitude,
            longitude=feature.longitude,
            solar_irradiance=feature.solar_irradiance,
            wind_speed=feature.wind_speed,
            temperature=feature.temperature,
            humidity=feature.humidity,
            elevation=feature.elevation,
            slope=feature.slope,
        )

        self.db.add(db_feature)
        self.db.commit()
        self.db.refresh(db_feature)

        return db_feature

    def get_all_features(self):
        """Return all stored feature records."""

        return self.db.query(Feature).all()

    def get_feature_by_location(
        self,
        latitude: float,
        longitude: float,
    ):
        """Search a feature by latitude and longitude."""

        return (
            self.db.query(Feature)
            .filter(
                Feature.latitude == latitude,
                Feature.longitude == longitude,
            )
            .first()
        )
