/**
 * Reports presentation data layer.
 *
 * Every value shown on /reports comes from this module so Task 12 can replace
 * it with a real API fetch without touching any JSX.
 */

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
  dateLabel: string;
  timeLabel: string;
  /** Sortable ISO timestamp, mirrors dateLabel/timeLabel. */
  generatedAt: string;
  technology: ReportTechnology;
  capacityLabel: string;
  status: ReportStatus;
  progress?: number;
  ownership: ReportOwnership;
  reportType: string;
  score: number;
  scoreLabel: string;
  annualGenerationLabel: string;
  recommendedTechnologyDetail: string;
  pageCount: number;
  downloads: number;
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

export const reportsSummary: ReportSummaryCard[] = [
  { label: "Total Reports", value: "18", caption: "All time generated", icon: "report", tone: "primary" },
  { label: "Completed", value: "16", caption: "Successfully generated", icon: "check", tone: "info" },
  { label: "In Progress", value: "2", caption: "Currently generating", icon: "progress", tone: "hybrid" },
  { label: "Downloads", value: "24", caption: "Total downloads", icon: "download", tone: "solar" },
];

export const reportImages: Record<ReportTechnology, string> = {
  Solar: solarImage,
  Wind: windImage,
  Hybrid: hybridImage,
};

function scoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 50) return "Moderate";
  return "Low";
}

type Seed = {
  id: string;
  subtitle: string;
  location: string;
  coordinatesLabel: string;
  dateLabel: string;
  timeLabel: string;
  generatedAt: string;
  technology: ReportTechnology;
  capacityLabel: string;
  status: ReportStatus;
  progress?: number;
  ownership: ReportOwnership;
  reportType: string;
  score: number;
  annualGenerationLabel: string;
  pageCount: number;
  downloads: number;
};

