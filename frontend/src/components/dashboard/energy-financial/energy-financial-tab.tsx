import {
  Activity,
  BadgeDollarSign,
  CalendarClock,
  CircleDollarSign,
  Download,
  FileText,
  Gauge,
  Percent,
  ShieldCheck,
  Sun,
  TrendingDown,
  TrendingUp,
  Wallet,
  Wind,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { FeasibilityPanel } from "../feasibility/feasibility-primitives";
import {
  CapacityFactorSpark,
  CashFlowChart,
  CostDonut,
  GenerationBarChart,
} from "./energy-financial-charts";
import {
  energyFinancialData,
  type EfBadgeTone,
  type EnergyFinancialData,
} from "@/lib/energy-financial-data";
import { cn } from "@/lib/utils";

const kpiTone = {
  solar: {
    card: "border-solar/30 bg-solar-soft/40",
    label: "text-warning-foreground",
    icon: "bg-solar/15 text-warning-foreground",
    ring: "var(--solar)",
  },
  success: {
    card: "border-success/25 bg-success-soft/30",
    label: "text-success",
    icon: "bg-success/15 text-success",
    ring: "var(--success)",
  },
  hybrid: {
    card: "border-hybrid/25 bg-hybrid-soft/30",
    label: "text-hybrid",
    icon: "bg-hybrid/15 text-hybrid",
    ring: "var(--hybrid)",
  },
  wind: {
    card: "border-wind/25 bg-wind-soft/30",
    label: "text-wind",
    icon: "bg-wind/15 text-wind",
    ring: "var(--wind)",
  },
  warning: {
    card: "border-warning/30 bg-warning-soft/30",
    label: "text-warning-foreground",
    icon: "bg-warning/15 text-warning-foreground",
    ring: "var(--warning)",
  },
} as const;

const kpiIcon = {
  energy: Sun,
  capacity: Activity,
  capacityFactor: Gauge,
  lcoe: CircleDollarSign,
  payback: CalendarClock,
} as const;

const yieldIcon = {
  solar: Sun,
  wind: Wind,
  availability: ShieldCheck,
  degradation: TrendingDown,
} as const;

const yieldIconTone = {
  solar: "text-solar",
  wind: "text-wind",
  availability: "text-success",
  degradation: "text-hybrid",
} as const;

const metricIcon = {
  roi: TrendingUp,
  dscr: BadgeDollarSign,
  breakeven: CalendarClock,
  om: Wallet,
  coe: Percent,
} as const;

const badgeTone: Record<EfBadgeTone, StatusTone> = {
  success: "success",
  wind: "wind",
  solar: "solar",
  hybrid: "hybrid",
  info: "info",
  neutral: "neutral",
};

/** Small ring rendered on the right of a KPI card. */
function KpiRing({ color, icon }: { color: string; icon: React.ReactNode }) {
  const size = 48;
  const r = (size - 5) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={5} stroke="var(--muted)" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={5}
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={`${c * 0.72} ${c}`}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center" style={{ color }}>
        {icon}
      </span>
    </div>
  );
}

