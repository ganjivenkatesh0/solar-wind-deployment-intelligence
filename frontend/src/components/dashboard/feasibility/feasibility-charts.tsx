import {
  Cell,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import type { FeasibilityData } from "@/lib/feasibility-data";

/** Radar / spider chart of the six feasibility dimensions. */
export function SuitabilityRadarChart({
  data,
  center,
}: {
  data: FeasibilityData["radar"];
  center: string;
}) {
  return (
    <div className="relative h-[260px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="66%" margin={{ top: 18, right: 28, bottom: 18, left: 28 }}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={({ payload, x, y, textAnchor }) => {
              const point = data.find((d) => d.dimension === payload.value);
              return (
                <g>
                  <text
                    x={x}
                    y={y}
                    textAnchor={textAnchor}
                    fill="var(--muted-foreground)"
                    fontSize={10}
                  >
                    {payload.value}
                  </text>
                  <text
                    x={x}
                    y={y + 12}
                    textAnchor={textAnchor}
                    fill="var(--foreground)"
                    fontSize={10}
                    fontWeight={600}
                  >
                    {point?.score}
                  </text>
                </g>
              );
            }}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Current Site Score"
            dataKey="score"
            stroke="var(--wind)"
            strokeWidth={1.75}
            fill="var(--wind)"
            fillOpacity={0.12}
            isAnimationActive={false}
            dot={{ r: 3, fill: "var(--wind)", stroke: "none" }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <span className="text-wind text-xl font-bold">{center}</span>
      </div>
    </div>
  );
}

/** Risk distribution donut with the overall risk score in the middle. */
export function RiskDonut({
  slices,
  overall,
  overallLabel,
}: {
  slices: FeasibilityData["risk"]["slices"];
  overall: string;
  overallLabel: string;
}) {
  return (
    <div className="relative h-[190px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={slices}
            dataKey="value"
            nameKey="label"
            innerRadius="62%"
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
          <p className="text-helper">Overall Risk</p>
          <p className="text-2xl font-bold tracking-tight">{overall}</p>
          <p className="text-success text-[11px] font-semibold">{overallLabel}</p>
        </div>
      </div>
    </div>
  );
}
