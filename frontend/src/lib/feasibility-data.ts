/**
 * Feasibility tab presentation data layer.
 *
 * Every value rendered by the Feasibility tab lives here so it can later be
 * mapped 1:1 from the backend analysis response without touching any JSX.
 */

export type FeasibilityKpi = {
  label: string;
  value: string;
  outOf: string;
  badge: string;
  tone: "success" | "wind" | "warning" | "hybrid";
  icon: "feasibility" | "readiness" | "risk" | "complexity";
};

export type ConstraintRow = {
  label: string;
  description: string;
  status: string;
  statusTone: "success" | "info" | "warning";
  distance: string;
  distanceCaption: string;
  icon: "water" | "road" | "grid" | "protected" | "slope";
};

export type FeasibilityData = {
  header: { title: string; subtitle: string };
  overall: {
    label: string;
    score: number;
    outOf: number;
    badge: string;
    note: string;
  };
  kpis: FeasibilityKpi[];
  breakdown: { label: string; score: number; icon: "terrain" | "infrastructure" | "land" | "grid" | "environmental" | "regulatory" }[];
  breakdownNote: string;
  radar: { dimension: string; score: number }[];
  radarCenter: string;
  constraints: ConstraintRow[];
  risk: {
    overall: string;
    overallLabel: string;
    slices: { label: string; value: number; color: string }[];
    factors: { label: string; level: "Low" | "Medium" | "High" }[];
  };
  summary: {
    title: string;
    description: string;
    metrics: { label: string; value: string; tone: "success" | "info" | "hybrid" }[];
  };
  recommendations: string[];
};

export const feasibilityData: FeasibilityData = {
  header: {
    title: "Feasibility Analysis",
    subtitle: "Comprehensive technical feasibility assessment for the selected site",
  },
  overall: {
    label: "Overall Feasibility Score",
    score: 95.5,
    outOf: 100,
    badge: "Excellent",
    note: "This site is highly feasible for renewable energy deployment",
  },
  kpis: [
    {
      label: "Technical Feasibility",
      value: "95.5",
      outOf: "/100",
      badge: "Excellent",
      tone: "wind",
      icon: "feasibility",
    },
    {
      label: "Site Readiness",
      value: "94.0",
      outOf: "/100",
      badge: "Excellent",
      tone: "success",
      icon: "readiness",
    },
    {
      label: "Risk Assessment",
      value: "18.6",
      outOf: "/100",
      badge: "Low Risk",
      tone: "warning",
      icon: "risk",
    },
    {
      label: "Implementation Complexity",
      value: "31.2",
      outOf: "/100",
      badge: "Low Complexity",
      tone: "hybrid",
      icon: "complexity",
    },
  ],
  breakdown: [
    { label: "Terrain Suitability", score: 93, icon: "terrain" },
    { label: "Infrastructure Access", score: 95.5, icon: "infrastructure" },
    { label: "Land Suitability", score: 94, icon: "land" },
    { label: "Grid Proximity", score: 96, icon: "grid" },
    { label: "Environmental Impact", score: 92, icon: "environmental" },
    { label: "Regulatory Compliance", score: 97, icon: "regulatory" },
  ],
  breakdownNote:
    "All key feasibility parameters are within acceptable ranges for successful project deployment.",
  radar: [
    { dimension: "Terrain", score: 93 },
    { dimension: "Infrastructure", score: 95.5 },
    { dimension: "Land Suitability", score: 94 },
    { dimension: "Grid Proximity", score: 96 },
    { dimension: "Environmental", score: 92 },
    { dimension: "Regulatory", score: 97 },
  ],
  radarCenter: "95.5",
  constraints: [
    {
      label: "Water Availability",
      description: "Adequate water sources available",
      status: "Good",
      statusTone: "success",
      distance: "1.2 km",
      distanceCaption: "Nearest Source",
      icon: "water",
    },
    {
      label: "Road Connectivity",
      description: "All-weather road access available",
      status: "Excellent",
      statusTone: "success",
      distance: "2.1 km",
      distanceCaption: "Nearest Road",
      icon: "road",
    },
    {
      label: "Grid Connection",
      description: "Grid connection feasible",
      status: "Excellent",
      statusTone: "success",
      distance: "3.4 km",
      distanceCaption: "Nearest Substation",
      icon: "grid",
    },
    {
      label: "Protected Areas",
      description: "No protected areas within project zone",
      status: "Clear",
      statusTone: "info",
      distance: "5.8 km",
      distanceCaption: "Nearest Boundary",
      icon: "protected",
    },
    {
      label: "Average Slope",
      description: "Suitable slope for installation",
      status: "Good",
      statusTone: "success",
      distance: "1 - 3°",
      distanceCaption: "Average Slope",
      icon: "slope",
    },
  ],
  risk: {
    overall: "18.6",
    overallLabel: "Low Risk",
    slices: [
      { label: "Low Risk (0-25)", value: 52.5, color: "var(--success)" },
      { label: "Medium Risk (25-50)", value: 31.0, color: "var(--warning)" },
      { label: "High Risk (50-75)", value: 12.5, color: "var(--solar)" },
      { label: "Very High Risk (75-100)", value: 4.0, color: "var(--error)" },
    ],
    factors: [
      { label: "Weather Variability", level: "Low" },
      { label: "Equipment Failure", level: "Low" },
      { label: "Regulatory Changes", level: "Medium" },
      { label: "Grid Availability", level: "Low" },
      { label: "Environmental Impact", level: "Low" },
    ],
  },
  summary: {
    title: "Highly Feasible Site",
    description:
      "This location demonstrates excellent feasibility across all evaluated parameters. The site is well-suited for renewable energy development with minimal risks and high success probability.",
    metrics: [
      { label: "Success Probability", value: "92.8%", tone: "success" },
      { label: "Implementation", value: "Easy", tone: "info" },
      { label: "Time to Deploy", value: "6 - 8 months", tone: "hybrid" },
    ],
  },
  recommendations: [
    "Proceed with detailed engineering studies",
    "Initiate land acquisition process",
    "Conduct environmental impact assessment",
    "Engage with grid operator for connection agreement",
    "Prepare financial model and secure funding",
    "Begin equipment procurement planning",
  ],
};
