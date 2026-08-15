/**
 * Dashboard presentation data layer.
 *
 * The real analysis API is not wired into this screen yet. Every value the
 * Dashboard renders is defined here so it can later be mapped 1:1 from the
 * existing analysis response without touching any JSX.
 */

export type MonthlyPoint = { month: string; value: number };

export type DashboardData = {
  site: {
    location: string;
    coordinatesLabel: string;
    latitude: number;
    longitude: number;
    landAreaLabel: string;
    budgetLabel: string;
    analysisTimeLabel: string;
  };
  suitability: {
    score: number;
    outOf: number;
    rating: string;
    note: string;
  };
  technology: {
    name: string;
    subtitle: string;
    capacityLabel: string;
    capacityCaption: string;
  };
  feasibility: {
    verdict: string;
    caption: string;
    score: number;
    outOf: number;
    breakdown: { label: string; score: number; icon: "terrain" | "infrastructure" | "land" | "grid" | "environmental" }[];
  };
  energy: {
    totalLabel: string;
    totalCaption: string;
    total: number;
    solar: number;
    wind: number;
    solarLabel: string;
    windLabel: string;
    solarShare: number;
    windShare: number;
    solarCapacityFactor: string;
    windCapacityFactor: string;
  };
  resources: {
    solar: { value: string; unit: string; rating: string; monthly: MonthlyPoint[] };
    wind: { value: string; unit: string; rating: string; monthly: MonthlyPoint[] };
    environment: { value: string; unit: string; label: string; icon: "temperature" | "humidity" | "sun" | "pressure" }[];
  };
  financial: {
    metrics: { value: string; label: string; tone: "success" | "info" | "warning" | "solar" }[];
    cashFlow: { year: string; value: number }[];
  };
  ai: {
    metricLabel: string;
    metricValue: string;
    metricUnit: string;
    badge: string;
    description: string;
    factors: { label: string; weight: number }[];
  };
  recommendation: {
    title: string;
    summary: string;
    confidence: string;
    priority: string;
    expansion: string;
  };
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const solarMonthly = [4.02, 4.35, 4.68, 4.86, 4.72, 3.68, 3.34, 3.42, 3.86, 4.24, 4.12, 3.95];
const windMonthly = [3.12, 3.28, 3.34, 3.52, 4.02, 4.48, 4.36, 4.12, 3.62, 3.18, 3.05, 3.14];

const toMonthly = (values: number[]): MonthlyPoint[] =>
  MONTHS.map((month, i) => ({ month, value: values[i] ?? 0 }));

export const dashboardData: DashboardData = {
  site: {
    location: "Hyderabad, Telangana, India",
    coordinatesLabel: "17.3850° N, 78.4867° E",
    latitude: 17.385,
    longitude: 78.4867,
    landAreaLabel: "40.0 hectares",
    budgetLabel: "$5,000,000",
    analysisTimeLabel: "Aug 13, 2026 • 10:45 AM",
  },
  suitability: {
    score: 82.6,
    outOf: 100,
    rating: "Excellent",
    note: "High potential for renewable deployment",
  },
  technology: {
    name: "Solar",
    subtitle: "Primary Recommendation",
    capacityLabel: "8.0 MW",
    capacityCaption: "Recommended Capacity",
  },
  feasibility: {
    verdict: "Feasible",
    caption: "All systems operational",
    score: 95.5,
    outOf: 100,
    breakdown: [
      { label: "Terrain Suitability", score: 93, icon: "terrain" },
      { label: "Infrastructure", score: 95.5, icon: "infrastructure" },
      { label: "Land Suitability", score: 94, icon: "land" },
      { label: "Grid Proximity", score: 96, icon: "grid" },
      { label: "Environmental", score: 92, icon: "environmental" },
    ],
  },
  energy: {
    totalLabel: "204.98 MWh",
    totalCaption: "Total Estimated",
    total: 204.98,
    solar: 86.72,
    wind: 118.26,
    solarLabel: "86.72 MWh",
    windLabel: "118.26 MWh",
    solarShare: 42.3,
    windShare: 57.7,
    solarCapacityFactor: "18.5%",
    windCapacityFactor: "30.0%",
  },
  resources: {
    solar: {
      value: "4.15",
      unit: "kWh/m²/day",
      rating: "Excellent",
      monthly: toMonthly(solarMonthly),
    },
    wind: {
      value: "3.72",
      unit: "m/s",
      rating: "Moderate",
      monthly: toMonthly(windMonthly),
    },
    environment: [
      { value: "20.4", unit: "°C", label: "Temperature", icon: "temperature" },
      { value: "65.44", unit: "%", label: "Humidity", icon: "humidity" },
      { value: "6.8", unit: "h", label: "Sun Hours/Day", icon: "sun" },
      { value: "1021", unit: "hPa", label: "Air Pressure", icon: "pressure" },
    ],
  },
  financial: {
    metrics: [
      { value: "$550.00K", label: "Total Investment", tone: "success" },
      { value: "$1.54M", label: "Annual Revenue", tone: "info" },
      { value: "179.52%", label: "ROI", tone: "warning" },
      { value: "0.36 Years", label: "Payback Period", tone: "solar" },
    ],
    cashFlow: [
      { year: "Year 0", value: -550000 },
      { year: "Year 1", value: 260000 },
      { year: "Year 2", value: 690000 },
      { year: "Year 3", value: 1120000 },
      { year: "Year 4", value: 1560000 },
      { year: "Year 5", value: 1990000 },
    ],
  },
  ai: {
    metricLabel: "Solar PVOUT Potential",
    metricValue: "3.25",
    metricUnit: "kWh/kWp/day",
    badge: "High Potential",
    description:
      "RandomForestRegressor model predicts solar potential based on multiple environmental and infrastructure factors.",
    factors: [
      { label: "Hydro Surface Water", weight: 39.3 },
      { label: "Governance Score", weight: 22.1 },
      { label: "Offshore Wind Potential", weight: 20.0 },
      { label: "Land Suitability", weight: 10.2 },
      { label: "Population Density", weight: 8.4 },
    ],
  },
  recommendation: {
    title: "Deployment Recommendation",
    summary: "Solar deployment is recommended for this location with 8.0 MW capacity.",
    confidence: "High (82.6%)",
    priority: "Medium",
    expansion: "Expandable",
  },
};
