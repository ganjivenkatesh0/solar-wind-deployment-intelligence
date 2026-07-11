from fastapi import FastAPI

from backend.app.api.home import router as home_router
from backend.app.api.projects import router as projects_router
from backend.app.api.sites import router as sites_router
from backend.app.api.predictions import router as predictions_router

from backend.app.database.database import Base, engine

# Import models before creating tables
from backend.app.models.project import Project

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Solar & Wind Deployment Intelligence Platform",
    version="0.1.0"
)

app.include_router(home_router)
app.include_router(projects_router)
app.include_router(sites_router)
app.include_router(predictions_router)
