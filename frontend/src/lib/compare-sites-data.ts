import hyderabadImg from "@/assets/site-hyderabad.jpg";
import vijayawadaImg from "@/assets/site-vijayawada.jpg";
import anantapurImg from "@/assets/site-anantapur.jpg";
import kurnoolImg from "@/assets/site-kurnool.jpg";

/**
 * Compare Sites data layer.
 * Pure local/mock data — no API calls. Shapes are kept flat and serialisable so
 * a later task can swap `availableSites` for a backend response with no UI change.
 */

export type CompareTechnology = "Solar" | "Wind" | "Hybrid";

export type CriterionId =
  | "solar"
  | "wind"
  | "terrain"
  | "infrastructure"
  | "environmental"
  | "economic"
  | "feasibility";

export type CompareSite = {
  id: string;
  city: string;
  state: string;
  /** Short label used in chips and table headers, e.g. "Hyderabad, TS". */
  shortLabel: string;
  latitude: number;
  longitude: number;
  coordinates: string;
  suitability: number;
  technology: CompareTechnology;
  capacityMw: number;
  image?: string;
  scores: Record<CriterionId, number>;
};

export const comparisonCriteria: {
  id: CriterionId;
  label: string;
  weight: number;
  icon: "solar" | "wind" | "terrain" | "infrastructure" | "environmental" | "economic" | "feasibility";
  hint?: string;
}[] = [
  { id: "solar", label: "Solar Resource Potential", weight: 25, icon: "solar" },
  { id: "wind", label: "Wind Resource Potential", weight: 20, icon: "wind" },
  { id: "terrain", label: "Terrain & Topography", weight: 15, icon: "terrain" },
  {
    id: "infrastructure",
    label: "Infrastructure & Access",
    weight: 15,
    icon: "infrastructure",
    hint: "Grid proximity, substation headroom and road access",
  },
  {
    id: "environmental",
    label: "Environmental Factors",
    weight: 10,
    icon: "environmental",
    hint: "Protected areas, biodiversity and land-use sensitivity",
  },
  {
    id: "economic",
    label: "Economic Viability",
    weight: 10,
    icon: "economic",
    hint: "CAPEX, LCOE and projected payback period",
  },
  {
    id: "feasibility",
    label: "Technical Feasibility",
    weight: 5,
    icon: "feasibility",
    hint: "Constructability and technology fit",
  },
];

