from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.settings import SettingsPayload, SettingsResponse
from app.services.settings_service import SettingsService

router = APIRouter(prefix="/settings", tags=["Settings"])


def get_client_id(x_client_id: str | None = Header(default=None)) -> str:
    return x_client_id or "anonymous"


def build_response(db: Session, client_id: str) -> SettingsResponse:
    settings = SettingsService.get_or_create(db, client_id)
    return SettingsResponse.model_validate(SettingsService.response(db, settings))


@router.get("", response_model=SettingsResponse)
def get_settings(
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    return build_response(db, client_id)


@router.put("", response_model=SettingsResponse)
def update_settings(
    payload: SettingsPayload,
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    SettingsService.update(db, client_id, payload)
    return build_response(db, client_id)


@router.post("/reset", response_model=SettingsResponse)
def reset_settings(
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    SettingsService.reset(db, client_id)
    return build_response(db, client_id)
