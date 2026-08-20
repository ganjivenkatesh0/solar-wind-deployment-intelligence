from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.report_schedule import ReportSchedule
from app.schemas.report_schedule import ReportScheduleCreate, ReportScheduleResponse

router = APIRouter(prefix="/report-schedules", tags=["Report Schedules"])


def get_client_id(x_client_id: str | None = Header(default=None)) -> str:
    return x_client_id or "anonymous"


@router.post("", response_model=ReportScheduleResponse, status_code=201)
def create_report_schedule(
    payload: ReportScheduleCreate,
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    schedule = ReportSchedule(
        client_id=client_id,
        report_selection=payload.report_selection,
        frequency=payload.frequency,
        preferred_time=payload.preferred_time,
        start_date=payload.start_date,
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return {"id": schedule.id, "status": "scheduled"}
