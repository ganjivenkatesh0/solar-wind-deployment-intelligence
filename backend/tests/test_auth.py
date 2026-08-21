from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import Base, get_db
from app.models.settings import Settings
from app.models.user import User
from app.api.auth import router as auth_router
from app.api.settings import router as settings_router


def make_client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    session_factory = sessionmaker(bind=engine)

    app = FastAPI()
    app.include_router(auth_router)
    app.include_router(auth_router, prefix="/api")
    app.include_router(settings_router)
    app.include_router(settings_router, prefix="/api")

    def get_test_db():
        db = session_factory()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = get_test_db
    return TestClient(app)


def test_user_registration_and_me():
    client = make_client()

    response = client.post(
        "/auth/register",
        json={
            "name": "Alice Example",
            "email": "alice@example.com",
            "password": "Password123!",
            "organization": "Solar Labs",
            "phone": "+1 555 0100",
        },
    )
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["user"]["email"] == "alice@example.com"
    assert "password_hash" not in body["user"]
    assert "session_token" in response.cookies

    me = client.get("/auth/me")
    assert me.status_code == 200, me.text
    assert me.json()["email"] == "alice@example.com"


def test_duplicate_email_rejected():
    client = make_client()
    payload = {
        "name": "Alice Example",
        "email": "duplicate@example.com",
        "password": "Password123!",
        "organization": "Solar Labs",
        "phone": "+1 555 0100",
    }

    assert client.post("/auth/register", json=payload).status_code == 200
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()


def test_login_success_and_failure():
    client = make_client()
    client.post(
        "/auth/register",
        json={
            "name": "Bob Example",
            "email": "bob@example.com",
            "password": "Password123!",
            "organization": "Wind Works",
            "phone": "+1 555 0101",
        },
    )

    response = client.post(
        "/auth/login",
        json={"email": "bob@example.com", "password": "Password123!"},
    )
    assert response.status_code == 200
    assert response.json()["user"]["email"] == "bob@example.com"

    bad = client.post(
        "/auth/login",
        json={"email": "bob@example.com", "password": "WrongPassword!"},
    )
    assert bad.status_code == 401


def test_profile_update_and_user_isolation():
    client = make_client()
    client.post(
        "/auth/register",
        json={
            "name": "Charlie Example",
            "email": "charlie@example.com",
            "password": "Password123!",
            "organization": "Cloud Solar",
            "phone": "+1 555 0102",
        },
    )

    update = client.put(
        "/auth/me",
        json={"name": "Charlie Updated", "organization": "Updated Org", "phone": "+1 555 9999"},
    )
    assert update.status_code == 200
    assert update.json()["name"] == "Charlie Updated"

    response = client.get("/auth/me")
    assert response.status_code == 200
    assert response.json()["name"] == "Charlie Updated"

    client2 = make_client()
    other = client2.post(
        "/auth/register",
        json={
            "name": "Dana Example",
            "email": "dana@example.com",
            "password": "Password123!",
            "organization": "Other Co",
            "phone": "+1 555 0103",
        },
    )
    assert other.status_code == 200

    me = client.get("/auth/me")
    assert me.json()["email"] == "charlie@example.com"


def test_logout_clears_session_and_auth_protection():
    client = make_client()
    client.post(
        "/auth/register",
        json={
            "name": "Eve Example",
            "email": "eve@example.com",
            "password": "Password123!",
            "organization": "BrightWind",
            "phone": "+1 555 0104",
        },
    )

    protected = client.get("/auth/me")
    assert protected.status_code == 200

    logout = client.post("/auth/logout")
    assert logout.status_code == 200
    assert "session_token" in logout.cookies

    after_logout = client.get("/auth/me")
    assert after_logout.status_code == 401


def test_settings_use_authenticated_user_account():
    client = make_client()
    reg = client.post(
        "/auth/register",
        json={
            "name": "Frank Example",
            "email": "frank@example.com",
            "password": "Password123!",
            "organization": "SunCore",
            "phone": "+1 555 0105",
        },
    )
    assert reg.status_code == 200

    response = client.get("/settings")
    assert response.status_code == 200
    payload = response.json()
    assert payload["account"]["name"] == "Frank Example"
    assert payload["account"]["email"] == "frank@example.com"

    updated = client.put(
        "/settings",
        json={
            **payload,
            "account": {**payload["account"], "name": "Frank Updated"},
        },
    )
    assert updated.status_code == 200
    assert updated.json()["account"]["name"] == "Frank Updated"

    me = client.get("/auth/me")
    assert me.json()["name"] == "Frank Updated"
