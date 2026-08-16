/**
 * Dashboard presentation data layer.
 *
 * The real analysis API is not wired into this screen yet. Every value the
 * Dashboard renders is defined here so it can later be mapped 1:1 from the
 * existing analysis response without touching any JSX.
 */

import type { AnalysisResponse } from "@/lib/api/analysis";
import { buildResourcesData } from "@/lib/dashboard-section-data";
import { resourcesData, type ResourcesData } from "@/lib/resources-data";

export type MonthlyPoint = { month: string; value: number };

export type DashboardData = {
  site: {
    location: string;
    coordinatesLabel: string;
    latitude: number;
    longitude: number;
    landAreaLabel: string;
    budgetLabel: string;
    analysisTimeLabel: string;
  };
  suitability: {
    score: number;
    outOf: number;
    rating: string;
    note: string;
  };
  technology: {
    name: string;
    subtitle: string;
    capacityLabel: string;
    capacityCaption: string;
  };
  feasibility: {
    verdict: string;
    caption: string;
    score: number;
    outOf: number;
    breakdown: { label: string; score: number; icon: "terrain" | "infrastructure" | "land" | "grid" | "environmental" }[];
  };
  energy: {
    totalLabel: string;
    totalCaption: string;
    total: number;
    solar: number;
    wind: number;
    solarLabel: string;
    windLabel: string;
    solarShare: number;
    windShare: number;
    solarCapacityFactor: string;
    windCapacityFactor: string;
  };
  resources: {
    solar: { value: string; unit: string; rating: string; monthly: MonthlyPoint[] };
    wind: { value: string; unit: string; rating: string; monthly: MonthlyPoint[] };
    environment: { value: string; unit: string; label: string; icon: "temperature" | "humidity" | "sun" | "pressure" }[];
  };
  /** Detailed API-backed Resources tab data. */
  resourcesDetails: ResourcesData;
  financial: {
    metrics: { value: string; label: string; tone: "success" | "info" | "warning" | "solar" }[];
    cashFlow: { year: string; value: number }[];
  };
  ai: {
    metricLabel: string;
    metricValue: string;
    metricUnit: string;
    badge: string;
    description: string;
    factors: { label: string; weight: number }[];
  };
  recommendation: {
    title: string;
    summary: string;
    confidence: string;
    priority: string;
    expansion: string;
  };
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const solarMonthly = [4.02, 4.35, 4.68, 4.86, 4.72, 3.68, 3.34, 3.42, 3.86, 4.24, 4.12, 3.95];
const windMonthly = [3.12, 3.28, 3.34, 3.52, 4.02, 4.48, 4.36, 4.12, 3.62, 3.18, 3.05, 3.14];

const toMonthly = (values: number[]): MonthlyPoint[] =>
  MONTHS.map((month, i) => ({ month, value: values[i] ?? 0 }));


export type LatestAnalysisRequest = {
  latitude: number;
  longitude: number;
  land_area_hectares: number;
  available_budget: number;
  location_name?: string;
};

function formatMoney(value: number): string {
  return `$${value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
}

function formatCompactMoney(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }

  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }

  return formatMoney(value);
}

function getRating(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Very Good";
  if (score >= 60) return "Good";
  if (score >= 50) return "Moderate";
  return "Low";
}

function getSuitabilityNote(score: number): string {
  if (score >= 80) return "High potential for renewable deployment";
  if (score >= 60) return "Suitable for renewable deployment";
  if (score >= 50) return "Moderate potential for renewable deployment";
  return "Low potential for renewable deployment";
}

function formatTechnology(value: string): string {
  if (!value) return "Not Recommended";

  return value
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getAnalysisTime(value?: string): string {
  if (!value) return "Latest analysis";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Latest analysis";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function createDashboardData(
  result: AnalysisResponse,
  request: LatestAnalysisRequest,
): DashboardData {
  const energy = result.energy_yield as {
    solar_energy: number;
    wind_energy: number;
    total_energy: number;
    deployment_type?: string;
  };

  const financial = result.financial_metrics as {
    annual_revenue: number;
    estimated_project_cost: number;
    payback_period: number;
    roi: number;
  };

  const feasibility = result.technical_feasibility as {
    is_feasible: boolean;
    feasibility_score: number;
    decision: string;
    soft_constraints?: {
      score: number;
      constraints?: {
        grid_proximity?: {
          score: number;
        };
        road_accessibility?: {
          score: number;
        };
      };
    };
  };

  const deploymentPlan = result.deployment_plan as {
    recommendation?: {
      deployment_type?: string;
      confidence?: number;
      priority?: string;
      reason?: string;
      generated_at?: string;
    };
    recommended_capacity_mw?: number;
    expansion_status?: string;
    optimization?: {
      recommended_technology?: string;
      recommended_capacity_mw?: number;
    };
  };

  const mlPrediction = result.ml_prediction as {
    solar_pvout_potential?: number;
    explanation?: {
      top_features?: {
        feature: string;
        importance: number;
      }[];
    };
  };

  const solar = result.solar_features;
  const wind = result.wind_assessment;

  // Backend energy values are returned in kWh.
  // Dashboard presentation uses MWh.
  const totalEnergy = (Number(energy.total_energy) || 0) / 1000;
  const solarEnergy = (Number(energy.solar_energy) || 0) / 1000;
  const windEnergy = (Number(energy.wind_energy) || 0) / 1000;

  const solarShare =
    totalEnergy > 0 ? (solarEnergy / totalEnergy) * 100 : 0;

  const windShare =
    totalEnergy > 0 ? (windEnergy / totalEnergy) * 100 : 0;

  const recommendation =
    deploymentPlan.recommendation?.deployment_type ??
    result.recommended_deployment;

  const recommendedCapacity =
    deploymentPlan.optimization?.recommended_capacity_mw ??
    deploymentPlan.recommended_capacity_mw ??
    0;

  const topFactors =
    mlPrediction.explanation?.top_features?.map((item) => ({
      label: item.feature.replace(/_/g, " "),
      weight: item.importance * 100,
    })) ?? [];

  const generatedAt =
    deploymentPlan.recommendation?.generated_at;

  return {
    site: {
      location: request.location_name || "Selected Location",
      coordinatesLabel:
        `${request.latitude.toFixed(4)}° N, ${request.longitude.toFixed(4)}° E`,
      latitude: request.latitude,
      longitude: request.longitude,
      landAreaLabel:
        `${request.land_area_hectares.toLocaleString("en-US")} hectares`,
      budgetLabel: formatMoney(request.available_budget),
      analysisTimeLabel: getAnalysisTime(generatedAt),
    },

    suitability: {
      score: result.site_suitability,
      outOf: 100,
      rating: getRating(result.site_suitability),
      note: getSuitabilityNote(result.site_suitability),
    },

    technology: {
      name: formatTechnology(recommendation),
      subtitle: "Primary Recommendation",
      capacityLabel: `${Number(recommendedCapacity).toFixed(1)} MW`,
      capacityCaption: "Recommended Capacity",
    },

    feasibility: {
      verdict: feasibility.is_feasible ? "Feasible" : "Not Feasible",
      caption: feasibility.decision,
      score: feasibility.feasibility_score,
      outOf: 100,
      breakdown: [
        {
          label: "Terrain Suitability",
          score: result.terrain_score,
          icon: "terrain",
        },
        {
          label: "Infrastructure",
          score: result.infrastructure_score,
          icon: "infrastructure",
        },
        {
          label: "Land Suitability",
          score: result.environmental_score,
          icon: "land",
        },
        {
          label: "Grid Proximity",
          score:
            feasibility.soft_constraints?.constraints?.grid_proximity?.score ??
            result.infrastructure_score,
          icon: "grid",
        },
        {
          label: "Environmental",
          score: result.environmental_score,
          icon: "environmental",
        },
      ],
    },

    energy: {
      totalLabel: `${totalEnergy.toFixed(2)} MWh`,
      totalCaption: "Total Estimated",
      total: totalEnergy,
      solar: solarEnergy,
      wind: windEnergy,
      solarLabel: `${solarEnergy.toFixed(2)} MWh`,
      windLabel: `${windEnergy.toFixed(2)} MWh`,
      solarShare,
      windShare,
      solarCapacityFactor: "—",
      windCapacityFactor: `${Number(wind.capacity_factor).toFixed(1)}%`,
    },

    resources: {
      solar: {
        value: Number(solar.solar_irradiance).toFixed(2),
        unit: "kWh/m²/day",
        rating: getRating(Number(solar.solar_irradiance) * 20),
        monthly: toMonthly(solarMonthly),
      },
      wind: {
        value: Number(wind.wind_speed).toFixed(2),
        unit: "m/s",
        rating: wind.classification,
        monthly: toMonthly(windMonthly),
      },
      environment: [
        {
          value: Number(solar.temperature).toFixed(1),
          unit: "°C",
          label: "Temperature",
          icon: "temperature",
        },
        {
          value: Number(solar.relative_humidity).toFixed(2),
          unit: "%",
          label: "Humidity",
          icon: "humidity",
        },
        {
          value: Number(solar.solar_irradiance).toFixed(2),
          unit: "kWh/m²/day",
          label: "Solar Irradiance",
          icon: "sun",
        },
        {
          value: "—",
          unit: "",
          label: "Air Pressure",
          icon: "pressure",
        },
      ],
    },

    resourcesDetails: buildResourcesData(result),

    financial: {
      metrics: [
        {
          value: formatCompactMoney(financial.estimated_project_cost),
          label: "Total Investment",
          tone: "success",
        },
        {
          value: formatCompactMoney(financial.annual_revenue),
          label: "Annual Revenue",
          tone: "info",
        },
        {
          value: `${Number(financial.roi).toFixed(2)}%`,
          label: "ROI",
          tone: "warning",
        },
        {
          value: `${Number(financial.payback_period).toFixed(2)} Years`,
          label: "Payback Period",
          tone: "solar",
        },
      ],
      cashFlow: [
        {
          year: "Year 0",
          value: -Number(financial.estimated_project_cost),
        },
        {
          year: "Year 1",
          value: Number(financial.annual_revenue),
        },
        {
          year: "Year 2",
          value: Number(financial.annual_revenue) * 2,
        },
        {
          year: "Year 3",
          value: Number(financial.annual_revenue) * 3,
        },
        {
          year: "Year 4",
          value: Number(financial.annual_revenue) * 4,
        },
        {
          year: "Year 5",
          value: Number(financial.annual_revenue) * 5,
        },
      ],
    },

    ai: {
      metricLabel: "Solar PVOUT Potential",
      metricValue: Number(
        mlPrediction.solar_pvout_potential ?? 0,
      ).toFixed(2),
      metricUnit: "kWh/kWp/day",
      badge: "AI Prediction",
      description:
        "RandomForestRegressor model predicts solar potential based on multiple environmental and infrastructure factors.",
      factors: topFactors,
    },

    recommendation: {
      title: "Deployment Recommendation",
      summary:
        deploymentPlan.recommendation?.reason ??
        result.recommendation_reason,
      confidence:
        `${Number(
          deploymentPlan.recommendation?.confidence ??
          result.site_suitability,
        ).toFixed(1)}%`,
      priority:
        deploymentPlan.recommendation?.priority ?? "—",
      expansion:
        deploymentPlan.expansion_status ?? "—",
    },
  };
}

export const dashboardData: DashboardData = {
  site: {
    location: "Hyderabad, Telangana, India",
    coordinatesLabel: "17.3850° N, 78.4867° E",
    latitude: 17.385,
    longitude: 78.4867,
    landAreaLabel: "40.0 hectares",
    budgetLabel: "$5,000,000",
    analysisTimeLabel: "Aug 13, 2026 • 10:45 AM",
  },
  suitability: {
    score: 82.6,
    outOf: 100,
    rating: "Excellent",
    note: "High potential for renewable deployment",
  },
  technology: {
    name: "Solar",
    subtitle: "Primary Recommendation",
    capacityLabel: "8.0 MW",
    capacityCaption: "Recommended Capacity",
  },
  feasibility: {
    verdict: "Feasible",
    caption: "All systems operational",
    score: 95.5,
    outOf: 100,
    breakdown: [
      { label: "Terrain Suitability", score: 93, icon: "terrain" },
      { label: "Infrastructure", score: 95.5, icon: "infrastructure" },
      { label: "Land Suitability", score: 94, icon: "land" },
      { label: "Grid Proximity", score: 96, icon: "grid" },
      { label: "Environmental", score: 92, icon: "environmental" },
    ],
  },
  energy: {
    totalLabel: "204.98 MWh",
    totalCaption: "Total Estimated",
    total: 204.98,
    solar: 86.72,
    wind: 118.26,
    solarLabel: "86.72 MWh",
    windLabel: "118.26 MWh",
    solarShare: 42.3,
    windShare: 57.7,
    solarCapacityFactor: "18.5%",
    windCapacityFactor: "30.0%",
  },
  resources: {
    solar: {
      value: "4.15",
      unit: "kWh/m²/day",
      rating: "Excellent",
      monthly: toMonthly(solarMonthly),
    },
    wind: {
      value: "3.72",
      unit: "m/s",
      rating: "Moderate",
      monthly: toMonthly(windMonthly),
    },
    environment: [
      { value: "20.4", unit: "°C", label: "Temperature", icon: "temperature" },
      { value: "65.44", unit: "%", label: "Humidity", icon: "humidity" },
      { value: "6.8", unit: "h", label: "Sun Hours/Day", icon: "sun" },
      { value: "1021", unit: "hPa", label: "Air Pressure", icon: "pressure" },
    ],
  },
  resourcesDetails: resourcesData,

  financial: {
    metrics: [
      { value: "$550.00K", label: "Total Investment", tone: "success" },
      { value: "$1.54M", label: "Annual Revenue", tone: "info" },
      { value: "179.52%", label: "ROI", tone: "warning" },
      { value: "0.36 Years", label: "Payback Period", tone: "solar" },
    ],
    cashFlow: [
      { year: "Year 0", value: -550000 },
      { year: "Year 1", value: 260000 },
      { year: "Year 2", value: 690000 },
      { year: "Year 3", value: 1120000 },
      { year: "Year 4", value: 1560000 },
      { year: "Year 5", value: 1990000 },
    ],
  },
  ai: {
    metricLabel: "Solar PVOUT Potential",
    metricValue: "3.25",
    metricUnit: "kWh/kWp/day",
    badge: "High Potential",
    description:
      "RandomForestRegressor model predicts solar potential based on multiple environmental and infrastructure factors.",
    factors: [
      { label: "Hydro Surface Water", weight: 39.3 },
      { label: "Governance Score", weight: 22.1 },
      { label: "Offshore Wind Potential", weight: 20.0 },
      { label: "Land Suitability", weight: 10.2 },
      { label: "Population Density", weight: 8.4 },
    ],
  },
  recommendation: {
    title: "Deployment Recommendation",
    summary: "Solar deployment is recommended for this location with 8.0 MW capacity.",
    confidence: "High (82.6%)",
    priority: "Medium",
    expansion: "Expandable",
  },
};
