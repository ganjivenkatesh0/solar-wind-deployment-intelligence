import type { ComponentType } from "react";

import { IconMetricTile, MonthlyLineChart, ResourceMetric } from "./resource-primitives";
import type { ResourcesData } from "@/lib/resources-data";
import { cn } from "@/lib/utils";

/** Solar / Wind resource assessment card: metrics, monthly chart, secondary metrics. */
export function ResourceAssessmentCard({
  title,
  icon: Icon,
  iconClass,
  data,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  iconClass: string;
  data: ResourcesData["solar"];
}) {
  return (
    <section className="surface-card flex min-w-0 flex-col gap-3 p-3 sm:p-4">
      <header className="flex items-center gap-2">
        <Icon className={cn("size-4 shrink-0", iconClass)} />
        <h3 className="text-card-title truncate">{title}</h3>
      </header>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <ResourceMetric key={metric.label} metric={metric} />
        ))}
      </div>

      <MonthlyLineChart title={data.chartTitle} data={data.chart} />

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {data.environment.map((metric) => (
          <IconMetricTile key={metric.label} metric={metric} />
        ))}
      </div>
    </section>
  );
}
