/**
 * New Analysis workflow presentation data + draft state helpers.
 * All values mirror the supplied reference screen and can later be replaced
 * 1:1 by the real analysis API payload without touching any JSX.
 */

export type AnalysisDraft = {
  latitude: string;
  longitude: string;
  searchQuery: string;
  landArea: string;
  budget: string;
  landUseType: string;
};

export const defaultAnalysisDraft: AnalysisDraft = {
  latitude: "17.3850",
  longitude: "78.4867",
  searchQuery: "",
  landArea: "40.0",
  budget: "5,000,000",
  landUseType: "open-land",
};

export const landUseOptions = [
  { value: "open-land", label: "Open Land" },
  { value: "barren-land", label: "Barren Land" },
  { value: "agricultural", label: "Agricultural" },
  { value: "industrial", label: "Industrial" },
  { value: "urban", label: "Urban / Built-up" },
  { value: "forest", label: "Forest / Protected" },
] as const;

export const analysisSteps = [
  { id: 1, label: "Site Details" },
  { id: 2, label: "Project Parameters" },
  { id: 3, label: "Preferences" },
  { id: 4, label: "Review & Submit" },
] as const;

export type AnalysisFactorIcon =
  | "solar"
  | "wind"
  | "terrain"
  | "infrastructure"
  | "feasibility"
  | "financial"
  | "ai";

export const analysisFactors: {
  icon: AnalysisFactorIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: "solar",
    title: "Solar Resource",
    description: "Solar irradiance, temperature, humidity & more",
  },
  {
    icon: "wind",
    title: "Wind Resource",
    description: "Wind speed, direction, density & classification",
  },
  {
    icon: "terrain",
    title: "Terrain Analysis",
    description: "Elevation, slope, terrain ruggedness",
  },
  {
    icon: "infrastructure",
    title: "Infrastructure & Access",
    description: "Roads, power lines, substations & proximity",
  },
  {
    icon: "feasibility",
    title: "Technical Feasibility",
    description: "Constraints, regulations & site suitability",
  },
  {
    icon: "financial",
    title: "Energy & Financial",
    description: "Generation estimates, costs & ROI analysis",
  },
  {
    icon: "ai",
    title: "AI Insights",
    description: "ML predictions and feature importance",
  },
];

export const analysisTips = [
  "Use precise coordinates for accurate results",
  "Ensure land area and budget are realistic",
  "Open land or barren land types give better suitability",
  "More data availability leads to higher accuracy",
];

/** Selected-location metadata shown next to the map. */
export const selectedLocationInfo = {
  name: "Hyderabad, Telangana, India",
  elevation: "607 m",
  terrainType: "Urban / Semi-Urban",
  timezone: "Asia/Kolkata (UTC +5:30)",
};

