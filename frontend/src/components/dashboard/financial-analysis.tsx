import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { CardPanel } from "./card-panel";
import type { DashboardData } from "@/lib/dashboard-data";

const toneClass = {
  success: "border-success/25 bg-success-soft text-primary-strong",
  info: "border-info/20 bg-info-soft text-info",
  warning: "border-warning/30 bg-warning-soft text-warning-foreground",
  solar: "border-solar/30 bg-solar-soft text-warning-foreground",
} as const;

const formatUsd = (v: number) => {
  if (v === 0) return "$0";
  const m = v / 1_000_000;
  return `${m < 0 ? "-" : ""}$${Math.abs(m).toFixed(m % 1 === 0 ? 0 : 1)}M`;
};

export function FinancialAnalysis({ data }: { data: DashboardData["financial"] }) {
  return (
    <CardPanel title="Financial Analysis">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {data.metrics.map((m) => (
          <div
            key={m.label}
            className={`rounded-xl border px-3 py-2.5 text-center ${toneClass[m.tone]}`}
          >
            <p className="text-[13px] font-bold tracking-tight">{m.value}</p>
            <p className="text-helper">{m.label}</p>
          </div>
        ))}
      </div>

      <p className="text-label mt-4 mb-1">Cash Flow Projection (USD)</p>
      <div className="h-[170px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.cashFlow} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
            <defs>
              <linearGradient id="cashflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              width={52}
              tickFormatter={formatUsd}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#cashflow)"
              dot={{ r: 3, fill: "var(--primary)", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardPanel>
  );
}
