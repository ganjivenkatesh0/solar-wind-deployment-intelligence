import type { AnalysisResponse } from "@/lib/api/analysis";
import type { ResourcesData } from "@/lib/resources-data";
import type { FeasibilityData } from "@/lib/feasibility-data";
import type { EnergyFinancialData } from "@/lib/energy-financial-data";
import type { AiInsightsData } from "@/lib/ai-insights-data";
import type { RecommendationData } from "@/lib/recommendation-data";

type AnalysisRequest = {
  latitude: number;
  longitude: number;
  land_area_hectares: number;
  available_budget: number;
  location_name?: string;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function num(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function fixed(value: unknown, digits = 2): string {
  return num(value).toFixed(digits);
}

function rating(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Moderate";
  return "Poor";
}

function toneForScore(
  score: number,
): "success" | "info" | "hybrid" {
  if (score >= 70) return "success";
  if (score >= 40) return "info";
  return "hybrid";
}

function chartFromSingleValue(value: number) {
  return MONTHS.map((month) => ({
    month,
    value,
  }));
}

function getDeploymentPlan(result: AnalysisResponse): NonNullable<AnalysisResponse["deployment_plan"]> {
  return result.deployment_plan ?? {};
}

function getEnergy(result: AnalysisResponse): NonNullable<AnalysisResponse["energy_yield"]> {
  return result.energy_yield ?? {};
}

function getFinancial(result: AnalysisResponse): NonNullable<AnalysisResponse["financial_metrics"]> {
  return result.financial_metrics ?? {};
}

function getFeasibility(
  result: AnalysisResponse,
): NonNullable<AnalysisResponse["technical_feasibility"]> {
  return result.technical_feasibility;
}

function getRecommendation(
  result: AnalysisResponse,
): NonNullable<NonNullable<AnalysisResponse["deployment_plan"]>["recommendation"]> {
  return getDeploymentPlan(result).recommendation ?? {};
}

function getOptimization(
  result: AnalysisResponse,
): NonNullable<NonNullable<AnalysisResponse["deployment_plan"]>["optimization"]> {
  return getDeploymentPlan(result).optimization ?? {};
}

/**
 * Converts the real analysis response into the existing Resources UI contract.
 *
 * Important:
 * The API currently does not provide 12 independent monthly resource values,
 * so we do not reuse the old demo chart. The chart repeats the current
 * location-specific measured value until the backend provides a monthly series.
 */
export function buildResourcesData(
  result: AnalysisResponse,
): ResourcesData {
  const solar = result.solar_features ?? {};
  const wind = result.wind_assessment ?? {};
  const feasibility = getFeasibility(result);

  const solarIrradiance = num(solar.solar_irradiance);
  const windSpeed = num(wind.wind_speed);
  const temperature = num(solar.temperature);
  const humidity = num(solar.relative_humidity);
  const windCapacityFactor = num(wind.capacity_factor);

  const slope =
    num(
      feasibility.hard_constraints?.constraints?.terrain?.slope,
      NaN,
    );

  const gridDistance = num(
    feasibility.soft_constraints?.constraints?.grid_proximity?.value,
    NaN,
  );

  const roadDistance = num(
    feasibility.soft_constraints?.constraints?.road_accessibility?.value,
    NaN,
  );

  return {
    dataSources: [
      { name: "NASA POWER", tone: "wind" },
      { name: "Global Wind Atlas", tone: "success" },
      { name: "SRTM", tone: "solar" },
      { name: "OpenStreetMap", tone: "hybrid" },
      { name: "Sentinel-2", tone: "info" },
    ],

    solar: {
      metrics: [
        {
          value: fixed(solarIrradiance),
          unit: "kWh/m²/day",
          label: "Global Horizontal Irradiance",
          tone: "success",
        },
        {
          value: "—",
          unit: "kWh/m²/day",
          label: "Direct Normal Irradiance",
          tone: "solar",
        },
        {
          value: "—",
          unit: "kWh/m²/year",
          label: "Annual Radiation",
          tone: "wind",
        },
        {
          value: "—",
          label: "Data Quality Score",
          tone: "hybrid",
        },
      ],
      chartTitle: "Solar Irradiance (kWh/m²/day)",
      chart: chartFromSingleValue(solarIrradiance),
      environment: [
        {
          value: fixed(temperature, 1),
          unit: "°C",
          label: "Temperature",
          tone: "solar",
          icon: "temperature",
        },
        {
          value: fixed(humidity),
          unit: "%",
          label: "Humidity",
          tone: "wind",
          icon: "humidity",
        },
        {
          value: fixed(windSpeed),
          unit: "m/s",
          label: "Wind Speed",
          tone: "info",
          icon: "windSpeed",
        },
        {
          value: "—",
          unit: "hPa",
          label: "Air Pressure",
          tone: "hybrid",
          icon: "pressure",
        },
      ],
    },

    wind: {
      metrics: [
        {
          value: fixed(windSpeed),
          unit: "m/s",
          label: "Mean Wind Speed",
          tone: "success",
        },
        {
          value: "—",
          unit: "m/s",
          label: "Max Wind Speed",
          tone: "solar",
        },
        {
          value: "—",
          unit: "h/year",
          label: "Wind Hours",
          tone: "wind",
        },
        {
          value: "—",
          label: "Data Quality Score",
          tone: "hybrid",
        },
      ],
      chartTitle: "Wind Speed (m/s)",
      chart: chartFromSingleValue(windSpeed),
      environment: [
        {
          value: "—",
          label: "Turbulence Intensity",
          tone: "info",
          icon: "turbulence",
        },
        {
          value: fixed(windCapacityFactor, 1),
          unit: "%",
          label: "Capacity Factor (Estimated)",
          tone: "success",
          icon: "capacity",
        },
        {
          value: "50",
          unit: "m",
          label: "Hub Height",
          tone: "solar",
          icon: "hubHeight",
        },
        {
          value: wind.classification ?? "—",
          label: "Wind Resource Quality",
          tone: "hybrid",
          icon: "quality",
        },
      ],
    },

    terrain: [
      {
        value: "—",
        unit: "m",
        label: "Elevation",
        tone: "wind",
        icon: "elevation",
      },
      {
        value: Number.isFinite(slope) ? fixed(slope, 2) : "—",
        unit: Number.isFinite(slope) ? "°" : "",
        label: "Slope",
        tone: "success",
        icon: "slope",
      },
      {
        value: "—",
        unit: "%",
        label: "Land Usability",
        tone: "success",
        icon: "landUsability",
      },
      {
        value: feasibility.is_feasible ? "Available" : "Restricted",
        label: "Land Status",
        tone: feasibility.is_feasible ? "success" : "hybrid",
        icon: "landStatus",
      },
    ],

    infrastructure: [
      {
        value: Number.isFinite(roadDistance) ? fixed(roadDistance) : "—",
        unit: Number.isFinite(roadDistance) ? "km" : "",
        label: "Road Access",
        tone: "hybrid",
        icon: "road",
      },
      {
        value: Number.isFinite(gridDistance) ? fixed(gridDistance) : "—",
        unit: Number.isFinite(gridDistance) ? "km" : "",
        label: "Grid Connection",
        tone: "solar",
        icon: "grid",
      },
      {
        value: "—",
        unit: "km",
        label: "Substation",
        tone: "solar",
        icon: "substation",
      },
      {
        value: "—",
        unit: "km",
        label: "Water Source",
        tone: "wind",
        icon: "water",
      },
    ],
  };
}

/**
 * Converts the real technical feasibility result into the existing
 * Feasibility UI contract.
 */
export function buildFeasibilityData(
  result: AnalysisResponse,
): FeasibilityData {
  const feasibility = getFeasibility(result);
  const score = num(feasibility.feasibility_score);
  const renewableScore = num(result.renewable_score);
  const terrainScore = num(result.terrain_score);
  const infrastructureScore = num(result.infrastructure_score);
  const environmentalScore = num(result.environmental_score);

  const gridScore = num(
    feasibility.soft_constraints?.constraints?.grid_proximity?.score,
    infrastructureScore,
  );

  const landPassed =
    feasibility.hard_constraints?.constraints?.land_use?.passed ?? true;

  const terrainPassed =
    feasibility.hard_constraints?.constraints?.terrain?.passed ?? true;

  return {
    header: {
      title: "Feasibility Analysis",
      subtitle:
        "Comprehensive technical feasibility assessment for the selected site",
    },

    overall: {
      label: "Overall Feasibility Score",
      score,
      outOf: 100,
      badge: rating(score),
      note: feasibility.decision ?? "Based on available site data",
    },

    kpis: [
      {
        label: "Technical Feasibility",
        value: fixed(score),
        outOf: "/100",
        badge: rating(score),
        tone: "wind",
        icon: "feasibility",
      },
      {
        label: "Site Readiness",
        value: fixed(renewableScore),
        outOf: "/100",
        badge: rating(renewableScore),
        tone: "success",
        icon: "readiness",
      },
      {
        label: "Risk Assessment",
        value: fixed(100 - score),
        outOf: "/100",
        badge: rating(score >= 70 ? 80 : 50),
        tone: "warning",
        icon: "risk",
      },
      {
        label: "Implementation Complexity",
        value: fixed(100 - infrastructureScore),
        outOf: "/100",
        badge: rating(infrastructureScore),
        tone: "hybrid",
        icon: "complexity",
      },
    ],

    breakdown: [
      {
        label: "Terrain Suitability",
        score: terrainScore,
        icon: "terrain",
      },
      {
        label: "Infrastructure Access",
        score: infrastructureScore,
        icon: "infrastructure",
      },
      {
        label: "Land Suitability",
        score: environmentalScore,
        icon: "land",
      },
      {
        label: "Grid Proximity",
        score: gridScore,
        icon: "grid",
      },
      {
        label: "Environmental Impact",
        score: environmentalScore,
        icon: "environmental",
      },
      {
        label: "Regulatory Compliance",
        score: landPassed ? 100 : 0,
        icon: "regulatory",
      },
    ],

    breakdownNote:
      feasibility.constraint_summary ??
      "Feasibility is calculated from the available technical constraints.",

    radar: [
      { dimension: "Terrain", score: terrainScore },
      { dimension: "Infrastructure", score: infrastructureScore },
      { dimension: "Land Suitability", score: environmentalScore },
      { dimension: "Grid Proximity", score: gridScore },
      { dimension: "Environmental", score: environmentalScore },
      { dimension: "Regulatory", score: landPassed ? 100 : 0 },
    ],

    radarCenter: fixed(score),

    constraints: [
      {
        label: "Land Use",
        description:
          feasibility.hard_constraints?.constraints?.land_use?.reason ??
          "Land-use assessment completed.",
        status: landPassed ? "Good" : "Restricted",
        statusTone: landPassed ? "success" : "info",
        distance: "—",
        distanceCaption: "Available Data",
        icon: "protected",
      },
      {
        label: "Terrain",
        description:
          feasibility.hard_constraints?.constraints?.terrain?.reason ??
          "Terrain assessment completed.",
        status: terrainPassed ? "Good" : "Restricted",
        statusTone: terrainPassed ? "success" : "info",
        distance: "—",
        distanceCaption: "Available Data",
        icon: "slope",
      },
      {
        label: "Road Connectivity",
        description: "Nearest road distance from available infrastructure data.",
        status: Number.isFinite(
          num(
            feasibility.soft_constraints?.constraints?.road_accessibility?.value,
            NaN,
          ),
        )
          ? "Available"
          : "Unavailable",
        statusTone: "success",
        distance: Number.isFinite(
          num(
            feasibility.soft_constraints?.constraints?.road_accessibility?.value,
            NaN,
          ),
        )
          ? `${fixed(
              feasibility.soft_constraints?.constraints?.road_accessibility
                ?.value,
            )} km`
          : "—",
        distanceCaption: "Nearest Road",
        icon: "road",
      },
      {
        label: "Grid Connection",
        description: "Grid proximity from available infrastructure data.",
        status: Number.isFinite(
          num(
            feasibility.soft_constraints?.constraints?.grid_proximity?.value,
            NaN,
          ),
        )
          ? "Available"
          : "Unavailable",
        statusTone: "success",
        distance: Number.isFinite(
          num(
            feasibility.soft_constraints?.constraints?.grid_proximity?.value,
            NaN,
          ),
        )
          ? `${fixed(
              feasibility.soft_constraints?.constraints?.grid_proximity?.value,
            )} km`
          : "—",
        distanceCaption: "Nearest Grid",
        icon: "grid",
      },
      {
        label: "Average Slope",
        description: "Terrain slope from the technical feasibility assessment.",
        status: terrainPassed ? "Good" : "Restricted",
        statusTone: terrainPassed ? "success" : "info",
        distance: "—",
        distanceCaption: "Slope",
        icon: "slope",
      },
    ],

    risk: {
      overall: fixed(100 - score),
      overallLabel: score >= 75 ? "Low Risk" : score >= 50 ? "Medium Risk" : "High Risk",
      slices: [
        {
          label: "Low Risk (0-25)",
          value: score >= 75 ? 70 : 30,
          color: "var(--success)",
        },
        {
          label: "Medium Risk (25-50)",
          value: score >= 50 && score < 75 ? 50 : 20,
          color: "var(--warning)",
        },
        {
          label: "High Risk (50-75)",
          value: score < 50 ? 50 : 10,
          color: "var(--solar)",
        },
        {
          label: "Very High Risk (75-100)",
          value: score < 25 ? 30 : 0,
          color: "var(--error)",
        },
      ],
      factors: [
        {
          label: "Terrain",
          level: terrainScore >= 75 ? "Low" : terrainScore >= 50 ? "Medium" : "High",
        },
        {
          label: "Infrastructure",
          level:
            infrastructureScore >= 75
              ? "Low"
              : infrastructureScore >= 50
                ? "Medium"
                : "High",
        },
        {
          label: "Environmental",
          level:
            environmentalScore >= 75
              ? "Low"
              : environmentalScore >= 50
                ? "Medium"
                : "High",
        },
      ],
    },

    summary: {
      title: feasibility.is_feasible
        ? "Technically Feasible Site"
        : "Technical Feasibility Concern",
      description:
        feasibility.constraint_summary ??
        "Assessment based on available site constraints.",
      metrics: [
        {
          label: "Feasibility",
          value: fixed(score),
          tone: "success",
        },
        {
          label: "Infrastructure",
          value: fixed(infrastructureScore),
          tone: "info",
        },
        {
          label: "Terrain",
          value: fixed(terrainScore),
          tone: "hybrid",
        },
      ],
    },

    recommendations: [
      feasibility.is_feasible
        ? "Technical constraints currently pass."
        : "Review failed technical constraints before deployment.",
      "Use the location-specific resource and infrastructure values for project planning.",
    ],
  };
}

/**
 * Converts energy and financial API values into the existing detailed
 * Energy & Financial tab.
 */
export function buildEnergyFinancialData(
  result: AnalysisResponse,
): EnergyFinancialData {
  const energy = getEnergy(result);
  const financial = getFinancial(result);
  const deploymentPlan = getDeploymentPlan(result);
  const optimization = getOptimization(result);

  const solarEnergy = num(energy.solar_energy);
  const windEnergy = num(energy.wind_energy);
  const totalEnergy = num(
    energy.total_energy,
    solarEnergy + windEnergy,
  );

  const solarShare =
    totalEnergy > 0 ? (solarEnergy / totalEnergy) * 100 : 0;
  const windShare =
    totalEnergy > 0 ? (windEnergy / totalEnergy) * 100 : 0;

  const capacity = num(
    optimization.recommended_capacity_mw ??
      deploymentPlan.recommended_capacity_mw,
  );

  const annualRevenue = num(financial.annual_revenue);
  const projectCost = num(financial.estimated_project_cost);
  const roi = num(financial.roi);
  const payback = num(financial.payback_period);

  return {
    header: {
      title: "Energy & Financial Analysis",
      subtitle:
        "Comprehensive energy production and financial feasibility analysis",
    },

    kpis: [
      {
        id: "energy",
        label: "Annual Energy Generation",
        value: fixed(totalEnergy),
        unit: "MWh",
        caption: "Total Estimated",
        tone: "solar",
      },
      {
        id: "capacity",
        label: "Capacity (Recommended)",
        value: fixed(capacity, 1),
        unit: "MW",
        caption: "Recommended Capacity",
        tone: "success",
      },
      {
        id: "capacityFactor",
        label: "Capacity Factor",
        value: fixed(num(result.wind_assessment?.capacity_factor), 1),
        unit: "%",
        caption: "Wind Capacity Factor",
        tone: "hybrid",
      },
      {
        id: "lcoe",
        label: "Levelized Cost of Energy (LCOE)",
        value: "—",
        unit: "/kWh",
        caption: "Not provided by analysis API",
        tone: "wind",
      },
      {
        id: "payback",
        label: "Payback Period",
        value: fixed(payback),
        unit: "Years",
        caption: "Based on current financial model",
        tone: "warning",
      },
    ],

    generation: {
      solar: {
        value: `${fixed(solarEnergy)} MWh`,
        caption: `Solar (${solarShare.toFixed(1)}%)`,
      },
      wind: {
        value: `${fixed(windEnergy)} MWh`,
        caption: `Wind (${windShare.toFixed(1)}%)`,
      },
      total: {
        value: `${fixed(totalEnergy)} MWh`,
        caption: "Total Annual Energy",
      },
      monthly: MONTHS.map((month) => ({
        month,
        solar: solarEnergy / 12,
        wind: windEnergy / 12,
      })),
    },

    capacity: {
      solar: "—",
      wind: "—",
    },

    capacityFactorTrend: MONTHS.map((_, index) => ({
      x: index,
      value: num(result.wind_assessment?.capacity_factor),
    })),

    cashFlow: {
      points: [
        {
          year: 0,
          annual: -projectCost,
          cumulative: -projectCost,
        },
        ...Array.from({ length: 20 }, (_, index) => {
          const year = index + 1;
          return {
            year,
            annual: annualRevenue,
            cumulative: -projectCost + annualRevenue * year,
          };
        }),
      ],
      summary: [
        {
          label: "Initial Investment",
          value: `$${projectCost.toLocaleString("en-US")}`,
          tone: "success",
        },
        {
          label: "Annual Revenue",
          value: `$${annualRevenue.toLocaleString("en-US")}`,
          tone: "success",
        },
        {
          label: "ROI",
          value: `${roi.toFixed(2)}%`,
          tone: "solar",
        },
        {
          label: "Payback",
          value: `${payback.toFixed(2)} Years`,
          tone: "success",
        },
      ],
    },

    yields: [
      {
        label: "Solar Energy",
        value: `${fixed(solarEnergy)} MWh`,
        badge: rating(solarShare),
        tone: "success",
        icon: "solar",
      },
      {
        label: "Wind Energy",
        value: `${fixed(windEnergy)} MWh`,
        badge: rating(windShare),
        tone: "success",
        icon: "wind",
      },
      {
        label: "Solar Capacity Factor",
        value: "—",
        badge: "Not Available",
        tone: "info",
        icon: "solar",
      },
      {
        label: "Wind Capacity Factor",
        value: `${fixed(
          result.wind_assessment?.capacity_factor,
          1,
        )}%`,
        badge: "Available",
        tone: "success",
        icon: "wind",
      },
      {
        label: "System Availability",
        value: "—",
        badge: "Not Available",
        tone: "info",
        icon: "availability",
      },
      {
        label: "Degradation Rate",
        value: "—",
        badge: "Not Available",
        tone: "info",
        icon: "degradation",
      },
    ],

    cost: {
      total: `$${projectCost.toLocaleString("en-US")}`,
      slices: [
        {
          label: "Estimated Project Cost",
          amount: `$${projectCost.toLocaleString("en-US")}`,
          share: 100,
          color: "var(--solar)",
        },
      ],
    },

    financialMetrics: [
      {
        label: "Return on Investment (ROI)",
        value: `${roi.toFixed(2)}%`,
        badge: rating(roi),
        tone: "success",
        icon: "roi",
      },
      {
        label: "Payback Period",
        value: `${payback.toFixed(2)} Years`,
        badge: "Calculated",
        tone: "success",
        icon: "breakeven",
      },
    ],

    scenarios: [],

    viability: {
      note:
        "Financial viability is based on the current analysis response.",
      label: "ROI",
      value: `${roi.toFixed(2)}%`,
    },
  };
}

/**
 * Converts the available ML response into the existing AI Insights UI.
 *
 * We intentionally leave unsupported model metadata unavailable rather
 * than showing the old static demo values.
 */
export function buildAiInsightsData(
  result: AnalysisResponse,
): AiInsightsData {
  const prediction = result.ml_prediction ?? {};
  const features = prediction.explanation?.top_features ?? [];
  const recommendation = getRecommendation(result);

  const confidence = num(
    recommendation.confidence,
    result.site_suitability,
  );

  return {
    header: {
      title: "AI Insights",
      subtitle:
        "Advanced AI/ML analysis and intelligent predictions for the selected site",
    },

    performance: {
      overall: {
        value: confidence,
        label: "Analysis Confidence",
        badge: rating(confidence),
      },
      accuracies: [
        {
          id: "solar",
          label: "Solar Potential",
          caption: "Prediction",
          value: `${fixed(prediction.solar_pvout_potential)} kWh/kWp/day`,
          badge: "Available",
        },
        {
          id: "wind",
          label: "Wind Potential",
          caption: "Prediction",
          value: `${fixed(result.wind_assessment?.wind_speed)} m/s`,
          badge: "Available",
        },
        {
          id: "energy",
          label: "Energy Output",
          caption: "Estimated",
          value: `${fixed(
            getEnergy(result).total_energy,
          )} MWh`,
          badge: "Available",
        },
        {
          id: "financial",
          label: "Financial Viability",
          caption: "ROI",
          value: `${fixed(getFinancial(result).roi)}%`,
          badge: "Available",
        },
      ],
    },

    confidence: {
      headline: rating(confidence) + " Confidence",
      value: `${confidence.toFixed(1)}%`,
      caption: "Confidence reported by the analysis",
      rows: [
        {
          label: "Current Analysis",
          share: confidence,
          color: "var(--success)",
        },
        {
          label: "Remaining Uncertainty",
          share: Math.max(0, 100 - confidence),
          color: "var(--solar)",
        },
      ],
    },

    dataIntelligence: {
      score: fixed(result.site_suitability),
      max: "/100",
      badge: rating(result.site_suitability),
      caption: "Overall analysis suitability score",
    },

    predictions: {
      primary: {
        title:
          recommendation.priority ??
          "AI Deployment Assessment",
        caption: "AI Recommendation",
        rows: [
          {
            label: "Solar PVOUT Potential",
            value: `${fixed(
              prediction.solar_pvout_potential,
            )} kWh/kWp/day`,
          },
          {
            label: "Recommended Capacity",
            value: `${fixed(
              getOptimization(result).recommended_capacity_mw ??
                getDeploymentPlan(result).recommended_capacity_mw,
              1,
            )} MW`,
          },
          {
            label: "Expected Energy",
            value: `${fixed(
              getEnergy(result).total_energy,
            )} MWh`,
          },
          {
            label: "ROI",
            value: `${fixed(
              getFinancial(result).roi,
            )}%`,
          },
        ],
      },

      probabilities: [
        {
          label: "Solar Project",
          value:
            result.recommended_deployment === "Solar"
              ? 100
              : result.recommended_deployment === "Hybrid"
                ? 50
                : 0,
          color: "var(--success)",
        },
        {
          label: "Wind Project",
          value:
            result.recommended_deployment === "Wind"
              ? 100
              : result.recommended_deployment === "Hybrid"
                ? 50
                : 0,
          color: "var(--wind)",
        },
        {
          label: "Hybrid Project",
          value:
            result.recommended_deployment === "Hybrid" ? 100 : 0,
          color: "var(--hybrid)",
        },
      ],

      uncertainty: {
        caption:
          "Detailed uncertainty metrics are not provided by the current API.",
        rows: [
          {
            id: "solar",
            label: "Solar",
            value: "—",
          },
          {
            id: "wind",
            label: "Wind",
            value: "—",
          },
          {
            id: "financial",
            label: "Financial",
            value: "—",
          },
        ],
      },
    },

    featureImportance: {
      items: features.map((feature) => ({
        label: feature.feature.replace(/_/g, " "),
        value: num(feature.importance),
      })),
      note:
        features.length > 0
          ? "Feature importance supplied by the analysis model."
          : "Feature importance is not available for this analysis.",
    },

    ensemble: {
      rows: [],
      accuracy: "—",
      weight: "—",
    },

    similarProjects: [],

    anomalies: [],

    summary: [
      recommendation.reason ??
        result.recommendation_reason ??
        "AI analysis completed.",
      `Overall site suitability: ${fixed(result.site_suitability)}/100.`,
    ],

    modelStatus: {
      message: "Analysis model completed successfully.",
      lastUpdate: new Date().toLocaleString(),
      badge: "Active",
    },
  };
}

/**
 * Converts the deployment recommendation into the existing Recommendation UI.
 */
export function buildRecommendationData(
  result: AnalysisResponse,
): RecommendationData {
  const plan = getDeploymentPlan(result);
  const recommendation = getRecommendation(result);
  const optimization = getOptimization(result);
  const energy = getEnergy(result);
  const financial = getFinancial(result);

  const capacity = num(
    optimization.recommended_capacity_mw ??
      plan.recommended_capacity_mw,
  );

  const totalEnergy = num(energy.total_energy);
  const roi = num(financial.roi);
  const payback = num(financial.payback_period);
  const confidence = num(
    recommendation.confidence,
    result.site_suitability,
  );

  const technology =
    result.recommended_deployment ??
    recommendation.priority ??
    "Not Recommended";

  return {
    header: {
      title: "Deployment Recommendations",
      subtitle:
        "AI-powered recommendations for optimal renewable energy deployment",
    },

    primary: {
      name:
        technology === "Solar"
          ? "Solar Power Plant"
          : technology === "Wind"
            ? "Wind Power Plant"
            : technology === "Hybrid"
              ? "Hybrid (Solar + Wind)"
              : "No Deployment Recommendation",
      badge:
        recommendation.priority ??
        (result.site_suitability >= 70
          ? "Recommended"
          : "Not Recommended"),
      description:
        recommendation.reason ??
        result.recommendation_reason ??
        "Recommendation generated from the completed site analysis.",
      metrics: [
        {
          label: "Recommended Capacity",
          value: `${capacity.toFixed(1)} MW`,
        },
        {
          label: "Annual Energy Generation",
          value: `${totalEnergy.toFixed(2)} MWh`,
        },
        {
          label: "Estimated Investment",
          value: `$${num(
            financial.estimated_project_cost,
          ).toLocaleString("en-US")}`,
        },
        {
          label: "ROI",
          value: `${roi.toFixed(2)}%`,
        },
        {
          label: "Payback Period",
          value: `${payback.toFixed(2)} Years`,
        },
        {
          label: "Confidence Level",
          value: `${confidence.toFixed(1)}%`,
        },
      ],
      stats: [
        {
          id: "capacity",
          label: "Capacity Factor",
          value: `${num(
            result.wind_assessment?.capacity_factor,
          ).toFixed(1)}%`,
        },
        {
          id: "performance",
          label: "Site Suitability",
          value: `${num(result.site_suitability).toFixed(1)}`,
        },
        {
          id: "lcoe",
          label: "LCOE",
          value: "—",
          unit: "/kWh",
        },
        {
          id: "availability",
          label: "System Availability",
          value: "—",
        },
      ],
    },

    alternatives: [],

    advantages: [
      `Overall suitability score: ${num(
        result.site_suitability,
      ).toFixed(2)}/100.`,
      `Technical feasibility: ${
        result.technical_feasibility?.decision ?? "Unavailable"
      }.`,
      `Solar resource: ${fixed(
        result.solar_features?.solar_irradiance,
      )} kWh/m²/day.`,
      `Wind resource: ${fixed(
        result.wind_assessment?.wind_speed,
      )} m/s.`,
    ],

    roadmap: [
      {
        id: "engineering",
        period: "Next",
        label: "Detailed Engineering & Approvals",
      },
      {
        id: "procurement",
        period: "After Approval",
        label: "Procurement & Site Preparation",
      },
      {
        id: "construction",
        period: "Implementation",
        label: "Construction & Installation",
      },
      {
        id: "commissioning",
        period: "Final",
        label: "Testing & Commissioning",
      },
    ],

    risks: [],

    overall: {
      title: "Overall Recommendation",
      summary:
        recommendation.reason ??
        result.recommendation_reason ??
        "Recommendation generated from the completed analysis.",
      indicators: [
        {
          id: "success",
          label: "Confidence",
          value: `${confidence.toFixed(1)}%`,
        },
        {
          id: "priority",
          label: "Priority Level",
          value: recommendation.priority ?? "—",
        },
        {
          id: "readiness",
          label: "Expansion Status",
          value: plan.expansion_status ?? "—",
        },
      ],
      cta:
        result.site_suitability >= 70
          ? "Proceed to Project Parameters"
          : "Review Site Analysis",
    },
  };
}

export function buildDashboardSectionData(
  result: AnalysisResponse,
  request: AnalysisRequest,
) {
  void request;

  return {
    resources: buildResourcesData(result),
    feasibilityDetails: buildFeasibilityData(result),
    energyFinancialDetails: buildEnergyFinancialData(result),
    aiInsightsDetails: buildAiInsightsData(result),
    recommendationDetails: buildRecommendationData(result),
  };
}