const seeds: Seed[] = [
  {
    id: "ANL-00018",
    subtitle: "Comprehensive Solar Project Analysis",
    location: "Hyderabad, Telangana",
    coordinatesLabel: "17.3850° N, 78.4867° E",
    dateLabel: "Aug 13, 2026",
    timeLabel: "10:48 AM",
    generatedAt: "2026-08-13T10:48:00",
    technology: "Solar",
    capacityLabel: "8.0 MW",
    status: "Completed",
    ownership: "mine",
    reportType: "Solar Project",
    score: 82.6,
    annualGenerationLabel: "86.72 MWh",
    pageCount: 32,
    downloads: 6,
  },
  {
    id: "ANL-00017",
    subtitle: "Wind Energy Feasibility Report",
    location: "Vijayawada, AP",
    coordinatesLabel: "16.5062° N, 80.6480° E",
    dateLabel: "Aug 12, 2026",
    timeLabel: "04:32 PM",
    generatedAt: "2026-08-12T16:32:00",
    technology: "Wind",
    capacityLabel: "6.0 MW",
    status: "Completed",
    ownership: "mine",
    reportType: "Wind Project",
    score: 76.4,
    annualGenerationLabel: "64.10 MWh",
    pageCount: 28,
    downloads: 4,
  },
  {
    id: "ANL-00016",
    subtitle: "Hybrid (Solar + Wind) Analysis",
    location: "Anantapur, AP",
    coordinatesLabel: "14.6819° N, 77.6006° E",
    dateLabel: "Aug 12, 2026",
    timeLabel: "11:20 AM",
    generatedAt: "2026-08-12T11:20:00",
    technology: "Hybrid",
    capacityLabel: "10.0 MW",
    status: "Completed",
    ownership: "shared",
    reportType: "Hybrid Project",
    score: 88.1,
    annualGenerationLabel: "112.40 MWh",
    pageCount: 41,
    downloads: 5,
  },
  {
    id: "ANL-00015",
    subtitle: "Solar Project Technical Report",
    location: "Kurnool, AP",
    coordinatesLabel: "15.8281° N, 78.0373° E",
    dateLabel: "Aug 11, 2026",
    timeLabel: "06:45 PM",
    generatedAt: "2026-08-11T18:45:00",
    technology: "Solar",
    capacityLabel: "7.5 MW",
    status: "Completed",
    ownership: "mine",
    reportType: "Solar Project",
    score: 79.3,
    annualGenerationLabel: "78.60 MWh",
    pageCount: 26,
    downloads: 3,
  },
  {
    id: "ANL-00014",
    subtitle: "Wind Resource Assessment",
    location: "Guntur, AP",
    coordinatesLabel: "16.3067° N, 80.4365° E",
    dateLabel: "Aug 11, 2026",
    timeLabel: "02:30 PM",
    generatedAt: "2026-08-11T14:30:00",
    technology: "Wind",
    capacityLabel: "7.0 MW",
    status: "Completed",
    ownership: "shared",
    reportType: "Wind Project",
    score: 71.8,
    annualGenerationLabel: "69.90 MWh",
    pageCount: 22,
    downloads: 2,
  },
  {
    id: "ANL-00013",
    subtitle: "Feasibility & Financial Analysis",
    location: "Nellore, AP",
    coordinatesLabel: "14.4426° N, 79.9865° E",
    dateLabel: "Aug 10, 2026",
    timeLabel: "10:28 AM",
    generatedAt: "2026-08-10T10:28:00",
    technology: "Solar",
    capacityLabel: "9.0 MW",
    status: "In Progress",
    progress: 65,
    ownership: "mine",
    reportType: "Solar Project",
    score: 74.2,
    annualGenerationLabel: "94.30 MWh",
    pageCount: 30,
    downloads: 0,
  },
  {
    id: "ANL-00012",
    subtitle: "Preliminary Site Assessment",
    location: "Warangal, Telangana",
    coordinatesLabel: "17.9689° N, 79.5941° E",
    dateLabel: "Aug 09, 2026",
    timeLabel: "05:55 PM",
    generatedAt: "2026-08-09T17:55:00",
    technology: "Hybrid",
    capacityLabel: "8.0 MW",
    status: "Failed",
    ownership: "mine",
    reportType: "Hybrid Project",
    score: 48.5,
    annualGenerationLabel: "—",
    pageCount: 0,
    downloads: 0,
  },
  {
    id: "ANL-00011",
    subtitle: "Solar Rooftop Portfolio Review",
    location: "Karimnagar, Telangana",
    coordinatesLabel: "18.4386° N, 79.1288° E",
    dateLabel: "Aug 08, 2026",
    timeLabel: "09:15 AM",
    generatedAt: "2026-08-08T09:15:00",
    technology: "Solar",
    capacityLabel: "5.5 MW",
    status: "Completed",
    ownership: "mine",
    reportType: "Solar Project",
    score: 68.9,
    annualGenerationLabel: "52.40 MWh",
    pageCount: 19,
    downloads: 1,
  },
  {
    id: "ANL-00010",
    subtitle: "Coastal Wind Corridor Study",
    location: "Kakinada, AP",
    coordinatesLabel: "16.9891° N, 82.2475° E",
    dateLabel: "Aug 07, 2026",
    timeLabel: "03:05 PM",
    generatedAt: "2026-08-07T15:05:00",
    technology: "Wind",
    capacityLabel: "12.0 MW",
    status: "Completed",
    ownership: "shared",
    reportType: "Wind Project",
    score: 90.2,
    annualGenerationLabel: "138.70 MWh",
    pageCount: 44,
    downloads: 7,
  },
  {
    id: "ANL-00009",
    subtitle: "Hybrid Microgrid Feasibility",
    location: "Adilabad, Telangana",
    coordinatesLabel: "19.6640° N, 78.5320° E",
    dateLabel: "Aug 06, 2026",
    timeLabel: "12:40 PM",
    generatedAt: "2026-08-06T12:40:00",
    technology: "Hybrid",
    capacityLabel: "6.5 MW",
    status: "Completed",
    ownership: "mine",
    reportType: "Hybrid Project",
    score: 73.5,
    annualGenerationLabel: "71.20 MWh",
    pageCount: 27,
    downloads: 2,
  },
  {
    id: "ANL-00008",
    subtitle: "Utility Solar Grid Impact Report",
    location: "Tirupati, AP",
    coordinatesLabel: "13.6288° N, 79.4192° E",
    dateLabel: "Aug 05, 2026",
    timeLabel: "08:20 AM",
    generatedAt: "2026-08-05T08:20:00",
    technology: "Solar",
    capacityLabel: "15.0 MW",
    status: "Completed",
    ownership: "shared",
    reportType: "Solar Project",
    score: 85.7,
    annualGenerationLabel: "162.10 MWh",
    pageCount: 38,
    downloads: 5,
  },
  {
    id: "ANL-00007",
    subtitle: "Wind Turbine Siting Analysis",
    location: "Nizamabad, Telangana",
    coordinatesLabel: "18.6725° N, 78.0941° E",
    dateLabel: "Aug 04, 2026",
    timeLabel: "04:10 PM",
    generatedAt: "2026-08-04T16:10:00",
    technology: "Wind",
    capacityLabel: "4.5 MW",
    status: "In Progress",
    progress: 32,
    ownership: "mine",
    reportType: "Wind Project",
    score: 64.4,
    annualGenerationLabel: "41.60 MWh",
    pageCount: 18,
    downloads: 0,
  },
  {
    id: "ANL-00006",
    subtitle: "Solar Land Suitability Screening",
    location: "Chittoor, AP",
    coordinatesLabel: "13.2172° N, 79.1003° E",
    dateLabel: "Aug 03, 2026",
    timeLabel: "11:05 AM",
    generatedAt: "2026-08-03T11:05:00",
    technology: "Solar",
    capacityLabel: "6.0 MW",
    status: "Completed",
    ownership: "mine",
    reportType: "Solar Project",
    score: 77.1,
    annualGenerationLabel: "60.80 MWh",
    pageCount: 21,
    downloads: 2,
  },
  {
    id: "ANL-00005",
    subtitle: "Hybrid Storage Sizing Report",
    location: "Khammam, Telangana",
    coordinatesLabel: "17.2473° N, 80.1514° E",
    dateLabel: "Aug 02, 2026",
    timeLabel: "02:55 PM",
    generatedAt: "2026-08-02T14:55:00",
    technology: "Hybrid",
    capacityLabel: "9.5 MW",
    status: "Failed",
    ownership: "shared",
    reportType: "Hybrid Project",
    score: 55.3,
    annualGenerationLabel: "—",
    pageCount: 0,
    downloads: 0,
  },
  {
    id: "ANL-00004",
    subtitle: "Wind Energy Yield Projection",
    location: "Ongole, AP",
    coordinatesLabel: "15.5057° N, 80.0499° E",
    dateLabel: "Aug 01, 2026",
    timeLabel: "09:35 AM",
    generatedAt: "2026-08-01T09:35:00",
    technology: "Wind",
    capacityLabel: "8.5 MW",
    status: "Completed",
    ownership: "mine",
    reportType: "Wind Project",
    score: 80.9,
    annualGenerationLabel: "96.40 MWh",
    pageCount: 29,
    downloads: 3,
  },
  {
    id: "ANL-00003",
    subtitle: "Solar Financial Model Summary",
    location: "Mahbubnagar, Telangana",
    coordinatesLabel: "16.7488° N, 77.9854° E",
    dateLabel: "Jul 31, 2026",
    timeLabel: "05:12 PM",
    generatedAt: "2026-07-31T17:12:00",
    technology: "Solar",
    capacityLabel: "7.0 MW",
    status: "Completed",
    ownership: "mine",
    reportType: "Solar Project",
    score: 70.6,
    annualGenerationLabel: "73.10 MWh",
    pageCount: 24,
    downloads: 1,
  },
  {
    id: "ANL-00002",
    subtitle: "Regional Renewable Potential Review",
    location: "Srikakulam, AP",
    coordinatesLabel: "18.2949° N, 83.8938° E",
    dateLabel: "Jul 30, 2026",
    timeLabel: "10:02 AM",
    generatedAt: "2026-07-30T10:02:00",
    technology: "Hybrid",
    capacityLabel: "11.0 MW",
    status: "Completed",
    ownership: "shared",
    reportType: "Hybrid Project",
    score: 83.4,
    annualGenerationLabel: "124.60 MWh",
    pageCount: 36,
    downloads: 4,
  },
  {
    id: "ANL-00001",
    subtitle: "Baseline Site Screening Report",
    location: "Medak, Telangana",
    coordinatesLabel: "18.0460° N, 78.2600° E",
    dateLabel: "Jul 29, 2026",
    timeLabel: "01:48 PM",
    generatedAt: "2026-07-29T13:48:00",
    technology: "Solar",
    capacityLabel: "4.0 MW",
    status: "Completed",
    ownership: "mine",
    reportType: "Solar Project",
    score: 61.2,
    annualGenerationLabel: "38.90 MWh",
    pageCount: 16,
    downloads: 1,
  },
];

