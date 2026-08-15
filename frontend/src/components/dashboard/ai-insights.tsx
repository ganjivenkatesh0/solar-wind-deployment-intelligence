import { CardPanel } from "./card-panel";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { AiIcon } from "@/lib/icons";
import type { DashboardData } from "@/lib/dashboard-data";

const barColors = ["bg-primary", "bg-wind", "bg-solar", "bg-hybrid", "bg-error"];

export function AIInsights({
  data,
  onViewDetails,
}: {
  data: DashboardData["ai"];
  onViewDetails: () => void;
}) {
  return (
    <CardPanel
      title="AI Model Insights"
      action={
        <Button variant="outline" size="sm" onClick={onViewDetails}>
          View Details
        </Button>
      }
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-label">{data.metricLabel}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-2xl font-bold tracking-tight">
              {data.metricValue}
              <span className="text-muted-foreground ml-1 text-[11px] font-medium">{data.metricUnit}</span>
            </p>
            <StatusBadge tone="success">{data.badge}</StatusBadge>
          </div>
          <p className="text-helper mt-2">{data.description}</p>
        </div>
        <span className="bg-hybrid-soft text-hybrid grid size-12 shrink-0 place-items-center rounded-2xl">
          <AiIcon className="size-6" />
        </span>
      </div>

      <p className="text-label mt-4 mb-2">Top Contributing Factors</p>
      <ul className="space-y-2">
        {data.factors.map((factor, i) => (
          <li key={factor.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="grid min-w-0 grid-cols-[minmax(90px,0.9fr)_minmax(0,1.6fr)] items-center gap-3">
              <span className="text-helper truncate">{factor.label}</span>
              <span className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <span
                  className={`block h-full rounded-full ${barColors[i % barColors.length]}`}
                  style={{ width: `${Math.min(100, factor.weight * 2.4)}%` }}
                />
              </span>
            </div>
            <span className="text-helper shrink-0 font-semibold">{factor.weight.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </CardPanel>
  );
}
