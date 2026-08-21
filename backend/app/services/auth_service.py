import secrets
from datetime import datetime, timedelta
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth import UpdateProfileRequest


def hash_password(password: str) -> str:
    import bcrypt

    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    import bcrypt

    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def generate_session_token() -> str:
    return secrets.token_urlsafe(32)


class AuthService:
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User | None:
        return db.scalar(select(User).where(User.email == email.lower().strip()))

    @staticmethod
    def create_user(db: Session, *, name: str, email: str, password: str, organization: str | None, phone: str | None) -> User:
        normalized_email = email.lower().strip()
        existing = AuthService.get_user_by_email(db, normalized_email)
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A user with this email already exists.")

        user = User(
            name=name.strip(),
            email=normalized_email,
            password_hash=hash_password(password),
            organization=organization.strip() if organization else None,
            phone=phone.strip() if phone else None,
            role="Energy Analyst",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def authenticate(db: Session, *, email: str, password: str) -> User:
        user = AuthService.get_user_by_email(db, email)
        if user is None or not verify_password(password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
        return user

    @staticmethod
    def update_profile(db: Session, user: User, payload: UpdateProfileRequest) -> User:
        if payload.name is not None:
            user.name = payload.name.strip()
        if payload.organization is not None:
            user.organization = payload.organization.strip() or None
        if payload.phone is not None:
            user.phone = payload.phone.strip() or None
        user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def serialize_user(user: User) -> dict[str, Any]:
        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "organization": user.organization,
            "phone": user.phone,
            "role": user.role,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
        }
