from datetime import date, time
from typing import Literal

from pydantic import BaseModel, ConfigDict


class ReportScheduleCreate(BaseModel):
    report_selection: Literal["all"]
    frequency: Literal["daily", "weekly", "monthly"]
    preferred_time: time
    start_date: date | None = None


class ReportScheduleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
