/**
 * Energy & Financial tab presentation data layer.
 *
 * All values rendered by the Energy & Financial tab live here so they can be
 * mapped 1:1 from the backend analysis response later without touching JSX.
 */

export type EfBadgeTone = "success" | "wind" | "solar" | "hybrid" | "info" | "neutral";

export type EfKpi = {
  id: "energy" | "capacity" | "capacityFactor" | "lcoe" | "payback";
  label: string;
  value: string;
  unit?: string;
  caption: string;
  tone: "solar" | "success" | "hybrid" | "wind" | "warning";
};

export type MonthlyGeneration = { month: string; solar: number; wind: number };

export type CashFlowPoint = { year: number; annual: number; cumulative: number };

export type YieldRow = {
  label: string;
  value: string;
  badge: string;
  tone: EfBadgeTone;
  icon: "solar" | "wind" | "availability" | "degradation";
};

export type CostSlice = { label: string; amount: string; share: number; color: string };

export type FinancialMetricRow = {
  label: string;
  value: string;
  caption?: string;
  badge: string;
  tone: EfBadgeTone;
  icon: "roi" | "dscr" | "breakeven" | "om" | "coe";
};

export type ScenarioRow = {
  scenario: string;
  energy: string;
  lcoe: string;
  irr: string;
  payback: string;
  base?: boolean;
};

export type EnergyFinancialData = {
  header: { title: string; subtitle: string };
  kpis: EfKpi[];
  generation: {
    solar: { value: string; caption: string };
    wind: { value: string; caption: string };
    total: { value: string; caption: string };
    monthly: MonthlyGeneration[];
  };
  capacity: { solar: string; wind: string };
  capacityFactorTrend: { x: number; value: number }[];
  cashFlow: {
    points: CashFlowPoint[];
    summary: { label: string; value: string; tone: EfBadgeTone }[];
  };
  yields: YieldRow[];
  cost: { total: string; slices: CostSlice[] };
  financialMetrics: FinancialMetricRow[];
  scenarios: ScenarioRow[];
  viability: { note: string; label: string; value: string };
};

const monthly: MonthlyGeneration[] = [
  { month: "Jan", solar: 6.4, wind: 17.6 },
  { month: "Feb", solar: 7.0, wind: 17.9 },
  { month: "Mar", solar: 8.1, wind: 18.9 },
  { month: "Apr", solar: 8.6, wind: 21.2 },
  { month: "May", solar: 8.9, wind: 21.6 },
  { month: "Jun", solar: 7.4, wind: 24.3 },
  { month: "Jul", solar: 6.6, wind: 24.9 },
  { month: "Aug", solar: 6.8, wind: 26.9 },
  { month: "Sep", solar: 7.2, wind: 21.4 },
  { month: "Oct", solar: 7.3, wind: 18.1 },
  { month: "Nov", solar: 6.6, wind: 19.4 },
  { month: "Dec", solar: 6.3, wind: 18.4 },
];

function buildCashFlow(): CashFlowPoint[] {
  const points: CashFlowPoint[] = [{ year: 0, annual: -550_000, cumulative: -550_000 }];
  let cumulative = -550_000;
  for (let year = 1; year <= 20; year += 1) {
    const annual = 160_000;
    cumulative += annual;
    points.push({ year, annual, cumulative });
  }
  return points;
}

function buildCapacityFactorTrend() {
  const values = [24.6, 25.4, 25.1, 26.3, 26.0, 27.1, 27.6, 27.2, 28.1, 28.6, 28.2, 29.4];
  return values.map((value, index) => ({ x: index, value }));
}

