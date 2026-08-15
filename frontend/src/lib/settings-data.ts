/** Static data layer for the Settings screen (frontend-only, no backend yet). */

export type SettingsTabId =
  | "general"
  | "account"
  | "data-sources"
  | "notifications"
  | "preferences"
  | "security"
  | "system";

export const settingsTabs: { id: SettingsTabId; label: string }[] = [
  { id: "general", label: "General" },
  { id: "account", label: "Account" },
  { id: "data-sources", label: "Data Sources" },
  { id: "notifications", label: "Notifications" },
  { id: "preferences", label: "Preferences" },
  { id: "security", label: "Security" },
  { id: "system", label: "System" },
];

export const analysisTypeOptions = ["Solar Project", "Wind Project", "Hybrid Project"];
export const currencyOptions = ["USD ($)", "EUR (€)", "INR (₹)", "GBP (£)"];
export const distanceUnitOptions = ["Kilometers (km)", "Miles (mi)", "Meters (m)"];
export const areaUnitOptions = ["Hectares (ha)", "Acres (ac)", "Square kilometers (km²)"];
export const dateFormatOptions = [
  "Aug 13, 2026 (MMM DD, YYYY)",
  "13/08/2026 (DD/MM/YYYY)",
  "08/13/2026 (MM/DD/YYYY)",
  "2026-08-13 (YYYY-MM-DD)",
];
export const timeZoneOptions = [
  "(UTC+05:30) Asia/Kolkata",
  "(UTC+00:00) UTC",
  "(UTC+01:00) Europe/Berlin",
  "(UTC-05:00) America/New_York",
];

export type GeneralSettings = {
  analysisType: string;
  currency: string;
  distanceUnit: string;
  areaUnit: string;
  dateFormat: string;
  timeZone: string;
};

export const defaultGeneralSettings: GeneralSettings = {
  analysisType: "Solar Project",
  currency: "USD ($)",
  distanceUnit: "Kilometers (km)",
  areaUnit: "Hectares (ha)",
  dateFormat: "Aug 13, 2026 (MMM DD, YYYY)",
  timeZone: "(UTC+05:30) Asia/Kolkata",
};

export const accountProfile = {
  name: "Ganji Venkatesh",
  role: "AI Engineer",
  email: "ganji.venkatesh@example.com",
  organization: "Renewables Intelligence Lab",
  phone: "+91 98765 43210",
};

export const systemInformation = [
  { label: "Application Version", value: "v1.0.0" },
  { label: "Backend Version", value: "v1.0.0" },
  { label: "Database", value: "PostgreSQL 15" },
  { label: "Environment", value: "Production" },
  { label: "Last Updated", value: "Aug 13, 2026 10:45 AM" },
];

export const dataStorageStats = [
  { label: "Total Analyses", value: "18" },
  { label: "Storage Used", value: "2.45 GB" },
  { label: "Reports Generated", value: "18" },
  { label: "Exported Files", value: "24" },
];

export const dataSources = [
  {
    name: "NASA POWER",
    description: "Solar irradiance and meteorological time series",
    status: "Connected" as const,
    latency: "142 ms",
  },
  {
    name: "Global Wind Atlas",
    description: "Wind speed, power density and Weibull parameters",
    status: "Connected" as const,
    latency: "196 ms",
  },
  {
    name: "Copernicus DEM",
    description: "Elevation, slope and terrain roughness datasets",
    status: "Connected" as const,
    latency: "310 ms",
  },
  {
    name: "OpenStreetMap Infrastructure",
    description: "Roads, substations and transmission network layers",
    status: "Degraded" as const,
    latency: "820 ms",
  },
];

export const notificationSettings = [
  { id: "analysis-complete", title: "Analysis completed", description: "Notify when a site analysis finishes", enabled: true },
  { id: "report-ready", title: "Report ready", description: "Notify when a generated report is available", enabled: true },
  { id: "data-source", title: "Data source alerts", description: "Notify when a data source degrades or fails", enabled: true },
  { id: "weekly-digest", title: "Weekly digest", description: "Email summary of new analyses and scores", enabled: false },
  { id: "product-updates", title: "Product updates", description: "Occasional platform release notes", enabled: false },
];

export const preferenceWeights = [
  { id: "resource", label: "Resource potential", value: 30 },
  { id: "financial", label: "Financial viability", value: 25 },
  { id: "infrastructure", label: "Infrastructure access", value: 20 },
  { id: "environment", label: "Environmental impact", value: 15 },
  { id: "risk", label: "Risk tolerance", value: 10 },
];

export const securityItems = [
  { title: "Two-factor authentication", description: "Require an authenticator code at sign in", enabled: true },
  { title: "Session timeout", description: "Automatically sign out after 30 minutes idle", enabled: true },
  { title: "Login alerts", description: "Email me when a new device signs in", enabled: false },
];
