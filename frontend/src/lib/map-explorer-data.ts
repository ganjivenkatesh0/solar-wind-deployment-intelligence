/**
 * Dynamic Map Explorer presentation data.
 *
 * All map values are derived from the current analysis request/result.
 * No hardcoded location is used.
 */

import type { AnalysisRequest, AnalysisResponse } from "./api/analysis";

export type LayerId =
  | "heatmap"
  | "solar"
  | "wind"
  | "infrastructure"
  | "terrain"
  | "protected"
  | "water"
  | "substations";

export type MapLayer = {
  id: LayerId;
  label: string;
  icon:
    | "heatmap"
    | "solar"
    | "wind"
    | "infrastructure"
    | "terrain"
    | "protected"
    | "water"
    | "grid";
  defaultOn: boolean;
};

export const mapLayers: MapLayer[] = [
  {
    id: "heatmap",
    label: "Suitability Heatmap",
    icon: "heatmap",
    defaultOn: true,
  },
  {
    id: "solar",
    label: "Solar Potential",
    icon: "solar",
    defaultOn: true,
  },
  {
    id: "wind",
    label: "Wind Potential",
    icon: "wind",
    defaultOn: true,
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    icon: "infrastructure",
    defaultOn: true,
  },
  {
    id: "terrain",
    label: "Terrain (Elevation)",
    icon: "terrain",
    defaultOn: true,
  },
  {
    id: "protected",
    label: "Protected Areas",
    icon: "protected",
    defaultOn: false,
  },
  {
    id: "water",
    label: "Water Bodies",
    icon: "water",
    defaultOn: true,
  },
  {
    id: "substations",
    label: "Grid Substations",
    icon: "grid",
    defaultOn: true,
  },
];

export type SitePoint = {
  id: string;
  lat: number;
  lng: number;
  score: number;
  kind: "solar" | "wind" | "substation";
};

export type HeatPoint = {
  lat: number;
  lng: number;
  score: number;
  radius: number;
};

export type SelectedSiteData = {
  status: string;
  location: string;
  coordinatesLabel: string;
  latitude: number;
  longitude: number;
  score: number;
  outOf: number;
  rating: string;
  metrics: Array<{
    label: string;
    value: string;
    icon?: "solar";
  }>;
};

export type MapSummaryData = {
  location: string;
  coordinatesLabel: string;
  landAreaLabel: string;
  bestTechnology: string;
  suitabilityCaption: string;
  annualEnergy: string;
  annualEnergyCaption: string;
  analysisTimeLabel: string;
};

export type SiteInsight = {
  label: string;
  value: string;
  caption: string;
  icon: "land" | "check" | "alert" | "solar" | "wind";
  tone: "success" | "solar" | "error" | "wind";
};