export const availableSites: CompareSite[] = [
  {
    id: "hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    shortLabel: "Hyderabad, TS",
    latitude: 17.385,
    longitude: 78.4867,
    coordinates: "17.3850° N, 78.4867° E",
    suitability: 82.6,
    technology: "Solar",
    capacityMw: 8,
    image: hyderabadImg,
    scores: {
      solar: 85,
      wind: 62,
      terrain: 78,
      infrastructure: 80,
      environmental: 75,
      economic: 70,
      feasibility: 95,
    },
  },
  {
    id: "vijayawada",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    shortLabel: "Vijayawada, AP",
    latitude: 16.5062,
    longitude: 80.648,
    coordinates: "16.5062° N, 80.6480° E",
    suitability: 71.3,
    technology: "Solar",
    capacityMw: 6,
    image: vijayawadaImg,
    scores: {
      solar: 72,
      wind: 65,
      terrain: 70,
      infrastructure: 68,
      environmental: 72,
      economic: 68,
      feasibility: 90,
    },
  },
  {
    id: "anantapur",
    city: "Anantapur",
    state: "Andhra Pradesh",
    shortLabel: "Anantapur, AP",
    latitude: 14.6819,
    longitude: 77.6006,
    coordinates: "14.6819° N, 77.6006° E",
    suitability: 65.2,
    technology: "Wind",
    capacityMw: 10,
    image: anantapurImg,
    scores: {
      solar: 68,
      wind: 78,
      terrain: 72,
      infrastructure: 60,
      environmental: 66,
      economic: 55,
      feasibility: 88,
    },
  },
  {
    id: "kurnool",
    city: "Kurnool",
    state: "Andhra Pradesh",
    shortLabel: "Kurnool, AP",
    latitude: 15.8281,
    longitude: 78.0373,
    coordinates: "15.8281° N, 78.0373° E",
    suitability: 58.7,
    technology: "Hybrid",
    capacityMw: 7.5,
    image: kurnoolImg,
    scores: {
      solar: 60,
      wind: 55,
      terrain: 65,
      infrastructure: 62,
      environmental: 59,
      economic: 54,
      feasibility: 85,
    },
  },
  {
    id: "guntur",
    city: "Guntur",
    state: "Andhra Pradesh",
    shortLabel: "Guntur, AP",
    latitude: 16.3067,
    longitude: 80.4365,
    coordinates: "16.3067° N, 80.4365° E",
    suitability: 69.4,
    technology: "Solar",
    capacityMw: 6.5,
    scores: {
      solar: 74,
      wind: 58,
      terrain: 71,
      infrastructure: 70,
      environmental: 68,
      economic: 64,
      feasibility: 88,
    },
  },
  {
    id: "nellore",
    city: "Nellore",
    state: "Andhra Pradesh",
    shortLabel: "Nellore, AP",
    latitude: 14.4426,
    longitude: 79.9865,
    coordinates: "14.4426° N, 79.9865° E",
    suitability: 63.8,
    technology: "Hybrid",
    capacityMw: 9,
    scores: {
      solar: 70,
      wind: 71,
      terrain: 63,
      infrastructure: 58,
      environmental: 61,
      economic: 60,
      feasibility: 86,
    },
  },
  {
    id: "warangal",
    city: "Warangal",
    state: "Telangana",
    shortLabel: "Warangal, TS",
    latitude: 17.9689,
    longitude: 79.5941,
    coordinates: "17.9689° N, 79.5941° E",
    suitability: 66.1,
    technology: "Solar",
    capacityMw: 5.5,
    scores: {
      solar: 76,
      wind: 52,
      terrain: 68,
      infrastructure: 66,
      environmental: 70,
      economic: 62,
      feasibility: 89,
    },
  },
  {
    id: "kadapa",
    city: "Kadapa",
    state: "Andhra Pradesh",
    shortLabel: "Kadapa, AP",
    latitude: 14.4674,
    longitude: 78.8241,
    coordinates: "14.4674° N, 78.8241° E",
    suitability: 61.5,
    technology: "Wind",
    capacityMw: 8.5,
    scores: {
      solar: 66,
      wind: 74,
      terrain: 60,
      infrastructure: 55,
      environmental: 63,
      economic: 57,
      feasibility: 84,
    },
  },
];

export const defaultSelectedIds = ["hyderabad", "vijayawada", "anantapur", "kurnool"];

export const maxCompareSites = 4;

/** Accent colours are positional (Site 1..4), matching the reference. */
export const siteAccents = [
  { name: "green", color: "var(--primary)", soft: "var(--primary-soft)" },
  { name: "blue", color: "var(--wind)", soft: "var(--wind-soft)" },
  { name: "purple", color: "var(--hybrid)", soft: "var(--hybrid-soft)" },
  { name: "orange", color: "var(--solar)", soft: "var(--solar-soft)" },
] as const;

export function accentFor(index: number) {
  return siteAccents[index % siteAccents.length]!;
}

export type MetricRow = {
  label: string;
  /** Formats a per-site value for one of the non-overview tabs. */
  value: (site: CompareSite) => string;
};

const r = (n: number, d = 1) => Number(n.toFixed(d));

