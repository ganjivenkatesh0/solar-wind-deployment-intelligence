from sqlalchemy import Column, Integer, String

from backend.app.database.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, nullable=False)
    location = Column(String, nullable=False)
