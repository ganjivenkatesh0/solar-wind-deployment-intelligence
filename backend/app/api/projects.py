from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.models.project import Project
from backend.app.schemas.project import ProjectCreate, ProjectResponse

router = APIRouter()


@router.post("/projects", response_model=ProjectResponse)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    db_project = Project(
        project_name=project.project_name,
        description=project.description,
        state=project.state,
        latitude=project.latitude,
        longitude=project.longitude,
    )

    db.add(db_project)
    db.commit()
    db.refresh(db_project)

    return db_project


@router.get("/projects", response_model=list[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()