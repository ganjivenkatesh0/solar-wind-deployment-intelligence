import type { AnalysisHistoryApiRecord } from "@/lib/api/analysis-history";
import solarImage from "@/assets/rec-solar.jpg";
import windImage from "@/assets/rec-wind.jpg";
import hybridImage from "@/assets/rec-hybrid.jpg";

export type ReportTechnology = "Solar" | "Wind" | "Hybrid";
export type ReportStatus = "Completed" | "In Progress" | "Failed";
export type ReportOwnership = "mine" | "shared";

export type ReportRecord = {
  id: string;
  name: string;
  subtitle: string;
  location: string;
  coordinatesLabel: string;
  latitude: number;
  longitude: number;
  dateLabel: string;
  timeLabel: string;
  generatedAt: string;
  technology: ReportTechnology;
  capacityLabel: string;
  status: ReportStatus;
  progress?: number;
  ownership: ReportOwnership;
  reportType: string;
  score: number | null;
  scoreLabel: string;
  annualGenerationLabel: string;
  recommendedTechnologyDetail: string;
  pageCount: number;
  downloads: number;
  responseData: Record<string, unknown>;
  requestData: {
    land_area_hectares: number;
    available_budget: number;
    project_type: string;
    installation_type: string;
  };
};

export type ReportSummaryCard = {
  label: string;
  value: string;
  caption: string;
  icon: "report" | "check" | "progress" | "download";
  tone: "primary" | "info" | "hybrid" | "solar";
};

export type ReportTemplate = {
  id: string;
  name: string;
  description: string;
  technology: ReportTechnology;
  sections: number;
  pages: string;
};

export const reportImages: Record<ReportTechnology, string> = {
  Solar: solarImage,
  Wind: windImage,
  Hybrid: hybridImage,
};

export const reportTemplates: ReportTemplate[] = [
  {
    id: "TPL-SOLAR-FULL",
    name: "Comprehensive Solar Analysis",
    description: "Full solar assessment with irradiance, yield, financials and risk sections.",
    technology: "Solar",
    sections: 9,
    pages: "28-36 pages",
  },
  {
    id: "TPL-WIND-FEAS",
    name: "Wind Feasibility Report",
    description: "Wind resource, turbine siting, capacity factor and grid interconnection review.",
    technology: "Wind",
    sections: 8,
    pages: "22-30 pages",
  },
  {
    id: "TPL-HYBRID",
    name: "Hybrid (Solar + Wind) Study",
    description: "Combined generation profile, storage sizing and blended financial model.",
    technology: "Hybrid",
    sections: 11,
    pages: "34-44 pages",
  },
  {
    id: "TPL-SCREEN",
    name: "Preliminary Site Screening",
    description: "Lightweight screening summary for early-stage site shortlisting.",
    technology: "Solar",
    sections: 5,
    pages: "10-16 pages",
  },
];

export const reportTabs = [
  { id: "all", label: "All Reports" },
  { id: "mine", label: "My Reports" },
  { id: "shared", label: "Shared With Me" },
  { id: "templates", label: "Templates" },
] as const;
export type ReportTabId = (typeof reportTabs)[number]["id"];

export const reportFilters = [
  { id: "all", label: "All" },
  { id: "Completed", label: "Completed" },
  { id: "In Progress", label: "In Progress" },
  { id: "Failed", label: "Failed" },
  { id: "Solar", label: "Solar" },
  { id: "Wind", label: "Wind" },
  { id: "Hybrid", label: "Hybrid" },
] as const;
export type ReportFilterId = (typeof reportFilters)[number]["id"];

export const reportSorts = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "score-desc", label: "Highest Score" },
  { id: "score-asc", label: "Lowest Score" },
] as const;
export type ReportSortId = (typeof reportSorts)[number]["id"];

function objectValue(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function formatNumber(value: unknown, digits = 1) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(digits) : "-";
}

function scoreLabel(score: number | null) {
  if (score === null) return "Unavailable";
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 50) return "Moderate";
  return "Low";
}

export function mapAnalysisToReport(item: AnalysisHistoryApiRecord): ReportRecord {
  const response = item.response_data ?? {};
  const deploymentPlan = objectValue(response["deployment_plan"]);
  const energy = objectValue(response["energy_yield"]);
  const optimization = objectValue(deploymentPlan["optimization"]);
  const recommendation = item.recommended_deployment || "Not Recommended";
  const lower = recommendation.toLowerCase();
  const technology: ReportTechnology = lower.includes("hybrid")
    ? "Hybrid"
    : lower.includes("wind")
      ? "Wind"
      : "Solar";
  const rawStatus = item.status.toLowerCase();
  const status: ReportStatus =
    rawStatus === "failed"
      ? "Failed"
      : rawStatus === "running" || rawStatus === "in progress"
        ? "In Progress"
        : "Completed";
  const created = new Date(item.created_at);
  const validDate = !Number.isNaN(created.getTime());
  const score = Number.isFinite(Number(item.overall_site_score))
    ? Number(item.overall_site_score)
    : null;
  const capacity =
    optimization["recommended_capacity_mw"] ?? deploymentPlan["recommended_capacity_mw"];
  const generation = energy["total_energy"];
  const location =
    item.location_name || `${item.latitude.toFixed(4)}°, ${item.longitude.toFixed(4)}°`;

  return {
    id: item.analysis_id,
    name: `${item.analysis_id} Report`,
    subtitle: `${technology} Project Analysis`,
    location,
    coordinatesLabel: `${item.latitude.toFixed(4)}° N, ${item.longitude.toFixed(4)}° E`,
    latitude: item.latitude,
    longitude: item.longitude,
    dateLabel: validDate
      ? created.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "-",
    timeLabel: validDate
      ? created.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      : "-",
    generatedAt: item.created_at,
    technology,
    capacityLabel: capacity === undefined ? "-" : `${formatNumber(capacity)} MW`,
    status,
    ownership: "mine",
    reportType: `${technology} Project`,
    score,
    scoreLabel: scoreLabel(score),
    annualGenerationLabel: generation === undefined ? "-" : `${formatNumber(generation, 2)} MWh`,
    recommendedTechnologyDetail: recommendation,
    pageCount: 0,
    downloads: 0,
    responseData: response,
    requestData: {
      land_area_hectares: item.land_area_hectares,
      available_budget: item.available_budget,
      project_type: item.project_type,
      installation_type: item.installation_type,
    },
  };
}

export function matchesReportQuery(record: ReportRecord, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return [
    record.id,
    record.name,
    record.subtitle,
    record.location,
    record.coordinatesLabel,
    record.technology,
    record.reportType,
  ].some((field) => field.toLowerCase().includes(normalized));
}

export function matchesReportFilter(record: ReportRecord, filter: ReportFilterId) {
  if (filter === "all") return true;
  if (filter === "Solar" || filter === "Wind" || filter === "Hybrid")
    return record.technology === filter;
  return record.status === filter;
}

export function sortReports(records: ReportRecord[], sort: ReportSortId) {
  return [...records].sort((a, b) => {
    if (sort === "score-desc") return (b.score ?? -1) - (a.score ?? -1);
    if (sort === "score-asc")
      return (a.score ?? Number.MAX_SAFE_INTEGER) - (b.score ?? Number.MAX_SAFE_INTEGER);
    return sort === "oldest"
      ? a.generatedAt.localeCompare(b.generatedAt)
      : b.generatedAt.localeCompare(a.generatedAt);
  });
}
