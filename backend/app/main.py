from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analysis import router as analysis_router
from app.api.home import router as home_router
from app.api.projects import router as projects_router
from app.api.sites import router as sites_router
from app.api.predictions import router as predictions_router
from app.api.features import router as feature_router
from app.api import solar

from app.api import deployment
from app.api import optimization

from app.database.database import Base, engine

# Import models before creating tables
from app.models.project import Project
from app.models.feature import Feature

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Solar & Wind Deployment Intelligence Platform",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.app\.github\.dev",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(home_router)
app.include_router(projects_router)
app.include_router(sites_router)
app.include_router(predictions_router)
app.include_router(feature_router)
app.include_router(solar.router)
app.include_router(deployment.router)
app.include_router(optimization.router)
app.include_router(analysis_router)


