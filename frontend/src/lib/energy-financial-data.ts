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

