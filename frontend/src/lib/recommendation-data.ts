/**
 * Recommendation tab presentation data layer.
 *
 * Every value the Recommendation tab renders lives here so a backend analysis
 * response can later be mapped 1:1 into this shape without touching JSX.
 */

export type RecommendationMetric = { label: string; value: string };

export type PrimaryRecommendation = {
  name: string;
  badge: string;
  description: string;
  metrics: RecommendationMetric[];
  stats: {
    id: "capacity" | "performance" | "lcoe" | "availability";
    label: string;
    value: string;
    unit?: string;
  }[];
};

export type AlternativeRecommendation = {
  id: "wind" | "hybrid";
  name: string;
  badge: string;
  badgeTone: "wind" | "hybrid";
  description: string;
  metrics: RecommendationMetric[];
  score: number;
  scoreOutOf: number;
};

export type RoadmapPhase = {
  id: "engineering" | "procurement" | "construction" | "commissioning";
  period: string;
  label: string;
};

export type RiskRow = {
  factor: string;
  level: "Low" | "Medium" | "High";
  mitigation: string;
};

export type RecommendationData = {
  header: { title: string; subtitle: string };
  primary: PrimaryRecommendation;
  alternatives: AlternativeRecommendation[];
  advantages: string[];
  roadmap: RoadmapPhase[];
  risks: RiskRow[];
  overall: {
    title: string;
    summary: string;
    indicators: { id: "success" | "priority" | "readiness"; label: string; value: string }[];
    cta: string;
  };
};

export const recommendationData: RecommendationData = {
  header: {
    title: "Deployment Recommendations",
    subtitle: "AI-powered recommendations for optimal renewable energy deployment",
  },
  primary: {
    name: "Solar Power Plant",
    badge: "Recommended",
    description:
      "Based on comprehensive analysis, solar power plant is the optimal choice for this location.",
    metrics: [
      { label: "Recommended Capacity", value: "8.0 MW" },
      { label: "Annual Energy Generation", value: "86.72 MWh" },
      { label: "Estimated Investment", value: "$550,000 – $1.54M" },
      { label: "ROI (20 Years)", value: "179.52%" },
      { label: "Payback Period", value: "4.2 Years" },
      { label: "Confidence Level", value: "High (89%)" },
    ],
    stats: [
      { id: "capacity", label: "Capacity Factor", value: "28.6%" },
      { id: "performance", label: "Performance Ratio", value: "82.4%" },
      { id: "lcoe", label: "LCOE", value: "$0.068", unit: "/kWh" },
      { id: "availability", label: "System Availability", value: "98.7%" },
    ],
  },
  alternatives: [
    {
      id: "wind",
      name: "Wind Power Plant",
      badge: "Good Alternative",
      badgeTone: "wind",
      description: "Suitable wind resource with good consistency.",
      metrics: [
        { label: "Recommended Capacity", value: "3.0 MW" },
        { label: "Annual Energy Generation", value: "118.26 MWh" },
        { label: "Estimated Investment", value: "$420,000 – $1.20M" },
        { label: "ROI (20 Years)", value: "118.26%" },
      ],
      score: 76.4,
      scoreOutOf: 100,
    },
    {
      id: "hybrid",
      name: "Hybrid (Solar + Wind)",
      badge: "Viable Option",
      badgeTone: "hybrid",
      description: "Balanced solution for improved energy stability.",
      metrics: [
        { label: "Recommended Capacity", value: "5.0 MW (3 MW + 2 MW)" },
        { label: "Annual Energy Generation", value: "156.98 MWh" },
        { label: "Estimated Investment", value: "$820,000 – $2.10M" },
        { label: "ROI (20 Years)", value: "146.3%" },
      ],
      score: 81.2,
      scoreOutOf: 100,
    },
  ],
  advantages: [
    "High solar irradiance with excellent consistency",
    "Large available land with minimal constraints",
    "Strong financial returns with short payback period",
    "Low O&M cost and long system lifespan",
    "Substation and road access within 5 km",
  ],
  roadmap: [
    { id: "engineering", period: "0–3 Months", label: "Detailed Engineering & Approvals" },
    { id: "procurement", period: "4–6 Months", label: "Procurement & Site Preparation" },
    { id: "construction", period: "7–12 Months", label: "Construction & Installation" },
    { id: "commissioning", period: "13–14 Months", label: "Testing & Commissioning" },
  ],
  risks: [
    {
      factor: "Weather Variability",
      level: "Low",
      mitigation: "Use high-quality weather data & forecasting",
    },
    {
      factor: "Equipment Supply Delay",
      level: "Medium",
      mitigation: "Early procurement & multiple vendors",
    },
    { factor: "Regulatory Changes", level: "Low", mitigation: "Stay updated & maintain compliance" },
    { factor: "Grid Curtailment", level: "Low", mitigation: "Coordinate with grid operator" },
    { factor: "Financing Risk", level: "Medium", mitigation: "Secure funding with fixed terms" },
  ],
  overall: {
    title: "Overall Recommendation",
    summary: "Proceed with Solar Power Plant deployment with 8.0 MW capacity.",
    indicators: [
      { id: "success", label: "Success Probability", value: "92.8%" },
      { id: "priority", label: "Priority Level", value: "High" },
      { id: "readiness", label: "Implementation Readiness", value: "Ready" },
    ],
    cta: "Proceed to Project Parameters",
  },
};