const technologyDetail: Record<ReportTechnology, string> = {
  Solar: "PV System",
  Wind: "Turbine Array",
  Hybrid: "PV + Turbine",
};

export const reportRecords: ReportRecord[] = seeds.map((seed) => ({
  ...seed,
  name: `${seed.id} Report`,
  scoreLabel: scoreLabel(seed.score),
  recommendedTechnologyDetail: technologyDetail[seed.technology],
}));

export const reportTemplates: ReportTemplate[] = [
  {
    id: "TPL-SOLAR-FULL",
    name: "Comprehensive Solar Analysis",
    description: "Full solar assessment with irradiance, yield, financials and risk sections.",
    technology: "Solar",
    sections: 9,
    pages: "28–36 pages",
  },
  {
    id: "TPL-WIND-FEAS",
    name: "Wind Feasibility Report",
    description: "Wind resource, turbine siting, capacity factor and grid interconnection review.",
    technology: "Wind",
    sections: 8,
    pages: "22–30 pages",
  },
  {
    id: "TPL-HYBRID",
    name: "Hybrid (Solar + Wind) Study",
    description: "Combined generation profile, storage sizing and blended financial model.",
    technology: "Hybrid",
    sections: 11,
    pages: "34–44 pages",
  },
  {
    id: "TPL-SCREEN",
    name: "Preliminary Site Screening",
    description: "Lightweight screening summary for early-stage site shortlisting.",
    technology: "Solar",
    sections: 5,
    pages: "10–16 pages",
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

export function matchesReportQuery(record: ReportRecord, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [
    record.id,
    record.name,
    record.subtitle,
    record.location,
    record.coordinatesLabel,
    record.technology,
    record.reportType,
  ].some((field) => field.toLowerCase().includes(q));
}

export function matchesReportFilter(record: ReportRecord, filter: ReportFilterId) {
  if (filter === "all") return true;
  if (filter === "Solar" || filter === "Wind" || filter === "Hybrid") return record.technology === filter;
  return record.status === filter;
}

export function sortReports(records: ReportRecord[], sort: ReportSortId) {
  const rows = [...records];
  rows.sort((a, b) => {
    switch (sort) {
      case "oldest":
        return a.generatedAt.localeCompare(b.generatedAt);
      case "score-desc":
        return b.score - a.score;
      case "score-asc":
        return a.score - b.score;
      default:
        return b.generatedAt.localeCompare(a.generatedAt);
    }
  });
  return rows;
}

export function findReport(id: string) {
  return reportRecords.find((record) => record.id === id);
}

export const defaultReportId = "ANL-00018";
