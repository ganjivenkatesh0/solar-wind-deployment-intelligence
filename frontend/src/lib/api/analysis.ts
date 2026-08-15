import { apiRequest } from "./client";

export type AnalysisRequest = {
  latitude: number;
  longitude: number;
  land_area_hectares: number;
  available_budget: number;
};

export type AnalysisResponse = {
  solar_features: {
    solar_irradiance: number;
    temperature: number;
    relative_humidity: number;
  };

  wind_assessment: {
    wind_speed: number;
    classification: string;
    capacity_factor: number;
  };

  renewable_score: number;
  terrain_score: number;
  infrastructure_score: number;
  environmental_score: number;
  economic_score: number;
  overall_site_score: number;

  ml_prediction: unknown;
  technical_feasibility: unknown;

  site_suitability: number;
  recommended_deployment: string;

  energy_yield: unknown;
  financial_metrics: unknown;

  recommendation_reason: string;
  deployment_plan: unknown;
};

export function runAnalysis(
  request: AnalysisRequest,
): Promise<AnalysisResponse> {
  return apiRequest<AnalysisResponse>("/analysis", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
