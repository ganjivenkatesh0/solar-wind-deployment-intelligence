import { apiDownload, apiDownloadFile, apiRequest } from "./client";

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

  return apiRequest<AnalysisHistoryListResponse>(`/analysis-history?${params.toString()}`);
}

export async function listAllAnalysisHistory(): Promise<AnalysisHistoryApiRecord[]> {
  const firstPage = await listAnalysisHistory(1, 100);
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(firstPage.pages - 1, 0) }, (_, index) =>
      listAnalysisHistory(index + 2, 100),
    ),
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.items);
}

export function getAnalysisHistory(analysisId: string): Promise<AnalysisHistoryDetail> {
  return apiRequest<AnalysisHistoryDetail>(`/analysis-history/${encodeURIComponent(analysisId)}`);
}

export function deleteAnalysisHistory(
  analysisId: string,
): Promise<{ status: string; analysis_id: string }> {
  return apiRequest<{ status: string; analysis_id: string }>(
    `/analysis-history/${encodeURIComponent(analysisId)}`,
    { method: "DELETE" },
  );
}

export function downloadAnalysisHistory(analysisId: string): Promise<Blob> {
  return apiDownload(`/analysis-history/${encodeURIComponent(analysisId)}/download`);
}

export function downloadAnalysisHistoryFile(
  analysisId: string,
): Promise<{ blob: Blob; filename: string }> {
  return apiDownloadFile(
    `/analysis-history/${encodeURIComponent(analysisId)}/download`,
    `${analysisId}.pdf`,
  );
}
