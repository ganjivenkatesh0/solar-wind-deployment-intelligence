import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { CardPanel } from "./card-panel";
import { SolarIcon, WindIcon } from "@/lib/icons";
import type { DashboardData } from "@/lib/dashboard-data";

export function EnergyAnalysis({ data }: { data: DashboardData["energy"] }) {
  const chartData = [
    { name: "Solar", value: data.solar },
    { name: "Wind", value: data.wind },
  ];

  return (
    <CardPanel title="Energy Analysis">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative h-[150px] w-[150px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={48}
                outerRadius={72}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                paddingAngle={0}
              >
                <Cell fill="var(--solar)" />
                <Cell fill="var(--wind)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <span>
              <span className="block text-lg font-bold tracking-tight">{data.total}</span>
              <span className="text-helper block">MWh</span>
              <span className="text-helper block">Total</span>
            </span>
          </div>
        </div>

        <ul className="min-w-0 flex-1 space-y-3">
          <li>
            <div className="flex items-center gap-2">
              <span className="bg-solar size-2.5 rounded-full" />
              <p className="text-label">Solar Energy</p>
            </div>
            <p className="text-helper ml-4.5">
              {data.solarLabel} ({data.solarShare}%)
            </p>
          </li>
          <li>
            <div className="flex items-center gap-2">
              <span className="bg-wind size-2.5 rounded-full" />
              <p className="text-label">Wind Energy</p>
            </div>
            <p className="text-helper ml-4.5">
              {data.windLabel} ({data.windShare}%)
            </p>
          </li>
        </ul>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5">
          <SolarIcon className="text-solar size-4 shrink-0" />
          <div className="min-w-0">
            <p className="text-helper truncate">Solar Capacity Factor</p>
            <p className="text-label">{data.solarCapacityFactor}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5">
          <WindIcon className="text-wind size-4 shrink-0" />
          <div className="min-w-0">
            <p className="text-helper truncate">Wind Capacity Factor</p>
            <p className="text-label">{data.windCapacityFactor}</p>
          </div>
        </div>
      </div>
    </CardPanel>
  );
}