export const metricTabs: Record<string, { rows: MetricRow[] }> = {
  resources: {
    rows: [
      { label: "Global Horizontal Irradiance", value: (s) => `${r(3.9 + s.scores.solar / 40)} kWh/m²/day` },
      { label: "Annual Sunshine Hours", value: (s) => `${Math.round(2200 + s.scores.solar * 8)} hrs` },
      { label: "Mean Wind Speed @100 m", value: (s) => `${r(3.4 + s.scores.wind / 22)} m/s` },
      { label: "Wind Power Density", value: (s) => `${Math.round(90 + s.scores.wind * 3.6)} W/m²` },
      { label: "Average Ambient Temperature", value: (s) => `${r(26 + (100 - s.scores.environmental) / 18)} °C` },
      { label: "Soiling / Dust Loss", value: (s) => `${r((100 - s.scores.environmental) / 14)} %` },
    ],
  },
  feasibility: {
    rows: [
      { label: "Distance to Nearest Substation", value: (s) => `${r(1.5 + (100 - s.scores.infrastructure) / 6)} km` },
      { label: "Available Grid Headroom", value: (s) => `${Math.round(s.scores.infrastructure * 0.9)} MW` },
      { label: "Road Access Quality", value: (s) => (s.scores.infrastructure > 70 ? "Excellent" : s.scores.infrastructure > 60 ? "Good" : "Moderate") },
      { label: "Average Terrain Slope", value: (s) => `${r((100 - s.scores.terrain) / 9)} °` },
      { label: "Usable Land Area", value: (s) => `${r(s.capacityMw * 4.2)} acres` },
      { label: "Technical Feasibility Score", value: (s) => `${s.scores.feasibility}/100` },
    ],
  },
  financial: {
    rows: [
      { label: "Annual Energy Generation", value: (s) => `${r(s.capacityMw * 1.72 * (s.suitability / 70), 2)} GWh` },
      { label: "Capacity Factor", value: (s) => `${r(16 + s.suitability / 6)} %` },
      { label: "Estimated CAPEX", value: (s) => `$${r(s.capacityMw * 0.78, 2)}M` },
      { label: "LCOE", value: (s) => `$${r(0.088 - s.suitability / 4000, 3)}/kWh` },
      { label: "Simple Payback", value: (s) => `${r(11.5 - s.scores.economic / 14)} yrs` },
      { label: "25-Year NPV", value: (s) => `$${r(s.capacityMw * 0.34 * (s.suitability / 60), 2)}M` },
      { label: "Project IRR", value: (s) => `${r(7 + s.scores.economic / 9)} %` },
    ],
  },
  ai: {
    rows: [
      { label: "Model Confidence", value: (s) => `${r(78 + s.suitability / 9)} %` },
      { label: "Prediction Accuracy", value: (s) => `${r(88 + s.scores.feasibility / 25)} %` },
      { label: "Input Data Quality", value: (s) => (s.suitability > 75 ? "High" : s.suitability > 62 ? "Medium-High" : "Medium") },
      { label: "Ensemble Agreement", value: (s) => `${r(74 + s.suitability / 7)} %` },
      { label: "Composite Risk Index", value: (s) => `${r((100 - s.suitability) / 10, 2)} / 10` },
      { label: "Recommended Technology", value: (s) => s.technology },
    ],
  },
  environmental: {
    rows: [
      { label: "Land Use Impact", value: (s) => (s.scores.environmental > 70 ? "Low" : s.scores.environmental > 62 ? "Moderate" : "Elevated") },
      { label: "Water Availability", value: (s) => (s.scores.environmental > 70 ? "Adequate" : "Limited") },
      { label: "Distance to Protected Area", value: (s) => `${r(4 + s.scores.environmental / 8)} km` },
      { label: "Biodiversity Sensitivity", value: (s) => `${r((100 - s.scores.environmental) / 10, 1)} / 10` },
      { label: "Annual CO₂ Offset", value: (s) => `${Math.round(s.capacityMw * 1180 * (s.suitability / 70))} t` },
      { label: "Environmental Score", value: (s) => `${s.scores.environmental}/100` },
    ],
  },
};

/** Weighted mean of the criteria scores — used for dynamic recomputation. */
export function weightedScore(site: CompareSite) {
  const totalWeight = comparisonCriteria.reduce((sum, c) => sum + c.weight, 0);
  const weighted = comparisonCriteria.reduce((sum, c) => sum + c.weight * site.scores[c.id], 0);
  return Number((weighted / totalWeight).toFixed(1));
}

export function rankSites(sites: CompareSite[]) {
  const ordered = [...sites].sort((a, b) => b.suitability - a.suitability);
  return new Map(ordered.map((s, i) => [s.id, i + 1]));
}

export function technologyBreakdown(sites: CompareSite[]) {
  const order: CompareTechnology[] = ["Solar", "Wind", "Hybrid"];
  return order
    .map((tech) => ({ technology: tech, count: sites.filter((s) => s.technology === tech).length }))
    .filter((d) => d.count > 0);
}

export const technologyColor: Record<CompareTechnology, string> = {
  Solar: "var(--solar)",
  Wind: "var(--wind)",
  Hybrid: "var(--primary)",
};
