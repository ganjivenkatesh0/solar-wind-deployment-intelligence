import { Target } from "lucide-react";

import { FeasibilityIcon, PriorityIcon, TrendIcon } from "@/lib/icons";
import type { DashboardData } from "@/lib/dashboard-data";

export function DeploymentRecommendation({ data }: { data: DashboardData["recommendation"] }) {
  return (
    <section className="surface-card border-primary/25 bg-primary-soft/50 flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className="bg-primary/15 text-primary grid size-10 shrink-0 place-items-center rounded-full">
          <Target className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-section-title">{data.title}</h2>
          <p className="text-page-subtitle mt-0.5">{data.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:shrink-0">
        <div className="flex items-center gap-2">
          <FeasibilityIcon className="text-primary size-4 shrink-0" />
          <div className="min-w-0">
            <p className="text-helper">Confidence Level</p>
            <p className="text-label truncate">{data.confidence}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PriorityIcon className="text-solar size-4 shrink-0" />
          <div className="min-w-0">
            <p className="text-helper">Priority Level</p>
            <p className="text-label truncate">{data.priority}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendIcon className="text-wind size-4 shrink-0" />
          <div className="min-w-0">
            <p className="text-helper">Expansion Status</p>
            <p className="text-label truncate">{data.expansion}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
