from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from app.api.settings import router
from app.database.database import Base, get_db
from app.models.settings import Settings
from app.schemas.settings import SettingsPayload


def make_client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine, tables=[Settings.__table__])
    with engine.begin() as connection:
        connection.exec_driver_sql(
            "CREATE TABLE analysis_history (client_id VARCHAR(128), status VARCHAR(32))"
        )
    session_factory = sessionmaker(bind=engine)

    app = FastAPI()
    app.include_router(router)
    app.include_router(router, prefix="/api")

    def get_test_db():
        db = session_factory()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = get_test_db
    return TestClient(app)


def test_settings_defaults_persist_and_reset():
    client = make_client()
    headers = {"X-Client-ID": "client-a"}

    response = client.get("/settings", headers=headers)
    assert response.status_code == 200
    assert response.json()["general"]["time_zone"] == "(UTC+05:30) Asia/Kolkata"

    payload = response.json()
    payload["general"]["currency"] = "EUR"
    payload["account"]["name"] = "Updated User"
    payload["notifications"]["weekly_digest"] = True

    response = client.put("/settings", json=payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["general"]["currency"] == "EUR"

    response = client.get("/settings", headers=headers)
    assert response.json()["account"]["name"] == "Updated User"
    assert response.json()["notifications"]["weekly_digest"] is True

    response = client.post("/settings/reset", headers=headers)
    assert response.status_code == 200
    assert response.json()["general"]["currency"] == "USD ($)"
    assert response.json()["account"]["name"] == "Ganji Venkatesh"

    response = client.get("/api/settings", headers=headers)
    assert response.status_code == 200


def test_settings_are_client_isolated():
    client = make_client()
    payload = SettingsPayload().model_dump(mode="json")
    payload["account"]["name"] = "Client A"

    assert client.put("/settings", json=payload, headers={"X-Client-ID": "client-a"}).status_code == 200
    response = client.get("/settings", headers={"X-Client-ID": "client-b"})

    assert response.status_code == 200
    assert response.json()["account"]["name"] == "Ganji Venkatesh"


def test_invalid_preference_weights_are_rejected():
    client = make_client()
    payload = SettingsPayload().model_dump(mode="json")
    payload["preferences"]["resource"] = 35

    response = client.put("/settings", json=payload, headers={"X-Client-ID": "client-a"})

    assert response.status_code == 422