export function formatCoordinates(latitude: string, longitude: string) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return "—";
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(4)}° ${
    lon >= 0 ? "E" : "W"
  }`;
}

/** Numeric-only input sanitising (allows a single decimal point and minus sign). */
export function sanitizeDecimal(value: string) {
  const cleaned = value.replace(/[^\d.-]/g, "");
  const negative = cleaned.startsWith("-");
  const digits = cleaned.replace(/-/g, "");
  const parts = digits.split(".");
  const joined = parts.length > 1 ? `${parts[0]}.${parts.slice(1).join("")}` : digits;
  return (negative ? "-" : "") + joined;
}

/** Thousands-separated integer formatting for the budget field. */
export function formatThousands(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
}

const STORAGE_KEY = "swdi:new-analysis-draft";

export function loadDraft(): AnalysisDraft {
  if (typeof window === "undefined") return defaultAnalysisDraft;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAnalysisDraft;
    return { ...defaultAnalysisDraft, ...(JSON.parse(raw) as Partial<AnalysisDraft>) };
  } catch {
    return defaultAnalysisDraft;
  }
}

export function saveDraft(draft: AnalysisDraft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* storage unavailable — draft is kept in memory only */
  }
}

/* ------------------------------------------------------------------ */
/* Step 2 — Project Parameters                                         */
/* ------------------------------------------------------------------ */

export type ParametersDraft = {
  projectType: string;
  installationType: string;
  gridConnection: string;
  gridDistance: string;
  projectLifetime: string;
  capacityFactor: string;
  costPerMw: string;
  omCost: string;
  discountRate: string;
  targetCapacity: string;
  energyDemand: string;
};

export const defaultParametersDraft: ParametersDraft = {
  projectType: "solar",
  installationType: "ground-mounted",
  gridConnection: "available",
  gridDistance: "3.2",
  projectLifetime: "25",
  capacityFactor: "18.5",
  costPerMw: "687,500",
  omCost: "1.5",
  discountRate: "8.0",
  targetCapacity: "",
  energyDemand: "",
};

export const projectTypeOptions = [
  { value: "solar", label: "Solar Project" },
  { value: "wind", label: "Wind Project" },
  { value: "hybrid", label: "Hybrid Project" },
] as const;

export const installationTypeOptions = [
  { value: "ground-mounted", label: "Ground Mounted" },
  { value: "rooftop", label: "Rooftop" },
  { value: "other", label: "Other" },
] as const;

export const gridConnectionOptions = [
  { value: "available", label: "Available" },
  { value: "limited", label: "Limited" },
  { value: "not-available", label: "Not Available" },
] as const;

export type ParameterInfoIcon =
  | "solar"
  | "installation"
  | "grid"
  | "lifetime"
  | "cost"
  | "discount";

export const parameterInfoItems: {
  icon: ParameterInfoIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: "solar",
    title: "Project Type",
    description: "Choose between solar, wind, or hybrid projects.",
  },
  {
    icon: "installation",
    title: "Installation Type",
    description: "Ground mount, rooftop, or other installation configurations.",
  },
  {
    icon: "grid",
    title: "Grid Connection",
    description: "Grid availability and distance affects feasibility and costs.",
  },
  {
    icon: "lifetime",
    title: "Project Lifetime",
    description: "Longer projects have different financial implications.",
  },
  {
    icon: "cost",
    title: "Cost per MW",
    description: "Includes equipment, installation and initial infrastructure costs.",
  },
  {
    icon: "discount",
    title: "Discount Rate",
    description: "Used to calculate present value of future cash flows.",
  },
];

export const parameterTips = [
  "Accurate parameters lead to more reliable results",
  "You can review and edit all parameters in the next step",
  "System will suggest optimal capacity if left blank",
];

const PARAMS_STORAGE_KEY = "swdi:new-analysis-parameters";

export function loadParametersDraft(): ParametersDraft {
  if (typeof window === "undefined") return defaultParametersDraft;
  try {
    const raw = window.localStorage.getItem(PARAMS_STORAGE_KEY);
    if (!raw) return defaultParametersDraft;
    return { ...defaultParametersDraft, ...(JSON.parse(raw) as Partial<ParametersDraft>) };
  } catch {
    return defaultParametersDraft;
  }
}

export function saveParametersDraft(draft: ParametersDraft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PARAMS_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* storage unavailable — draft is kept in memory only */
  }
}

/* ------------------------------------------------------------------ */
/* Step 3 — Preferences                                                */
/* ------------------------------------------------------------------ */

export type AnalysisFocus = "solar" | "wind" | "hybrid" | "custom";

export type FactorKey =
  | "solarResource"
  | "windResource"
  | "terrain"
  | "infrastructure"
  | "environmental"
  | "economic"
  | "technical";

export type PreferencesDraft = {
  focus: AnalysisFocus;
  weights: Record<FactorKey, number>;
  riskTolerance: string;
  minFeasibility: string;
  futureProjections: boolean;
};

export const defaultFactorWeights: Record<FactorKey, number> = {
  solarResource: 25,
  windResource: 20,
  terrain: 15,
  infrastructure: 15,
  environmental: 10,
  economic: 10,
  technical: 5,
};

export const defaultPreferencesDraft: PreferencesDraft = {
  focus: "solar",
  weights: { ...defaultFactorWeights },
  riskTolerance: "medium",
  minFeasibility: "60",
  futureProjections: true,
};

export const analysisFocusOptions: {
  value: AnalysisFocus;
  title: string;
  description: string;
}[] = [
  {
    value: "solar",
    title: "Solar Focused",
    description: "Prioritize solar potential and PV generation",
  },
  {
    value: "wind",
    title: "Wind Focused",
    description: "Prioritize wind potential and wind generation",
  },
  {
    value: "hybrid",
    title: "Hybrid (Solar + Wind)",
    description: "Balance both solar and wind potential",
  },
  {
    value: "custom",
    title: "Custom",
    description: "Customize factor weights manually",
  },
];

export const factorPriorityItems: {
  key: FactorKey;
  label: string;
  hint: string;
}[] = [
  {
    key: "solarResource",
    label: "Solar Resource Potential",
    hint: "Solar irradiance and PV yield potential at the site",
  },
  {
    key: "windResource",
    label: "Wind Resource Potential",
    hint: "Wind speed, density and turbine suitability",
  },
  { key: "terrain", label: "Terrain & Topography", hint: "Slope, elevation and ruggedness" },
  {
    key: "infrastructure",
    label: "Infrastructure & Access",
    hint: "Roads, transmission lines and substations",
  },
  {
    key: "environmental",
    label: "Environmental Factors",
    hint: "Ecological sensitivity and land-use impact",
  },
  { key: "economic", label: "Economic Viability", hint: "Costs, revenue potential and ROI" },
  {
    key: "technical",
    label: "Technical Feasibility",
    hint: "Constraints, regulations and buildability",
  },
];

export const riskToleranceOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

export const preferenceInfoItems: {
  icon: "focus" | "priorities" | "risk" | "feasibility";
  title: string;
  description: string;
}[] = [
  {
    icon: "focus",
    title: "Analysis Focus",
    description: "Choose the type of project analysis you want to prioritize.",
  },
  {
    icon: "priorities",
    title: "Factor Priorities",
    description: "Higher percentage means more influence on the final score.",
  },
  {
    icon: "risk",
    title: "Risk Tolerance",
    description: "Affects financial assumptions and uncertainty handling.",
  },
  {
    icon: "feasibility",
    title: "Minimum Feasibility",
    description: "Filters out sites below your acceptable threshold.",
  },
];

const PREFS_STORAGE_KEY = "swdi:new-analysis-preferences";

export function loadPreferencesDraft(): PreferencesDraft {
  if (typeof window === "undefined") return defaultPreferencesDraft;
  try {
    const raw = window.localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return defaultPreferencesDraft;
    const parsed = JSON.parse(raw) as Partial<PreferencesDraft>;
    return {
      ...defaultPreferencesDraft,
      ...parsed,
      weights: { ...defaultFactorWeights, ...(parsed.weights ?? {}) },
    };
  } catch {
    return defaultPreferencesDraft;
  }
}

export function savePreferencesDraft(draft: PreferencesDraft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* storage unavailable — draft is kept in memory only */
  }
}
