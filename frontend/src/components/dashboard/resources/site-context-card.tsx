import { Button } from "@/components/ui/button";
import { IconMetricTile } from "./resource-primitives";
import type { IconMetric } from "@/lib/resources-data";

/** Horizontal card used for Land & Terrain and Infrastructure Proximity. */
export function SiteContextCard({
  title,
  description,
  actionLabel,
  onAction,
  metrics,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  metrics: IconMetric[];
}) {
  return (
    <section className="surface-card flex min-w-0 flex-col gap-3 p-3 sm:p-4">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-card-title truncate">{title}</h3>
          <p className="text-helper">{description}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      </header>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <IconMetricTile key={metric.label} metric={metric} />
        ))}
      </div>
    </section>
  );
}
