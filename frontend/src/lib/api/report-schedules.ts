import { apiRequest } from "./client";

export type ReportScheduleInput = {
  report_selection: "all";
  frequency: "daily" | "weekly" | "monthly";
  preferred_time: string;
  start_date: string | null;
};

export function createReportSchedule(input: ReportScheduleInput) {
  return apiRequest<{ id: number; status: string }>("/report-schedules", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
