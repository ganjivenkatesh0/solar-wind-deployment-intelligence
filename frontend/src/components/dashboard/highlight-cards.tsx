import { ScoreRing } from "./score-ring";
import { StatusBadge } from "@/components/ui/status-badge";
import { FeasibilityIcon, PriorityIcon, SolarIcon, WindIcon } from "@/lib/icons";
import type { DashboardData } from "@/lib/dashboard-data";

export function SuitabilityCard({ data }: { data: DashboardData["suitability"] }) {
  return (
    <div className="surface-card border-primary/25 bg-primary-soft/40 flex min-w-0 flex-col gap-3 p-4 transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <p className="text-label text-primary-strong">Overall Suitability Score</p>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-3xl font-bold tracking-tight">
            {data.score}
            <span className="text-muted-foreground ml-1 text-sm font-medium">/{data.outOf}</span>
          </p>
          <StatusBadge tone="success" className="mt-2" icon={<PriorityIcon className="size-3.5" />}>
            {data.rating}
          </StatusBadge>
        </div>
        <ScoreRing value={data.score}>
          <span className="text-primary text-sm font-bold">{data.score}%</span>
        </ScoreRing>
      </div>
      <p className="text-helper">{data.note}</p>
    </div>
  );
}

export function TechnologyCard({ data }: { data: DashboardData["technology"] }) {
  return (
    <div className="surface-card border-solar/35 bg-solar-soft/60 flex min-w-0 flex-col gap-2 p-4 transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <p className="text-label text-warning-foreground">Recommended Technology</p>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-2xl font-bold tracking-tight">{data.name}</p>
          <p className="text-helper">{data.subtitle}</p>
        </div>
        <span className="bg-solar/20 text-solar grid size-14 shrink-0 place-items-center rounded-2xl">
          <SolarIcon className="size-7" />
        </span>
      </div>
      <div>
        <p className="text-warning text-xl font-bold">{data.capacityLabel}</p>
        <p className="text-helper">{data.capacityCaption}</p>
      </div>
    </div>
  );
}

export function FeasibilityCard({ data }: { data: DashboardData["feasibility"] }) {
  return (
    <div className="surface-card border-wind/35 bg-wind-soft/60 flex min-w-0 flex-col gap-2 p-4 transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <p className="text-label text-wind">Technical Feasibility</p>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-2xl font-bold tracking-tight">{data.verdict}</p>
          <p className="text-helper">{data.caption}</p>
        </div>
        <span className="bg-wind/15 text-wind grid size-14 shrink-0 place-items-center rounded-2xl">
          <FeasibilityIcon className="size-7" />
        </span>
      </div>
      <div>
        <p className="text-wind text-xl font-bold">
          {data.score}
          <span className="text-muted-foreground ml-1 text-sm font-medium">/{data.outOf}</span>
        </p>
        <p className="text-helper">Feasibility Score</p>
      </div>
    </div>
  );
}

export function EnergyGenerationCard({ data }: { data: DashboardData["energy"] }) {
  return (
    <div className="surface-card border-hybrid/30 bg-hybrid-soft/60 flex min-w-0 flex-col gap-3 p-4 transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <p className="text-label text-hybrid">Annual Energy Generation</p>
      <div>
        <p className="text-2xl font-bold tracking-tight">{data.totalLabel}</p>
        <p className="text-helper">{data.totalCaption}</p>
      </div>
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        <span className="bg-solar h-full" style={{ width: `${data.solarShare}%` }} />
        <span className="bg-wind h-full" style={{ width: `${data.windShare}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <SolarIcon className="text-solar size-4 shrink-0" />
          <div className="min-w-0">
            <p className="text-label truncate">{data.solarLabel}</p>
            <p className="text-helper">Solar</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <WindIcon className="text-wind size-4 shrink-0" />
          <div className="min-w-0">
            <p className="text-label truncate">{data.windLabel}</p>
            <p className="text-helper">Wind</p>
          </div>
        </div>
      </div>
    </div>
  );
}
