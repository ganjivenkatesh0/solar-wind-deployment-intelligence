import type { ReactNode } from "react";

import {
  AiIcon,
  EnergyIcon,
  EnvironmentalIcon,
  FeasibilityIcon,
  MapIcon,
  ScoreIcon,
  SolarIcon,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

export const compareTabs = [
  { id: "overview", label: "Overview", icon: ScoreIcon },
  { id: "resources", label: "Resources", icon: SolarIcon },
  { id: "feasibility", label: "Technical Feasibility", icon: FeasibilityIcon },
  { id: "financial", label: "Energy & Financial", icon: EnergyIcon },
  { id: "ai", label: "AI Insights", icon: AiIcon },
  { id: "environmental", label: "Environmental", icon: EnvironmentalIcon },
  { id: "map", label: "Map View", icon: MapIcon },
] as const;

export type CompareTabId = (typeof compareTabs)[number]["id"];

export function ComparisonTabs({
  value,
  onChange,
  children,
}: {
  value: CompareTabId;
  onChange: (id: CompareTabId) => void;
  children: ReactNode;
}) {
  return (
    <div className="surface-card min-w-0 overflow-hidden">
      <div className="border-border border-b">
        <div
          role="tablist"
          aria-label="Site comparison sections"
          className="flex min-w-0 gap-1 overflow-x-auto px-2"
        >
          {compareTabs.map((tab) => {
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
      <div className="min-w-0">{children}</div>
    </div>
  );
}
