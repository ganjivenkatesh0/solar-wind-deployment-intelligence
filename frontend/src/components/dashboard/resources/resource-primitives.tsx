import {
  Activity,
  Award,
  Droplet,
  Droplets,
  Gauge,
  Layers,
  Mountain,
  Route,
  Ruler,
  Sprout,
  Thermometer,
  TrendingUp,
  Wind,
  Zap,
  CircleCheck,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import type { ChartPoint, IconKey, IconMetric, MetricTile, Tone } from "@/lib/resources-data";
import { cn } from "@/lib/utils";

export const toneText: Record<Tone, string> = {
  solar: "text-solar",
  wind: "text-wind",
  success: "text-primary",
  info: "text-info",
  hybrid: "text-hybrid",
};

export const toneSoft: Record<Tone, string> = {
  solar: "border-solar/30 bg-solar-soft/50",
  wind: "border-wind/30 bg-wind-soft/50",
  success: "border-primary/30 bg-success-soft/50",
  info: "border-info/30 bg-info-soft/50",
  hybrid: "border-hybrid/30 bg-hybrid-soft/50",
};

export const metricIcons: Record<IconKey, typeof Wind> = {
  temperature: Thermometer,
  humidity: Droplets,
  windSpeed: Wind,
  pressure: Gauge,
  turbulence: Activity,
  capacity: TrendingUp,
  hubHeight: Ruler,
  quality: Award,
  elevation: Mountain,
  slope: Layers,
  landUsability: Sprout,
  landStatus: CircleCheck,
  road: Route,
  grid: Zap,
  substation: Zap,
  water: Droplet,
};

/** Large highlighted metric tile used in the Solar / Wind assessment cards. */
export function ResourceMetric({ metric }: { metric: MetricTile }) {
  return (
    <div className={cn("min-w-0 rounded-xl border p-3", toneSoft[metric.tone])}>
      <p className="flex flex-wrap items-baseline gap-1">
        <span className={cn("text-lg font-bold tracking-tight", toneText[metric.tone])}>
          {metric.value}
        </span>
        {metric.unit ? (
          <span className="text-muted-foreground text-[10px] font-medium">{metric.unit}</span>
        ) : null}
      </p>
      <p className="text-helper mt-0.5 leading-snug">{metric.label}</p>
    </div>
  );
}

/** Compact icon + value tile used below charts and in the terrain / infra cards. */
export function IconMetricTile({ metric }: { metric: IconMetric }) {
  const Icon = metricIcons[metric.icon];
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-lg border",
          toneSoft[metric.tone],
        )}
      >
        <Icon className={cn("size-4", toneText[metric.tone])} />
      </span>
      <div className="min-w-0">
        <p className="text-label truncate font-semibold">
          {metric.value}
          {metric.unit ? <span className="text-helper inline"> {metric.unit}</span> : null}
        </p>
        <p className="text-helper leading-snug">{metric.label}</p>
      </div>
    </div>
  );
}

/** Monthly line chart with circular data points, matching the reference. */
export function MonthlyLineChart({
  title,
  data,
  color = "--primary",
  domain = [0, 8],
  ticks = [0, 2, 4, 6, 8],
}: {
  title: string;
  data: ChartPoint[];
  color?: string;
  domain?: [number, number];
  ticks?: number[];
}) {
  return (
    <div className="min-w-0">
      <p className="text-helper mb-1">{title}</p>
      <div className="h-[140px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={2}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              width={24}
              domain={domain}
              ticks={ticks}
              allowDecimals={false}
            />
            <Line
              type="linear"
              dataKey="value"
              stroke={`var(${color})`}
              strokeWidth={1.75}
              isAnimationActive={false}
              dot={{ r: 3, fill: `var(${color})`, stroke: "none" }}
              activeDot={{ r: 4 }}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
