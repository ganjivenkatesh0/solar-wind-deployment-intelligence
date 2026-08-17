import { apiRequest } from "./client";

export type AnalysisHistoryApiRecord = {
  id: number;
  analysis_id: string;
  location_name: string | null;
  latitude: number;
  longitude: number;
  project_type: "solar" | "wind" | "hybrid" | string;
  installation_type: "ground-mounted" | "rooftop" | "other" | string;
  land_area_hectares: number;
  available_budget: number;
  overall_site_score: number;
  recommended_deployment: string;
  status: "Completed" | "Failed" | "Running" | string;
  created_at: string;
  response_data: Record<string, unknown>;
};

export type AnalysisHistoryListResponse = {
  items: AnalysisHistoryApiRecord[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
};

export type AnalysisHistoryDetail = AnalysisHistoryApiRecord & {
  request_data: Record<string, unknown>;
};

export function listAnalysisHistory(
  page = 1,
  pageSize = 100,
  query?: string,
): Promise<AnalysisHistoryListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  if (query?.trim()) {
    params.set("query", query.trim());
  }

  return apiRequest<AnalysisHistoryListResponse>(
    `/analysis-history?${params.toString()}`,
  );
}

export function getAnalysisHistory(
  analysisId: string,
): Promise<AnalysisHistoryDetail> {
  return apiRequest<AnalysisHistoryDetail>(
    `/analysis-history/${encodeURIComponent(analysisId)}`,
  );
}

export function deleteAnalysisHistory(
  analysisId: string,
): Promise<{ status: string; analysis_id: string }> {
  return apiRequest<{ status: string; analysis_id: string }>(
    `/analysis-history/${encodeURIComponent(analysisId)}`,
    { method: "DELETE" },
  );
}
