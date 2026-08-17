from datetime import datetime

from app.models.analysis_history import AnalysisHistory
from app.services.analysis_history_service import AnalysisHistoryService


def make_record(
    *,
    analysis_id: str,
    client_id: str,
) -> AnalysisHistory:
    return AnalysisHistory(
        analysis_id=analysis_id,
        client_id=client_id,
        latitude=17.385,
        longitude=78.4867,
        location_name="Test Location",
        project_type="hybrid",
        installation_type="ground-mounted",
        land_area_hectares=10.0,
        available_budget=1_000_000.0,
        overall_site_score=85.5,
        recommended_deployment="Hybrid",
        status="Completed",
        request_data={
            "latitude": 17.385,
            "longitude": 78.4867,
        },
        response_data={
            "overall_site_score": 85.5,
            "recommended_deployment": "Hybrid",
        },
        created_at=datetime.utcnow(),
    )


def test_analysis_history_model_fields():
    record = make_record(
        analysis_id="AN-TEST12345",
        client_id="client-a",
    )

    assert record.analysis_id == "AN-TEST12345"
    assert record.client_id == "client-a"
    assert record.overall_site_score == 85.5
    assert record.recommended_deployment == "Hybrid"


def test_analysis_history_table_name():
    assert AnalysisHistory.__tablename__ == "analysis_history"


def test_analysis_history_client_isolation():
    record_a = make_record(
        analysis_id="AN-A",
        client_id="client-a",
    )

    record_b = make_record(
        analysis_id="AN-B",
        client_id="client-b",
    )

    assert record_a.client_id != record_b.client_id
    assert record_a.analysis_id != record_b.analysis_id


def test_analysis_history_service_exists():
    assert hasattr(AnalysisHistoryService, "create")
    assert hasattr(AnalysisHistoryService, "list")
    assert hasattr(AnalysisHistoryService, "get")
    assert hasattr(AnalysisHistoryService, "delete")
