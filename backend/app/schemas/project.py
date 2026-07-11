from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    project_name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=5)
    state: str = Field(..., min_length=2, max_length=50)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class ProjectResponse(ProjectCreate):
    id: int

    class Config:
        from_attributes = True