/**
 * Map Explorer presentation data layer.
 *
 * Everything is derived from the existing analysis result (`dashboardData`) so
 * the map always reflects the currently selected analysis. Layer point clouds
 * are generated deterministically around the analysed site — when real layer
 * data becomes available it can replace these builders without touching JSX.
 */
import { dashboardData } from "./dashboard-data";

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
  icon: "heatmap" | "solar" | "wind" | "infrastructure" | "terrain" | "protected" | "water" | "grid";
  defaultOn: boolean;
};

export const mapLayers: MapLayer[] = [
  { id: "heatmap", label: "Suitability Heatmap", icon: "heatmap", defaultOn: true },
  { id: "solar", label: "Solar Potential", icon: "solar", defaultOn: true },
  { id: "wind", label: "Wind Potential", icon: "wind", defaultOn: true },
  { id: "infrastructure", label: "Infrastructure", icon: "infrastructure", defaultOn: true },
  { id: "terrain", label: "Terrain (Elevation)", icon: "terrain", defaultOn: true },
  { id: "protected", label: "Protected Areas", icon: "protected", defaultOn: false },
  { id: "water", label: "Water Bodies", icon: "water", defaultOn: true },
  { id: "substations", label: "Grid Substations", icon: "grid", defaultOn: true },
];

export type SitePoint = {
  id: string;
  lat: number;
  lng: number;
  score: number;
  kind: "solar" | "wind" | "substation";
};

export type HeatPoint = { lat: number; lng: number; score: number; radius: number };

/** Small deterministic PRNG so markers never shift between renders/SSR. */
function makeRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

const { latitude, longitude } = dashboardData.site;

function buildSites(): SitePoint[] {
  const rand = makeRandom(20260813);
  const kinds: SitePoint["kind"][] = ["solar", "wind", "substation"];
  return Array.from({ length: 28 }, (_, i) => {
    const angle = rand() * Math.PI * 2;
    const dist = 0.12 + rand() * 0.62;
    const kind = kinds[i % 3 === 0 && i % 4 === 0 ? 2 : i % 3 === 0 ? 1 : 0] ?? "solar";
    return {
      id: `site-${i + 1}`,
      lat: latitude + Math.sin(angle) * dist,
      lng: longitude + Math.cos(angle) * dist * 1.05,
      score: Math.round((28 + rand() * 62) * 10) / 10,
      kind,
    };
  });
}

function buildHeat(): HeatPoint[] {
  const rand = makeRandom(770423);
  return Array.from({ length: 150 }, () => {
    const angle = rand() * Math.PI * 2;
    const dist = rand() ** 0.7 * 0.85;
    const score = Math.max(6, Math.min(98, 92 - dist * 78 + (rand() - 0.5) * 46));
    return {
      lat: latitude + Math.sin(angle) * dist,
      lng: longitude + Math.cos(angle) * dist * 1.1,
      score: Math.round(score),
      radius: 9000 + rand() * 11000,
    };
  });
}

/** Wind-turbine style points used for the wind potential layer. */
function buildWind(): SitePoint[] {
  const rand = makeRandom(311207);
  return Array.from({ length: 9 }, (_, i) => {
    const angle = rand() * Math.PI * 2;
    const dist = 0.25 + rand() * 0.7;
    return {
      id: `wind-${i + 1}`,
      lat: latitude + Math.sin(angle) * dist,
      lng: longitude + Math.cos(angle) * dist * 1.1,
      score: Math.round((30 + rand() * 55) * 10) / 10,
      kind: "wind" as const,
    };
  });
}

export const mapSites = buildSites();
export const heatPoints = buildHeat();
export const windPoints = buildWind();

/** Water bodies + protected areas as simple circular footprints. */
export const waterBodies = [
  { id: "w1", lat: latitude + 0.17, lng: longitude - 0.1, radius: 4200 },
  { id: "w2", lat: latitude - 0.09, lng: longitude + 0.24, radius: 3100 },
  { id: "w3", lat: latitude + 0.34, lng: longitude + 0.31, radius: 5200 },
];

export const protectedAreas = [
  { id: "p1", lat: latitude - 0.28, lng: longitude - 0.26, radius: 9000 },
  { id: "p2", lat: latitude + 0.42, lng: longitude + 0.12, radius: 7000 },
];

/** Transmission corridors for the infrastructure layer. */
export const infrastructureLines: [number, number][][] = [
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

export const selectedSite = {
  status: "Optimal",
  location: dashboardData.site.location,
  coordinatesLabel: dashboardData.site.coordinatesLabel,
  latitude,
  longitude,
  score: dashboardData.suitability.score,
  outOf: dashboardData.suitability.outOf,
  rating: dashboardData.suitability.rating,
  metrics: [
    { label: "Best Technology", value: dashboardData.technology.name, icon: "solar" as const },
    { label: "Recommended Capacity", value: dashboardData.technology.capacityLabel },
    { label: "Annual Energy Potential", value: dashboardData.energy.totalLabel },
    { label: "Capacity Factor", value: "28.6%" },
    { label: "Est. Investment", value: "$550K – $1.54M" },
    { label: "Payback Period", value: "4.2 Years" },
  ],
};

export const mapSummary = {
  location: dashboardData.site.location,
  coordinatesLabel: dashboardData.site.coordinatesLabel,
  landAreaLabel: dashboardData.site.landAreaLabel,
  bestTechnology: `${dashboardData.technology.name} (${dashboardData.technology.capacityLabel})`,
  suitabilityCaption: `${dashboardData.suitability.score} Suitability Score`,
  annualEnergy: dashboardData.energy.totalLabel,
  annualEnergyCaption: dashboardData.energy.totalCaption,
  analysisTimeLabel: dashboardData.site.analysisTimeLabel,
};

export const siteInsights = [
  { label: "Total Sites Found", value: "28", caption: "within current view", icon: "land" as const, tone: "success" as const },
  { label: "High Suitability Sites", value: "9", caption: "Score > 70", icon: "check" as const, tone: "success" as const },
  { label: "Medium Suitability", value: "12", caption: "Score 40 – 70", icon: "alert" as const, tone: "solar" as const },
  { label: "Low Suitability", value: "7", caption: "Score < 40", icon: "alert" as const, tone: "error" as const },
  { label: "Avg. Solar Potential", value: dashboardData.resources.solar.value, caption: "kWh/m²/day", icon: "solar" as const, tone: "solar" as const },
  { label: "Avg. Wind Speed", value: dashboardData.resources.wind.value, caption: "m/s (100m)", icon: "wind" as const, tone: "wind" as const },
];

export const mapDataSources = "NASA POWER, Global Wind Atlas, SRTM, OpenStreetMap, Sentinel-2";

/** Suitability score → legend/marker colour. */
export function suitabilityColor(score: number) {
  if (score >= 70) return "oklch(0.62 0.16 150)";
  if (score >= 55) return "oklch(0.78 0.16 130)";
  if (score >= 40) return "oklch(0.83 0.16 90)";
  if (score >= 25) return "oklch(0.78 0.16 60)";
  return "oklch(0.65 0.19 30)";
}
