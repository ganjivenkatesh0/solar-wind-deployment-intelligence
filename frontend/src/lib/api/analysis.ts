import { apiRequest } from "./client";

export type AnalysisRequest = {
  latitude: number;
  longitude: number;
  land_area_hectares: number;
  available_budget: number;
  location_name?: string | null;
  project_type?: "solar" | "wind" | "hybrid";
  installation_type?: "ground-mounted" | "rooftop" | "other";
};

export type ConstraintResult = {
  passed?: boolean;
  status?: string;
  reason?: string;
  score?: number;
  value?: number;
  unit?: string;
  slope?: number;
  [key: string]: unknown;
};

export type FeasibilityConstraints = {
  terrain?: ConstraintResult;
  land_use?: ConstraintResult;
  grid_proximity?: ConstraintResult;
  road_accessibility?: ConstraintResult;
  [key: string]: ConstraintResult | undefined;
};

export type TechnicalFeasibility = {
  is_feasible: boolean;
  feasibility_score: number;
  decision: string;
  hard_constraints?: {
    passed?: boolean;
    constraints?: FeasibilityConstraints;
    failed_constraints?: string[];
  };
  soft_constraints?: {
    score?: number;
    constraints?: FeasibilityConstraints;
  };
  constraint_summary?: string;
};

export type EnergyYield = {
  solar_energy?: number;
  wind_energy?: number;
  total_energy?: number;
  deployment_type?: string;
};

export type FinancialMetrics = {
  annual_revenue?: number;
  estimated_project_cost?: number;
  payback_period?: number;
  roi?: number;
};

export type Recommendation = {
  deployment_type?: string;
  confidence?: number;
  priority?: string;
  reason?: string;
  generated_at?: string;
};

export type Optimization = {
  recommended_technology?: string;
  recommended_capacity_mw?: number;
  expansion_status?: string;
  [key: string]: unknown;
};

export type DeploymentPlan = {
  recommendation?: Recommendation;
  recommended_capacity_mw?: number;
  expansion_status?: string;
  energy_estimation?: EnergyYield;
  financial_analysis?: FinancialMetrics;
  optimization?: Optimization;
  [key: string]: unknown;
};

export type MlFeature = {
  feature: string;
  importance: number;
};

export type MlPrediction = {
  solar_pvout_potential?: number;
  explanation?: {
    top_features?: MlFeature[];
    summary?: string;
  };
  [key: string]: unknown;
};

export type AnalysisResponse = {
  solar_features: {
    solar_irradiance: number;
    temperature: number;
    relative_humidity: number;
    [key: string]: unknown;
  };

  wind_assessment: {
    wind_speed: number;
    classification: string;
    capacity_factor: number;
    [key: string]: unknown;
  };

  renewable_score: number;
  terrain_score: number;
  infrastructure_score: number;
  environmental_score: number;
  economic_score: number;
  overall_site_score: number;

  ml_prediction: MlPrediction;
  technical_feasibility: TechnicalFeasibility;

  site_suitability: number;
  recommended_deployment: string;

  energy_yield: EnergyYield;
  financial_metrics: FinancialMetrics;

  recommendation_reason: string;

  deployment_plan: DeploymentPlan;

  sentinel2?: Record<string, unknown> | null;
};

export function runAnalysis(
  request: AnalysisRequest,
): Promise<AnalysisResponse> {
  return apiRequest<AnalysisResponse>("/analysis", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
