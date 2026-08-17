import type { AnalysisRequest, AnalysisResponse } from "@/lib/api/analysis";
import type { AnalysisHistoryApiRecord } from "@/lib/api/analysis-history";
import type { CompareSite, CompareTechnology } from "@/lib/compare-sites-data";

function clamp(value: number) {
  return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function numberValue(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function technologyFromRecord(
  record: AnalysisHistoryApiRecord,
): CompareTechnology {
  const value = `${record.recommended_deployment} ${record.project_type}`.toLowerCase();

  if (value.includes("hybrid")) return "Hybrid";
  if (value.includes("wind")) return "Wind";
  return "Solar";
}

export function mapAnalysisHistoryToCompareSite(
  item: AnalysisHistoryApiRecord,
): CompareSite {
  const response = item.response_data ?? {};

  const deploymentPlan = asRecord(response['deployment_plan']);
  const technical = asRecord(response['technical_feasibility']);

  const technology = technologyFromRecord(item);

  const solarScore = clamp(numberValue(response['solar_score']));
  const windScore = clamp(numberValue(response['wind_score']));

  const terrainScore = clamp(numberValue(response['terrain_score']));
  const infrastructureScore = clamp(
    numberValue(response['infrastructure_score']),
  );
  const environmentalScore = clamp(
    numberValue(response['environmental_score']),
  );
  const economicScore = clamp(numberValue(response['economic_score']));

  const feasibilityScore = clamp(
    numberValue(
      technical['feasibility_score'],
      numberValue(response['overall_site_score']),
    ),
  );

  return {
    id: item.analysis_id,
    city:
      item.location_name?.split(",")[0]?.trim() ||
      `${item.latitude.toFixed(4)}°`,
    state:
      item.location_name?.split(",").slice(1).join(",").trim() || "India",
    shortLabel:
      item.location_name ||
      `${item.latitude.toFixed(4)}°, ${item.longitude.toFixed(4)}°`,
    latitude: item.latitude,
    longitude: item.longitude,
    coordinates:
      `${item.latitude.toFixed(4)}° N, ${item.longitude.toFixed(4)}° E`,
    suitability: clamp(item.overall_site_score),
    technology,
    capacityMw: numberValue(deploymentPlan['recommended_capacity_mw']),
    scores: {
      solar: solarScore,
      wind: windScore,
      terrain: terrainScore,
      infrastructure: infrastructureScore,
      environmental: environmentalScore,
      economic: economicScore,
      feasibility: feasibilityScore,
    },
  };
}


export function mapAnalysisResponseToCompareSite(
  response: AnalysisResponse,
  request: AnalysisRequest,
): CompareSite {
  const deploymentPlan = asRecord(response["deployment_plan"]);

  const technical = asRecord(response["technical_feasibility"]);

  const technologyValue = `${response["recommended_deployment"]} ${
    request.project_type ?? ""
  }`.toLowerCase();

  const technology: CompareTechnology = technologyValue.includes("hybrid")
    ? "Hybrid"
    : technologyValue.includes("wind")
      ? "Wind"
      : "Solar";

  const locationName =
    request.location_name?.trim() ||
    `${request.latitude.toFixed(4)}°, ${request.longitude.toFixed(4)}°`;

  const parts = locationName.split(",").map((part) => part.trim()).filter(Boolean);

  return {
    id: `live-${request.latitude.toFixed(6)}-${request.longitude.toFixed(6)}`,
    city: parts[0] || `${request.latitude.toFixed(4)}°`,
    state: parts.slice(1).join(", ") || "India",
    shortLabel: locationName,
    latitude: request.latitude,
    longitude: request.longitude,
    coordinates:
      `${request.latitude.toFixed(4)}° N, ${request.longitude.toFixed(4)}° E`,
    suitability: clamp(response.overall_site_score),
    technology,
    capacityMw: numberValue(
      deploymentPlan["recommended_capacity_mw"],
    ),
    scores: {
      solar: clamp(response.solar_score),
      wind: clamp(response.wind_score),
      terrain: clamp(response.terrain_score),
      infrastructure: clamp(response.infrastructure_score),
      environmental: clamp(response.environmental_score),
      economic: clamp(response.economic_score),
      feasibility: clamp(
        numberValue(
          technical["feasibility_score"],
          response.overall_site_score,
        ),
      ),
    },
  };
}
