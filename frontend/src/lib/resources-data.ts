/**
 * Resources tab presentation data.
 *
 * Every value rendered by the Dashboard → Resources tab lives here so it can
 * later be mapped 1:1 from the analysis API response without touching JSX.
 */

export type Tone = "solar" | "wind" | "success" | "info" | "hybrid";

export type MetricTile = {
  value: string;
  unit?: string;
  label: string;
  tone: Tone;
};

export type ChartPoint = { month: string; value: number };

export type IconKey =
  | "temperature"
  | "humidity"
  | "windSpeed"
  | "pressure"
  | "turbulence"
  | "capacity"
  | "hubHeight"
  | "quality"
  | "elevation"
  | "slope"
  | "landUsability"
  | "landStatus"
  | "road"
  | "grid"
  | "substation"
  | "water";

export type IconMetric = MetricTile & { icon: IconKey };

export type ResourcesData = {
  dataSources: { name: string; tone: Tone }[];
  solar: {
    metrics: MetricTile[];
    chartTitle: string;
    chart: ChartPoint[];
    environment: IconMetric[];
  };
  wind: {
    metrics: MetricTile[];
    chartTitle: string;
    chart: ChartPoint[];
    environment: IconMetric[];
  };
  terrain: IconMetric[];
  infrastructure: IconMetric[];
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const toChart = (values: number[]): ChartPoint[] =>
  MONTHS.map((month, i) => ({ month, value: values[i] ?? 0 }));

export const resourcesData: ResourcesData = {
  dataSources: [
    { name: "NASA POWER", tone: "wind" },
    { name: "Global Wind Atlas", tone: "success" },
    { name: "SRTM", tone: "solar" },
    { name: "OpenStreetMap", tone: "hybrid" },
    { name: "Sentinel-2", tone: "info" },
  ],
  solar: {
    metrics: [
      { value: "4.15", unit: "kWh/m²/day", label: "Global Horizontal Irradiance", tone: "success" },
      { value: "5.02", unit: "kWh/m²/day", label: "Direct Normal Irradiance", tone: "solar" },
      { value: "2049", unit: "kWh/m²/year", label: "Annual Radiation", tone: "wind" },
      { value: "82%", label: "Data Quality Score", tone: "hybrid" },
    ],
    chartTitle: "Solar Irradiance (kWh/m²/day)",
    chart: toChart([4.02, 4.35, 4.68, 5.02, 5.28, 5.42, 5.38, 5.12, 4.86, 4.42, 4.12, 3.95]),
    environment: [
      { value: "20.4", unit: "°C", label: "Temperature", tone: "solar", icon: "temperature" },
      { value: "65.44", unit: "%", label: "Humidity", tone: "wind", icon: "humidity" },
      { value: "6.8", unit: "m/s", label: "Wind Speed", tone: "info", icon: "windSpeed" },
      { value: "1021", unit: "hPa", label: "Air Pressure", tone: "hybrid", icon: "pressure" },
    ],
  },
  wind: {
    metrics: [
      { value: "3.72", unit: "m/s", label: "Mean Wind Speed", tone: "success" },
      { value: "5.48", unit: "m/s", label: "Max Wind Speed", tone: "solar" },
      { value: "3160", unit: "h/year", label: "Wind Hours", tone: "wind" },
      { value: "78%", label: "Data Quality Score", tone: "hybrid" },
    ],
    chartTitle: "Wind Speed (m/s)",
    chart: toChart([3.12, 3.18, 3.62, 4.02, 4.38, 4.82, 5.18, 5.42, 5.48, 4.92, 4.35, 4.02]),
    environment: [
      { value: "0.32", label: "Turbulence Intensity", tone: "info", icon: "turbulence" },
      { value: "15.2", unit: "%", label: "Capacity Factor (Estimated)", tone: "success", icon: "capacity" },
      { value: "50", unit: "m", label: "Hub Height", tone: "solar", icon: "hubHeight" },
      { value: "A Class", label: "Wind Resource Quality", tone: "hybrid", icon: "quality" },
    ],
  },
  terrain: [
    { value: "662", unit: "m", label: "Elevation", tone: "wind", icon: "elevation" },
    { value: "1 - 3°", label: "Slope", tone: "success", icon: "slope" },
    { value: "95.3", unit: "%", label: "Land Usability", tone: "success", icon: "landUsability" },
    { value: "Available", label: "Land Status", tone: "success", icon: "landStatus" },
  ],
  infrastructure: [
    { value: "2.1", unit: "km", label: "Road Access", tone: "hybrid", icon: "road" },
    { value: "3.4", unit: "km", label: "Grid Connection", tone: "solar", icon: "grid" },
    { value: "5.8", unit: "km", label: "Substation", tone: "solar", icon: "substation" },
    { value: "1.2", unit: "km", label: "Water Source", tone: "wind", icon: "water" },
  ],
};