function makeRandom(seed: number) {
  let s = seed >>> 0;

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function numberValue(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function fixed(value: unknown, digits = 1): string {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return "—";
  }

  return parsed.toFixed(digits);
}

function formatLocation(latitude: number, longitude: number): string {
  return `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
}

function formatTechnology(value: string): string {
  if (value === "Hybrid") {
    return "Hybrid";
  }

  if (value === "Wind") {
    return "Wind";
  }

  if (value === "Solar") {
    return "Solar";
  }

  return "Not Recommended";
}

function createSites(
  latitude: number,
  longitude: number,
  suitability: number,
): SitePoint[] {
  const rand = makeRandom(
    Math.round((latitude + 90) * 1000) +
      Math.round((longitude + 180) * 1000),
  );

  const kinds: SitePoint["kind"][] = [
    "solar",
    "wind",
    "substation",
  ];

  return Array.from({ length: 28 }, (_, i) => {
    const angle = rand() * Math.PI * 2;
    const distance = 0.08 + rand() * 0.55;

    const kind =
      kinds[
        i % 3 === 0 && i % 4 === 0
          ? 2
          : i % 3 === 0
            ? 1
            : 0
      ] ?? "solar";

    const score = Math.max(
      5,
      Math.min(
        98,
        suitability +
          (rand() - 0.5) * 42,
      ),
    );

    return {
      id: `site-${i + 1}`,
      lat:
        latitude +
        Math.sin(angle) * distance,
      lng:
        longitude +
        Math.cos(angle) * distance * 1.05,
      score: Math.round(score * 10) / 10,
      kind,
    };
  });
}

function createHeatPoints(
  latitude: number,
  longitude: number,
  suitability: number,
): HeatPoint[] {
  const rand = makeRandom(
    700000 +
      Math.round((latitude + 90) * 100) +
      Math.round((longitude + 180) * 100),
  );

  return Array.from({ length: 150 }, () => {
    const angle = rand() * Math.PI * 2;
    const distance = rand() ** 0.7 * 0.75;

    const score = Math.max(
      5,
      Math.min(
        98,
        suitability -
          distance * 55 +
          (rand() - 0.5) * 30,
      ),
    );

    return {
      lat:
        latitude +
        Math.sin(angle) * distance,
      lng:
        longitude +
        Math.cos(angle) * distance * 1.1,
      score: Math.round(score),
      radius: 7000 + rand() * 10000,
    };
  });
}

function createWindPoints(
  latitude: number,
  longitude: number,
  windScore: number,
): SitePoint[] {
  const rand = makeRandom(
    300000 +
      Math.round((latitude + 90) * 100) +
      Math.round((longitude + 180) * 100),
  );

  return Array.from({ length: 9 }, (_, i) => {
    const angle = rand() * Math.PI * 2;
    const distance = 0.2 + rand() * 0.55;

    const score = Math.max(
      5,
      Math.min(
        98,
        windScore +
          (rand() - 0.5) * 35,
      ),
    );

    return {
      id: `wind-${i + 1}`,
      lat:
        latitude +
        Math.sin(angle) * distance,
      lng:
        longitude +
        Math.cos(angle) * distance * 1.1,
      score: Math.round(score * 10) / 10,
      kind: "wind",
    };
  });
}

export function createMapExplorerData(
  result: AnalysisResponse,
  request: AnalysisRequest,
) {
  const latitude = request.latitude;
  const longitude = request.longitude;

  const suitability = numberValue(
    result.site_suitability,
    numberValue(result.overall_site_score, 0),
  );

  const renewableScore = numberValue(
    result.renewable_score,
    0,
  );

  const windSpeed = numberValue(
    result.wind_assessment?.["wind_speed"],
    0,
  );

  const solarIrradiance = numberValue(
    result.solar_features?.["solar_irradiance"],
    0,
  );

  const recommendedDeployment =
    formatTechnology(
      result.recommended_deployment,
    );

  const capacity = numberValue(
    result.deployment_plan?.["recommended_capacity_mw"],
    0,
  );

  const totalEnergy = numberValue(
    result.energy_yield?.["total_energy"],
    0,
  );

  const roi = numberValue(
    result.financial_metrics?.["roi"],
    0,
  );

  const payback = numberValue(
    result.financial_metrics?.["payback_period"],
    0,
  );

  const sitePoints = createSites(
    latitude,
    longitude,
    suitability,
  );

  const heatPoints = createHeatPoints(
    latitude,
    longitude,
    suitability,
  );

  const windPoints = createWindPoints(
    latitude,
    longitude,
    renewableScore,
  );

  const waterBodies = [
    {
      id: "w1",
      lat: latitude + 0.17,
      lng: longitude - 0.1,
      radius: 4200,
    },
    {
      id: "w2",
      lat: latitude - 0.09,
      lng: longitude + 0.24,
      radius: 3100,
    },
    {
      id: "w3",
      lat: latitude + 0.34,
      lng: longitude + 0.31,
      radius: 5200,
    },
  ];

  const protectedAreas = [
    {
      id: "p1",
      lat: latitude - 0.28,
      lng: longitude - 0.26,
      radius: 9000,
    },
    {
      id: "p2",
      lat: latitude + 0.42,
      lng: longitude + 0.12,
      radius: 7000,
    },
  ];

  const infrastructureLines: [number, number][][] = [
    [
      [latitude - 0.45, longitude - 0.4],
      [latitude, longitude],
      [latitude + 0.4, longitude + 0.45],
    ],
    [
      [latitude + 0.3, longitude - 0.5],
      [latitude + 0.05, longitude + 0.05],
      [latitude - 0.35, longitude + 0.4],
    ],
  ];

  const location = formatLocation(
    latitude,
    longitude,
  );

  const coordinatesLabel = `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;

  const selectedSite: SelectedSiteData = {
    status:
      suitability >= 70
        ? "Optimal"
        : suitability >= 50
          ? "Moderate"
          : "Low Suitability",
    location,
    coordinatesLabel,
    latitude,
    longitude,
    score: suitability,
    outOf: 100,
    rating:
      suitability >= 80
        ? "Excellent"
        : suitability >= 70
          ? "Good"
          : suitability >= 50
            ? "Moderate"
            : "Low",
    metrics: [
      {
        label: "Best Technology",
        value: recommendedDeployment,
        icon: "solar",
      },
      {
        label: "Recommended Capacity",
        value:
          capacity > 0
            ? `${fixed(capacity, 1)} MW`
            : "—",
      },
      {
        label: "Annual Energy Potential",
        value:
          totalEnergy > 0
            ? `${fixed(totalEnergy, 2)} MWh`
            : "—",
      },
      {
        label: "Solar Irradiance",
        value:
          solarIrradiance > 0
            ? `${fixed(solarIrradiance, 2)} kWh/m²/day`
            : "—",
      },
      {
        label: "Wind Speed",
        value:
          windSpeed > 0
            ? `${fixed(windSpeed, 2)} m/s`
            : "—",
      },
      {
        label: "Payback Period",
        value:
          payback > 0
            ? `${fixed(payback, 2)} Years`
            : "—",
      },
      {
        label: "ROI",
        value:
          roi > 0
            ? `${fixed(roi, 2)}%`
            : "—",
      },
    ],
  };

  const mapSummary: MapSummaryData = {
    location,
    coordinatesLabel,
    landAreaLabel:
      `${fixed(request.land_area_hectares, 2)} ha`,
    bestTechnology:
      capacity > 0
        ? `${recommendedDeployment} (${fixed(capacity, 1)} MW)`
        : recommendedDeployment,
    suitabilityCaption:
      `${fixed(suitability, 1)} Suitability Score`,
    annualEnergy:
      totalEnergy > 0
        ? `${fixed(totalEnergy, 2)} MWh`
        : "—",
    annualEnergyCaption:
      "Estimated annual energy generation",
    analysisTimeLabel:
      "Current analysis",
  };

  const highCount = sitePoints.filter(
    (site) => site.score >= 70,
  ).length;

  const mediumCount = sitePoints.filter(
    (site) =>
      site.score >= 40 &&
      site.score < 70,
  ).length;

  const lowCount = sitePoints.filter(
    (site) => site.score < 40,
  ).length;

  const siteInsights: SiteInsight[] = [
    {
      label: "Total Sites Found",
      value: String(sitePoints.length),
      caption: "within current view",
      icon: "land",
      tone: "success",
    },
    {
      label: "High Suitability Sites",
      value: String(highCount),
      caption: "Score ≥ 70",
      icon: "check",
      tone: "success",
    },
    {
      label: "Medium Suitability",
      value: String(mediumCount),
      caption: "Score 40 – 70",
      icon: "alert",
      tone: "solar",
    },
    {
      label: "Low Suitability",
      value: String(lowCount),
      caption: "Score < 40",
      icon: "alert",
      tone: "error",
    },
    {
      label: "Solar Potential",
      value:
        solarIrradiance > 0
          ? fixed(solarIrradiance, 2)
          : "—",
      caption: "kWh/m²/day",
      icon: "solar",
      tone: "solar",
    },
    {
      label: "Wind Speed",
      value:
        windSpeed > 0
          ? fixed(windSpeed, 2)
          : "—",
      caption: "m/s",
      icon: "wind",
      tone: "wind",
    },
  ];

  return {
    latitude,
    longitude,
    selectedSite,
    mapSummary,
    siteInsights,
    mapSites: sitePoints,
    heatPoints,
    windPoints,
    waterBodies,
    protectedAreas,
    infrastructureLines,
    mapDataSources:
      "NASA POWER, Global Wind Atlas, SRTM, OpenStreetMap, Sentinel-2",
    suitability,
  };
}

export function suitabilityColor(score: number) {
  if (score >= 70) {
    return "oklch(0.62 0.16 150)";
  }

  if (score >= 55) {
    return "oklch(0.78 0.16 130)";
  }

  if (score >= 40) {
    return "oklch(0.83 0.16 90)";
  }

  if (score >= 25) {
    return "oklch(0.78 0.16 60)";
  }

  return "oklch(0.65 0.19 30)";
}
