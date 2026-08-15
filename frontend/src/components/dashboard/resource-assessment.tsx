import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { CardPanel } from "./card-panel";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { SolarIcon, WindIcon } from "@/lib/icons";
import { Droplets, Gauge, Sun, Thermometer } from "lucide-react";
import type { DashboardData, MonthlyPoint } from "@/lib/dashboard-data";

const envIcons = {
  temperature: Thermometer,
  humidity: Droplets,
  sun: Sun,
  pressure: Gauge,
} as const;

const envIconClass = {
  temperature: "text-solar",
  humidity: "text-wind",
  sun: "text-solar",
  pressure: "text-info",
} as const;

function ResourceChart({ data, color }: { data: MonthlyPoint[]; color: string }) {
  const id = `res-${color.replace(/[^a-z]/gi, "")}`;
  return (
    <div className="h-[86px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 6, right: 4, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`var(${color})`} stopOpacity={0.28} />
              <stop offset="100%" stopColor={`var(${color})`} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 8, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 8, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={26}
            domain={[0, 8]}
            ticks={[0, 2, 4, 6, 8]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={`var(${color})`}
            strokeWidth={1.75}
            fill={`url(#${id})`}
            dot={{ r: 2, fill: `var(${color})`, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ResourceAssessment({
  data,
  onViewDetails,
}: {
  data: DashboardData["resources"];
  onViewDetails: () => void;
}) {
  return (
    <CardPanel
      title="Resource Assessment"
      action={
        <Button variant="outline" size="sm" onClick={onViewDetails}>
          View Details
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-solar/30 bg-solar-soft/50 p-3">
          <div className="mb-1 flex items-center gap-2">
            <SolarIcon className="text-solar size-4" />
            <p className="text-label">Solar Resource</p>
          </div>
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xl font-bold tracking-tight">
              {data.solar.value}
              <span className="text-muted-foreground ml-1 text-[11px] font-medium">{data.solar.unit}</span>
            </p>
            <StatusBadge tone="success">{data.solar.rating}</StatusBadge>
          </div>
          <ResourceChart data={data.solar.monthly} color="--solar" />
        </div>

        <div className="rounded-xl border border-wind/30 bg-wind-soft/50 p-3">
          <div className="mb-1 flex items-center gap-2">
            <WindIcon className="text-wind size-4" />
            <p className="text-label">Wind Resource</p>
          </div>
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xl font-bold tracking-tight">
              {data.wind.value}
              <span className="text-muted-foreground ml-1 text-[11px] font-medium">{data.wind.unit}</span>
            </p>
            <StatusBadge tone="wind">{data.wind.rating}</StatusBadge>
          </div>
          <ResourceChart data={data.wind.monthly} color="--wind" />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 divide-border rounded-xl border border-border sm:grid-cols-4 sm:divide-x">
        {data.environment.map((item) => {
          const Icon = envIcons[item.icon];
          return (
            <div key={item.label} className="flex items-center gap-2 px-3 py-2.5">
              <Icon className={`size-4 shrink-0 ${envIconClass[item.icon]}`} />
              <div className="min-w-0">
                <p className="text-label truncate">
                  {item.value} <span className="text-helper inline">{item.unit}</span>
                </p>
                <p className="text-helper truncate">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </CardPanel>
  );
}