export const energyFinancialData: EnergyFinancialData = {
  header: {
    title: "Energy & Financial Analysis",
    subtitle: "Comprehensive energy production and financial feasibility analysis",
  },
  kpis: [
    {
      id: "energy",
      label: "Annual Energy Generation",
      value: "204.98",
      unit: "MWh",
      caption: "Total Estimated",
      tone: "solar",
    },
    {
      id: "capacity",
      label: "Capacity (Recommended)",
      value: "8.0",
      unit: "MW",
      caption: "Total Capacity",
      tone: "success",
    },
    {
      id: "capacityFactor",
      label: "Capacity Factor (Weighted Avg.)",
      value: "28.6",
      unit: "%",
      caption: "Excellent Performance",
      tone: "hybrid",
    },
    {
      id: "lcoe",
      label: "Levelized Cost of Energy (LCOE)",
      value: "$0.068",
      unit: "/kWh",
      caption: "Very Competitive",
      tone: "wind",
    },
    {
      id: "payback",
      label: "Payback Period",
      value: "4.2",
      unit: "Years",
      caption: "Strong Investment",
      tone: "warning",
    },
  ],
  generation: {
    solar: { value: "86.72 MWh", caption: "Solar (42.3%)" },
    wind: { value: "118.26 MWh", caption: "Wind (57.7%)" },
    total: { value: "204.98 MWh", caption: "Total Annual Energy" },
    monthly,
  },
  capacity: { solar: "5.0 MW", wind: "3.0 MW" },
  capacityFactorTrend: buildCapacityFactorTrend(),
  cashFlow: {
    points: buildCashFlow(),
    summary: [
      { label: "Initial Investment", value: "$550.00K", tone: "success" },
      { label: "Annual Revenue", value: "$1.54M", tone: "success" },
      { label: "NPV (20 yrs)", value: "$2.12M", tone: "success" },
      { label: "IRR", value: "17.8%", tone: "solar" },
    ],
  },
  yields: [
    {
      label: "Specific Yield (Solar)",
      value: "1,247 kWh/kWp/yr",
      badge: "Excellent",
      tone: "success",
      icon: "solar",
    },
    {
      label: "Specific Yield (Wind)",
      value: "3,940 kWh/kW/yr",
      badge: "Excellent",
      tone: "success",
      icon: "wind",
    },
    {
      label: "Performance Ratio (Solar)",
      value: "82.4%",
      badge: "Excellent",
      tone: "success",
      icon: "solar",
    },
    {
      label: "Performance Ratio (Wind)",
      value: "88.1%",
      badge: "Excellent",
      tone: "success",
      icon: "wind",
    },
    {
      label: "System Availability",
      value: "98.7%",
      badge: "Excellent",
      tone: "success",
      icon: "availability",
    },
    {
      label: "Degradation Rate",
      value: "-0.5% /year",
      badge: "Low",
      tone: "info",
      icon: "degradation",
    },
  ],
  cost: {
    total: "$5.00M",
    slices: [
      { label: "Solar Equipment", amount: "$2.00M", share: 40, color: "var(--solar)" },
      { label: "Wind Equipment", amount: "$1.50M", share: 30, color: "var(--wind)" },
      { label: "Installation & EPC", amount: "$0.90M", share: 18, color: "var(--success)" },
      { label: "Land & Civil Works", amount: "$0.30M", share: 6, color: "var(--hybrid)" },
      { label: "Other Costs", amount: "$0.30M", share: 6, color: "var(--warning)" },
    ],
  },
  financialMetrics: [
    {
      label: "Return on Investment (ROI)",
      value: "179.52%",
      badge: "Excellent",
      tone: "success",
      icon: "roi",
    },
    { label: "Debt Service Coverage Ratio (DSCR)", value: "1.85", badge: "Strong", tone: "success", icon: "dscr" },
    { label: "Break-even Year", value: "Year 4.2", badge: "Good", tone: "success", icon: "breakeven" },
    { label: "Annual O&M Cost", value: "$86,500", badge: "Estimated", tone: "neutral", icon: "om" },
    {
      label: "Cost of Energy (COE)",
      value: "$0.068 /kWh",
      caption: "Very Competitive",
      badge: "",
      tone: "info",
      icon: "coe",
    },
  ],
  scenarios: [
    { scenario: "Base Case", energy: "204.98", lcoe: "0.068", irr: "17.8%", payback: "4.2", base: true },
    { scenario: "High Resource (+10%)", energy: "225.48", lcoe: "0.061", irr: "21.3%", payback: "3.6" },
    { scenario: "Low Resource (-10%)", energy: "184.48", lcoe: "0.076", irr: "14.7%", payback: "5.1" },
    { scenario: "High CAPEX (+10%)", energy: "204.98", lcoe: "0.075", irr: "15.2%", payback: "4.9" },
    { scenario: "Low O&M (-10%)", energy: "204.98", lcoe: "0.066", irr: "18.9%", payback: "4.0" },
  ],
  viability: {
    note: "The project demonstrates strong financial viability with excellent energy generation potential and attractive returns.",
    label: "Financial Viability",
    value: "High",
  },
};
