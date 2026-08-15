import type { ReactNode } from "react";
import {
  Droplet,
  Route,
  Zap,
  Trees,
  Mountain,
  Layers,
  Network,
  LandPlot,
  Sprout,
  Scale,
  ShieldCheck,
  Flag,
  TriangleAlert,
  Settings2,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type PanelTone = "success" | "wind" | "warning" | "hybrid" | "info";

export const kpiIcons = {
  feasibility: ShieldCheck,
  readiness: Flag,
  risk: TriangleAlert,
  complexity: Settings2,
} as const;

export const breakdownIcons = {
  terrain: Mountain,
  infrastructure: Network,
  land: LandPlot,
  grid: Layers,
  environmental: Sprout,
  regulatory: Scale,
} as const;

export const constraintIcons = {
  water: Droplet,
  road: Route,
  grid: Zap,
  protected: Trees,
  slope: Mountain,
} as const;

export const toneText: Record<PanelTone, string> = {
  success: "text-success",
  wind: "text-wind",
  warning: "text-warning-foreground",
  hybrid: "text-hybrid",
  info: "text-info",
};

export const toneSoft: Record<PanelTone, string> = {
  success: "border-success/25 bg-success-soft/60",
  wind: "border-wind/25 bg-wind-soft/60",
  warning: "border-warning/30 bg-warning-soft/60",
  hybrid: "border-hybrid/25 bg-hybrid-soft/60",
  info: "border-info/25 bg-info-soft/60",
};

/** Card with a title + subtitle header, matching the Feasibility reference. */
export function FeasibilityPanel({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "surface-card flex min-w-0 flex-col transition-shadow hover:shadow-[var(--shadow-elevated)]",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0">
          <h3 className="text-card-title truncate">{title}</h3>
          {subtitle ? <p className="text-helper">{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className="min-w-0 flex-1 px-4 pb-4">{children}</div>
    </section>
  );
}
