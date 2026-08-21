from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.session import SessionRecord
from app.models.user import User
from app.schemas.auth import AuthSessionState, LoginRequest, RegisterRequest, UpdateProfileRequest, UserResponse
from app.services.auth_service import AuthService, generate_session_token

router = APIRouter(prefix="/auth", tags=["Authentication"])
SESSION_COOKIE_NAME = "session_token"
SESSION_TTL = timedelta(days=7)


def set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=int(SESSION_TTL.total_seconds()),
        path="/",
    )


def clear_session_cookie(response: Response) -> None:
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value="logged_out",
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=60,
        path="/",
    )


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required.")

    record = db.scalar(select(SessionRecord).where(SessionRecord.token == token))
    if record is None or record.expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required.")
    return record.user


def issue_session(db: Session, user: User) -> str:
    token = generate_session_token()
    record = SessionRecord(
        user_id=user.id,
        token=token,
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + SESSION_TTL,
    )
    db.add(record)
    db.commit()
    return token


@router.post("/register", response_model=AuthSessionState)
def register_user(payload: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    user = AuthService.create_user(
        db,
        name=payload.name,
        email=str(payload.email),
        password=payload.password,
        organization=payload.organization,
        phone=payload.phone,
    )
    token = issue_session(db, user)
    set_session_cookie(response, token)
    return AuthSessionState(user=UserResponse.model_validate(AuthService.serialize_user(user)))


@router.post("/login", response_model=AuthSessionState)
def login_user(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = AuthService.authenticate(db, email=str(payload.email), password=payload.password)
    token = issue_session(db, user)
    set_session_cookie(response, token)
    return AuthSessionState(user=UserResponse.model_validate(AuthService.serialize_user(user)))


@router.get("/me", response_model=UserResponse)
def get_me(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)
    return UserResponse.model_validate(AuthService.serialize_user(user))


@router.put("/me", response_model=UserResponse)
def update_me(payload: UpdateProfileRequest, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)
    updated = AuthService.update_profile(db, user, payload)
    return UserResponse.model_validate(AuthService.serialize_user(updated))


@router.post("/logout")
def logout_user(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if token:
        record = db.scalar(select(SessionRecord).where(SessionRecord.token == token))
        if record is not None:
            db.delete(record)
            db.commit()
    clear_session_cookie(response)
    return {"success": True}
