from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from backend.app.database.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    project_name = Column(String, nullable=False)

    description = Column(String, nullable=False)

    state = Column(String, nullable=False)

    latitude = Column(Float, nullable=False)

    longitude = Column(Float, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)