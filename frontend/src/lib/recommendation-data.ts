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

