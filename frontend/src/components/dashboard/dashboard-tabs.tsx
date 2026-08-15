import type { ReactNode } from "react";

import {
  AiIcon,
  EnergyIcon,
  FeasibilityIcon,
  MapIcon,
  PriorityIcon,
  ScoreIcon,
  SolarIcon,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

export const dashboardTabs = [
  { id: "overview", label: "Overview", icon: ScoreIcon },
  { id: "resources", label: "Resources", icon: SolarIcon },
  { id: "feasibility", label: "Feasibility", icon: FeasibilityIcon },
  { id: "energy", label: "Energy & Financial", icon: EnergyIcon },
  { id: "ai", label: "AI Insights", icon: AiIcon },
  { id: "recommendation", label: "Recommendation", icon: PriorityIcon },
  { id: "map", label: "Map", icon: MapIcon },
] as const;

export type DashboardTabId = (typeof dashboardTabs)[number]["id"];

export function DashboardTabs({
  value,
  onChange,
  children,
}: {
  value: DashboardTabId;
  onChange: (id: DashboardTabId) => void;
  children: ReactNode;
}) {
  return (
    <div className="surface-card min-w-0 overflow-hidden">
      <div className="border-b border-border">
        <div
          role="tablist"
          aria-label="Dashboard sections"
          className="flex min-w-0 gap-1 overflow-x-auto px-2"
        >
          {dashboardTabs.map((tab) => {
            const active = tab.id === value;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onChange(tab.id)}
                className={cn(
                  "focus-visible:ring-ring/60 -mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[13px] font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none",
                  active
                    ? "border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground border-transparent",
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="min-w-0 bg-muted/30 p-3 sm:p-4">{children}</div>
    </div>
  );
}