export function EnergyFinancialTab({
  data = energyFinancialData,
  onExport,
  onDownload,
}: {
  data?: EnergyFinancialData;
  onExport: () => void;
  onDownload: () => void;
}) {
  const gen = data.generation;

  return (
    <div className="min-w-0 space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-card-title text-xl">{data.header.title}</h2>
          <p className="text-helper">{data.header.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={onExport}>
            <FileText className="size-4" />
            Export Financial Report
          </Button>
          <Button size="sm" className="gap-2" onClick={onDownload}>
            <Download className="size-4" />
            Download Full Report
          </Button>
        </div>
      </header>

      {/* KPI cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {data.kpis.map((kpi) => {
          const tone = kpiTone[kpi.tone];
          const Icon = kpiIcon[kpi.id];
          return (
            <div
              key={kpi.id}
              className={cn("surface-card flex min-w-0 flex-col gap-2 border p-4", tone.card)}
            >
              <p className={cn("text-label text-xs leading-snug", tone.label)}>{kpi.label}</p>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-2xl font-bold tracking-tight">
                    {kpi.value}
                    {kpi.unit ? (
                      <span className="text-muted-foreground ml-1 text-sm font-medium">
                        {kpi.unit}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-helper mt-1">{kpi.caption}</p>
                </div>
                <KpiRing color={tone.ring} icon={<Icon className="size-4" />} />
              </div>

              {kpi.id === "energy" ? (
                <>
                  <div className="bg-muted mt-1 h-1.5 overflow-hidden rounded-full">
                    <div className="bg-solar h-full" style={{ width: "42.3%" }} />
                  </div>
                  <div className="border-solar/25 mt-1 flex items-center justify-between gap-2 border-t pt-2">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <Sun className="text-solar size-4 shrink-0" />
                      <span className="min-w-0">
                        <span className="text-label block text-xs">{gen.solar.value}</span>
                        <span className="text-helper block">{gen.solar.caption}</span>
                      </span>
                    </span>
                    <span className="flex min-w-0 items-center gap-1.5">
                      <Wind className="text-wind size-4 shrink-0" />
                      <span className="min-w-0">
                        <span className="text-label block text-xs">{gen.wind.value}</span>
                        <span className="text-helper block">{gen.wind.caption}</span>
                      </span>
                    </span>
                  </div>
                </>
              ) : null}

              {kpi.id === "capacity" ? (
                <div className="mt-1 flex items-center justify-between gap-2 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Sun className="text-solar size-4 shrink-0" />
                    <span>
                      <span className="text-label block text-xs">{data.capacity.solar}</span>
                      <span className="text-helper block">Solar</span>
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wind className="text-wind size-4 shrink-0" />
                    <span>
                      <span className="text-label block text-xs">{data.capacity.wind}</span>
                      <span className="text-helper block">Wind</span>
                    </span>
                  </span>
                </div>
              ) : null}

              {kpi.id === "capacityFactor" ? (
                <CapacityFactorSpark data={data.capacityFactorTrend} />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Row 1 */}
      <div className="grid gap-4 xl:grid-cols-3">
        <FeasibilityPanel
          title="Energy Generation Breakdown"
          subtitle="Monthly energy generation by source"
        >
          <div className="mb-2 flex items-center justify-end gap-4">
            <LegendDot color="var(--solar)" label="Solar (MWh)" />
            <LegendDot color="var(--wind)" label="Wind (MWh)" />
          </div>
          <p className="text-helper mb-1">MWh</p>
          <GenerationBarChart data={gen.monthly} />
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <SummaryTile
              icon={<Sun className="text-solar size-4" />}
              value={gen.solar.value}
              caption={gen.solar.caption}
              className="border-solar/25 bg-solar-soft/30"
            />
            <SummaryTile
              icon={<Wind className="text-wind size-4" />}
              value={gen.wind.value}
              caption={gen.wind.caption}
              className="border-wind/25 bg-wind-soft/30"
            />
            <SummaryTile
              icon={<Zap className="text-success size-4" />}
              value={gen.total.value}
              caption={gen.total.caption}
              className="border-success/25 bg-success-soft/30"
            />
          </div>
        </FeasibilityPanel>

        <FeasibilityPanel title="Cash Flow Projection (USD)" subtitle="20-year cash flow projection">
          <div className="mb-2 flex items-center gap-4">
            <LegendDot color="var(--success)" label="Annual Cash Flow" square />
            <LegendDot color="var(--wind)" label="Cumulative Cash Flow" square />
          </div>
          <CashFlowChart data={data.cashFlow.points} />
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {data.cashFlow.summary.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "min-w-0 rounded-xl border p-2.5 text-center",
                  item.tone === "solar"
                    ? "border-solar/25 bg-solar-soft/30"
                    : "border-success/25 bg-success-soft/30",
                )}
              >
                <p
                  className={cn(
                    "text-sm font-bold",
                    item.tone === "solar" ? "text-warning-foreground" : "text-success",
                  )}
                >
                  {item.value}
                </p>
                <p className="text-helper mt-0.5 leading-snug">{item.label}</p>
              </div>
            ))}
          </div>
        </FeasibilityPanel>

        <FeasibilityPanel title="Energy Yield & Performance">
          <ul className="divide-border divide-y">
            {data.yields.map((row) => {
              const Icon = yieldIcon[row.icon];
              return (
                <li key={row.label} className="flex items-center gap-3 py-2.5">
                  <Icon className={cn("size-4 shrink-0", yieldIconTone[row.icon])} />
                  <span className="text-label min-w-0 flex-1 leading-snug font-normal">
                    {row.label}
                  </span>
                  <span className="text-label shrink-0 text-xs font-semibold">{row.value}</span>
                  <StatusBadge tone={badgeTone[row.tone]} className="shrink-0 text-[11px]">
                    {row.badge}
                  </StatusBadge>
                </li>
              );
            })}
          </ul>
        </FeasibilityPanel>
      </div>

      {/* Row 2 */}
      <div className="grid gap-4 xl:grid-cols-3">
        <FeasibilityPanel title="Cost Breakdown" subtitle="Total project cost distribution">
          <div className="flex flex-col items-center gap-3">
            <CostDonut slices={data.cost.slices} total={data.cost.total} />
            <ul className="w-full min-w-0 space-y-2">
              {data.cost.slices.map((slice) => (
                <li key={slice.label} className="flex items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-label min-w-0 flex-1 truncate text-xs font-normal">
                    {slice.label}
                  </span>
                  <span className="text-label shrink-0 text-xs font-semibold">{slice.amount}</span>
                  <span className="text-helper w-14 shrink-0 text-right">
                    ({slice.share.toFixed(1)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </FeasibilityPanel>

        <FeasibilityPanel title="Financial Metrics Summary" subtitle="Key financial indicators">
          <ul className="divide-border divide-y">
            {data.financialMetrics.map((row) => {
              const Icon = metricIcon[row.icon];
              return (
                <li key={row.label} className="flex items-center gap-3 py-3">
                  <Icon className="text-success size-4 shrink-0" />
                  <span className="text-label min-w-0 flex-1 leading-snug font-normal">
                    {row.label}
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="text-label block text-xs font-semibold">{row.value}</span>
                    {row.caption ? (
                      <span className="text-info block text-[10px] font-semibold">
                        {row.caption}
                      </span>
                    ) : null}
                  </span>
                  {row.badge ? (
                    <StatusBadge tone={badgeTone[row.tone]} className="shrink-0 text-[11px]">
                      {row.badge}
                    </StatusBadge>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </FeasibilityPanel>

        <FeasibilityPanel title="Scenario Analysis" subtitle="Sensitivity analysis on key variables">
          <div className="min-w-0 overflow-x-auto">
            <table className="w-full min-w-[360px] border-collapse text-left">
              <thead>
                <tr className="border-border border-b">
                  <th className="text-helper py-2 pr-2 font-semibold">Scenario</th>
                  <th className="text-helper py-2 px-2 text-right font-semibold">Energy (MWh/yr)</th>
                  <th className="text-helper py-2 px-2 text-right font-semibold">LCOE ($/kWh)</th>
                  <th className="text-helper py-2 px-2 text-right font-semibold">IRR (%)</th>
                  <th className="text-helper py-2 pl-2 text-right font-semibold">
                    Payback (Years)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.scenarios.map((row) => (
                  <tr
                    key={row.scenario}
                    className={cn(
                      "border-border border-b last:border-0",
                      row.base && "bg-success-soft/40",
                    )}
                  >
                    <td
                      className={cn(
                        "py-2.5 pr-2 text-xs",
                        row.base ? "text-success font-semibold" : "text-foreground",
                      )}
                    >
                      {row.scenario}
                    </td>
                    <td className="py-2.5 px-2 text-right text-xs">{row.energy}</td>
                    <td className="py-2.5 px-2 text-right text-xs">{row.lcoe}</td>
                    <td className="py-2.5 px-2 text-right text-xs">{row.irr}</td>
                    <td className="py-2.5 pl-2 text-right text-xs">{row.payback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FeasibilityPanel>
      </div>

      {/* Viability banner */}
      <div className="surface-card border-success/25 bg-success-soft/30 flex flex-wrap items-center justify-between gap-3 p-4">
        <p className="text-label min-w-0 leading-snug font-normal">{data.viability.note}</p>
        <div className="flex shrink-0 items-center gap-2">
          <ShieldCheck className="text-success size-4" />
          <span className="text-label">{data.viability.label}</span>
          <StatusBadge tone="success">{data.viability.value}</StatusBadge>
        </div>
      </div>
    </div>
  );
}

function LegendDot({
  color,
  label,
  square,
}: {
  color: string;
  label: string;
  square?: boolean;
}) {
  return (
    <span className="text-helper flex items-center gap-1.5">
      <span
        className={cn("size-2.5 shrink-0", square ? "rounded-[3px]" : "rounded-full")}
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

function SummaryTile({
  icon,
  value,
  caption,
  className,
}: {
  icon: React.ReactNode;
  value: string;
  caption: string;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2 rounded-xl border p-2.5", className)}>
      <span className="shrink-0">{icon}</span>
      <span className="min-w-0">
        <span className="text-label block text-xs font-semibold">{value}</span>
        <span className="text-helper block leading-snug">{caption}</span>
      </span>
    </div>
  );
}
