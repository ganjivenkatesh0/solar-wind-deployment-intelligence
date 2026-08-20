from datetime import time

from app.models.report_schedule import ReportSchedule


def test_report_schedule_model_fields():
    schedule = ReportSchedule(
        client_id="client-1",
        report_selection="all",
        frequency="weekly",
        preferred_time=time(9, 0),
    )

    assert schedule.report_selection == "all"
    assert schedule.frequency == "weekly"
    assert schedule.preferred_time == time(9, 0)
