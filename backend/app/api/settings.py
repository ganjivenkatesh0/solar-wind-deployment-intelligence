from datetime import datetime

from fastapi import APIRouter, Depends, Header, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.session import SessionRecord
from app.models.user import User
from app.schemas.auth import UpdateProfileRequest
from app.schemas.settings import SettingsPayload, SettingsResponse
from app.services.auth_service import AuthService
from app.services.settings_service import SettingsService

router = APIRouter(prefix="/settings", tags=["Settings"])


def get_client_id(x_client_id: str | None = Header(default=None)) -> str:
    return x_client_id or "anonymous"


def get_authenticated_user(request: Request, db: Session = Depends(get_db)) -> User | None:
    token = request.cookies.get("session_token")
    if not token:
        return None
    record = db.scalar(select(SessionRecord).where(SessionRecord.token == token))
    if record is None or record.expires_at < datetime.utcnow():
        return None
    return record.user


def build_response(db: Session, client_id: str, user: User | None = None) -> SettingsResponse:
    settings = SettingsService.get_or_create(db, client_id)
    payload = SettingsService.response(db, settings)
    if user is not None:
        account = payload["account"]
        account.update({
            "name": user.name,
            "email": user.email,
            "organization": user.organization or account.get("organization") or "",
            "phone": user.phone or account.get("phone") or "",
        })
        payload["account"] = account
    return SettingsResponse.model_validate(payload)


@router.get("", response_model=SettingsResponse)
def get_settings(
    request: Request,
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    user = get_authenticated_user(request, db)
    return build_response(db, client_id, user)


@router.put("", response_model=SettingsResponse)
def update_settings(
    payload: SettingsPayload,
    request: Request,
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    user = get_authenticated_user(request, db)
    if user is not None:
        AuthService.update_profile(
            db,
            user,
            UpdateProfileRequest(
                name=payload.account.name,
                organization=payload.account.organization,
                phone=payload.account.phone,
            ),
        )
        payload.account.name = user.name
        payload.account.email = user.email
        payload.account.organization = user.organization or payload.account.organization
        payload.account.phone = user.phone or payload.account.phone
    SettingsService.update(db, client_id, payload)
    return build_response(db, client_id, user)


@router.post("/reset", response_model=SettingsResponse)
def reset_settings(
    request: Request,
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    user = get_authenticated_user(request, db)
    SettingsService.reset(db, client_id)
    return build_response(db, client_id, user)
