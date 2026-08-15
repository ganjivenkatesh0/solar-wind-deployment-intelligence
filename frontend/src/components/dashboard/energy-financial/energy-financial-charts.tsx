import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import type { CashFlowPoint, CostSlice, MonthlyGeneration } from "@/lib/energy-financial-data";

const axisTick = { fontSize: 10, fill: "var(--muted-foreground)" } as const;

/** Stacked monthly solar vs wind generation. */
export function GenerationBarChart({ data }: { data: MonthlyGeneration[] }) {
  return (
    <div className="h-[210px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap="28%">
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
          <YAxis
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            width={26}
            domain={[0, 40]}
            ticks={[0, 10, 20, 30, 40]}
          />
          <Bar dataKey="solar" stackId="gen" fill="var(--solar)" isAnimationActive={false} />
          <Bar
            dataKey="wind"
            stackId="gen"
            fill="var(--wind)"
            isAnimationActive={false}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** 20-year annual + cumulative cash flow. */
export function CashFlowChart({ data }: { data: CashFlowPoint[] }) {
  const fmt = (v: number) =>
    v === 0 ? "$0" : `${v < 0 ? "-" : ""}$${Math.abs(v / 1_000_000).toFixed(1)}M`;
  return (
    <div className="h-[210px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="year"
            tick={axisTick}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            ticks={[0, 5, 10, 15, 20]}
            tickFormatter={(v: number) => (v === 0 ? "Year 0" : String(v))}
          />
          <YAxis
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            width={48}
            domain={[-1_000_000, 3_000_000]}
            ticks={[-1_000_000, 0, 1_000_000, 2_000_000, 3_000_000]}
            tickFormatter={fmt}
          />
          <Line
            type="linear"
            dataKey="annual"
            stroke="var(--success)"
            strokeWidth={1.5}
            isAnimationActive={false}
            dot={{ r: 2.5, fill: "var(--success)", stroke: "none" }}
          />
          <Line
            type="linear"
            dataKey="cumulative"
            stroke="var(--wind)"
            strokeWidth={1.75}
            isAnimationActive={false}
            dot={{ r: 2.5, fill: "var(--wind)", stroke: "none" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Sparkline shown inside the capacity factor KPI card. */
export function CapacityFactorSpark({ data }: { data: { x: number; value: number }[] }) {
  return (
    <div className="h-[52px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <Area
            type="linear"
            dataKey="value"
            stroke="var(--hybrid)"
            strokeWidth={1.5}
            fill="var(--hybrid)"
            fillOpacity={0.14}
            isAnimationActive={false}
            dot={{ r: 1.6, fill: "var(--hybrid)", stroke: "none" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Project cost distribution donut. */
export function CostDonut({ slices, total }: { slices: CostSlice[]; total: string }) {
  return (
    <div className="relative h-[200px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={slices}
            dataKey="share"
            nameKey="label"
            innerRadius="58%"
            outerRadius="92%"
            paddingAngle={1}
            stroke="none"
            isAnimationActive={false}
          >
            {slices.map((slice) => (
              <Cell key={slice.label} fill={slice.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-helper">Total Cost</p>
          <p className="text-lg font-bold tracking-tight">{total}</p>
        </div>
      </div>
    </div>
  );
}
