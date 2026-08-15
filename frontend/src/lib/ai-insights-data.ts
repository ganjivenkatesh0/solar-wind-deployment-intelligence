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

export const aiInsightsData: AiInsightsData = {
  header: {
    title: "AI Insights",
    subtitle: "Advanced AI/ML analysis and intelligent predictions for the selected site",
  },
  performance: {
    overall: { value: 92.6, label: "Overall Model Accuracy", badge: "Excellent" },
    accuracies: [
      {
        id: "solar",
        label: "Solar Potential",
        caption: "Prediction Accuracy",
        value: "93.4%",
        badge: "Excellent",
      },
      {
        id: "wind",
        label: "Wind Potential",
        caption: "Prediction Accuracy",
        value: "91.8%",
        badge: "Excellent",
      },
      {
        id: "energy",
        label: "Energy Output",
        caption: "Prediction Accuracy",
        value: "92.1%",
        badge: "Excellent",
      },
      {
        id: "financial",
        label: "Financial Viability",
        caption: "Prediction Accuracy",
        value: "90.7%",
        badge: "Excellent",
      },
    ],
  },
  confidence: {
    headline: "High Confidence",
    value: "89%",
    caption: "Prediction confidence across all models",
    rows: [
      { label: "High (≥80%)", share: 89, color: "var(--success)" },
      { label: "Medium (60–79%)", share: 10, color: "var(--solar)" },
      { label: "Low (<60%)", share: 1, color: "var(--error)" },
    ],
  },
  dataIntelligence: {
    score: "94.3",
    max: "/100",
    badge: "Excellent",
    caption: "Quality and completeness of input data",
  },
  predictions: {
    primary: {
      title: "Optimal for Solar Project",
      caption: "AI Recommendation",
      rows: [
        { label: "Optimal Capacity", value: "8.0 MW" },
        { label: "Expected Annual Generation", value: "204.98 MWh/yr" },
        { label: "Investment Range", value: "$550.00K – $1.54M" },
        { label: "Estimated IRR", value: "17.8%" },
      ],
    },
    probabilities: [
      { label: "Solar Project", value: 82.6, color: "var(--success)" },
      { label: "Wind Project", value: 14.3, color: "var(--wind)" },
      { label: "Hybrid Project", value: 3.1, color: "var(--hybrid)" },
    ],
    uncertainty: {
      caption: "Prediction uncertainty (lower is better)",
      rows: [
        { id: "solar", label: "Solar", value: "±6.2%" },
        { id: "wind", label: "Wind", value: "±7.8%" },
        { id: "financial", label: "Financial", value: "±5.5%" },
      ],
    },
  },
  featureImportance: {
    items: [
      { label: "Solar Irradiance", value: 0.186 },
      { label: "Wind Speed", value: 0.162 },
      { label: "Land Slope", value: 0.128 },
      { label: "Elevation", value: 0.102 },
      { label: "Grid Proximity", value: 0.098 },
      { label: "Road Access", value: 0.076 },
      { label: "Land Use Type", value: 0.067 },
      { label: "Temperature", value: 0.062 },
      { label: "Population Density", value: 0.043 },
      { label: "Distance to Substation", value: 0.036 },
    ],
    note: "Higher importance score indicates greater influence on prediction",
  },
  ensemble: {
    rows: [
      {
        model: "XGBoost Regressor",
        type: "Tree Based",
        weight: "30%",
        accuracy: "93.2%",
        trend: "up",
      },
      { model: "Random Forest", type: "Ensemble", weight: "25%", accuracy: "91.6%", trend: "up" },
      {
        model: "Gradient Boosting",
        type: "Tree Based",
        weight: "20%",
        accuracy: "92.1%",
        trend: "up",
      },
      {
        model: "Neural Network",
        type: "Deep Learning",
        weight: "15%",
        accuracy: "90.8%",
        trend: "up",
      },
      {
        model: "Linear Regression",
        type: "Statistical",
        weight: "10%",
        accuracy: "85.4%",
        trend: "up",
      },
    ],
    accuracy: "92.6%",
    weight: "100%",
  },
  similarProjects: [
    { location: "Gadag, Karnataka", type: "Solar Project", match: "92%", status: "Success" },
    { location: "Kurnool, Andhra Pradesh", type: "Solar Project", match: "89%", status: "Success" },
    {
      location: "Anantapur, Andhra Pradesh",
      type: "Solar Project",
      match: "86%",
      status: "Success",
    },
  ],
  anomalies: [
    { id: "terrain", label: "Terrain Analysis", detail: "No anomalies detected", status: "Normal" },
    {
      id: "weather",
      label: "Weather Patterns",
      detail: "No anomalies detected",
      status: "Normal",
    },
    {
      id: "infrastructure",
      label: "Infrastructure Data",
      detail: "No anomalies detected",
      status: "Normal",
    },
    {
      id: "environmental",
      label: "Environmental Factors",
      detail: "No anomalies detected",
      status: "Normal",
    },
  ],
  summary: [
    "High solar irradiance and low cloud cover indicate excellent solar potential.",
    "Wind speeds are moderate but consistent, suitable for hybrid optimization.",
    "Proximity to grid and road access reduce infrastructure costs significantly.",
    "Land characteristics and topography are highly favorable.",
    "Financial projections indicate strong returns and short payback period.",
  ],
  modelStatus: {
    message:
      "AI models are continuously learning. Predictions improve with more data and user feedback.",
    lastUpdate: "Last Model Update: Aug 13, 2026 · 09:30 AM",
    badge: "Models Up to Date",
  },
};
