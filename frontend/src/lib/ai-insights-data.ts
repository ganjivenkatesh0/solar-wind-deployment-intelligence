/**
 * AI Insights tab presentation data layer.
 *
 * Every value the AI Insights tab renders lives here so the backend analysis
 * response can be mapped 1:1 into this shape later without touching JSX.
 */

export type AiAccuracy = {
  id: "solar" | "wind" | "energy" | "financial";
  label: string;
  caption: string;
  value: string;
  badge: string;
};

export type ConfidenceRow = { label: string; share: number; color: string };

export type PredictionProbability = { label: string; value: number; color: string };

export type UncertaintyRow = {
  id: "solar" | "wind" | "financial";
  label: string;
  value: string;
};

export type FeatureImportance = { label: string; value: number };

export type EnsembleRow = {
  model: string;
  type: string;
  weight: string;
  accuracy: string;
  trend: "up" | "down";
};

export type SimilarProject = {
  location: string;
  type: string;
  match: string;
  status: string;
};

export type AnomalyRow = {
  id: "terrain" | "weather" | "infrastructure" | "environmental";
  label: string;
  detail: string;
  status: string;
};

export type AiInsightsData = {
  header: { title: string; subtitle: string };
  performance: {
    overall: { value: number; label: string; badge: string };
    accuracies: AiAccuracy[];
  };
  confidence: {
    headline: string;
    value: string;
    caption: string;
    rows: ConfidenceRow[];
  };
  dataIntelligence: {
    score: string;
    max: string;
    badge: string;
    caption: string;
  };
  predictions: {
    primary: {
      title: string;
      caption: string;
      rows: { label: string; value: string }[];
    };
    probabilities: PredictionProbability[];
    uncertainty: { caption: string; rows: UncertaintyRow[] };
  };
  featureImportance: { items: FeatureImportance[]; note: string };
  ensemble: {
    rows: EnsembleRow[];
    accuracy: string;
    weight: string;
  };
  similarProjects: SimilarProject[];
  anomalies: AnomalyRow[];
  summary: string[];
  modelStatus: { message: string; lastUpdate: string; badge: string };
};

