import { ArrowRight, CircleCheck, Download, FileText, Info, Medal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScoreRing } from "../score-ring";
import { RiskDonut, SuitabilityRadarChart } from "./feasibility-charts";
import {
  breakdownIcons,
  constraintIcons,
  FeasibilityPanel,
  kpiIcons,
  toneSoft,
  toneText,
} from "./feasibility-primitives";
import { feasibilityData, type FeasibilityData } from "@/lib/feasibility-data";
import { cn } from "@/lib/utils";

const badgeTone = {
  success: "success",
  wind: "wind",
  warning: "warning",
  hybrid: "hybrid",
  info: "info",
} as const;

const riskLevelTone = { Low: "text-success", Medium: "text-warning-foreground", High: "text-error" };

export function FeasibilityTab({
  data = feasibilityData,
  onExport,
  onDownload,
  onViewRecommendations,
}: {
  data?: FeasibilityData;
  onExport: () => void;
  onDownload: () => void;
  onViewRecommendations: () => void;
}) {
  return (
    <div className="min-w-0 space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-card-title text-xl">{data.header.title}</h2>
          <p className="text-helper">{data.header.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={onExport}>
            <FileText className="size-4" />
            Export Feasibility Report
          </Button>
          <Button size="sm" className="gap-2" onClick={onDownload}>
            <Download className="size-4" />
            Download Full Report
          </Button>
        </div>
      </header>

      {/* KPI cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
        <div className="surface-card border-wind/25 bg-wind-soft/40 flex min-w-0 flex-col gap-2 p-4">
          <p className="text-label text-wind">{data.overall.label}</p>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-3xl font-bold tracking-tight">
                {data.overall.score}
                <span className="text-muted-foreground ml-1 text-sm font-medium">
                  /{data.overall.outOf}
                </span>
              </p>
              <StatusBadge tone="solar" className="mt-2">
                {data.overall.badge}
              </StatusBadge>
            </div>
            <ScoreRing value={data.overall.score} className="[&_.stroke-primary]:stroke-wind">
              <span className="text-wind text-sm font-bold">{data.overall.score}%</span>
            </ScoreRing>
          </div>
          <p className="text-helper">{data.overall.note}</p>
        </div>

        {data.kpis.map((kpi) => {
          const Icon = kpiIcons[kpi.icon];
          return (
            <div key={kpi.label} className="surface-card flex min-w-0 flex-col gap-2 p-4">
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-xl border",
                    toneSoft[kpi.tone],
                  )}
                >
                  <Icon className={cn("size-4", toneText[kpi.tone])} />
                </span>
                <p className={cn("text-label min-w-0", toneText[kpi.tone])}>{kpi.label}</p>
              </div>
              <p className="text-2xl font-bold tracking-tight">
                {kpi.value}
                <span className="text-muted-foreground ml-1 text-sm font-medium">{kpi.outOf}</span>
              </p>
              <StatusBadge tone={badgeTone[kpi.tone]} className="self-start">
                {kpi.badge}
              </StatusBadge>
            </div>
          );
        })}
      </div>

      {/* Row 1 */}
      <div className="grid gap-4 xl:grid-cols-3">
        <FeasibilityPanel
          title="Feasibility Score Breakdown"
          subtitle="Detailed assessment across key feasibility factors"
        >
          <ul className="space-y-3">
            {data.breakdown.map((row) => {
              const Icon = breakdownIcons[row.icon];
              return (
                <li key={row.label} className="flex items-center gap-2">
                  <Icon className="text-success size-4 shrink-0" />
                  <span className="text-label w-[40%] min-w-0 leading-snug font-normal">
                    {row.label}
                  </span>
                  <span className="bg-muted h-2 min-w-0 flex-1 overflow-hidden rounded-full">
                    <span
                      className="bg-wind block h-full rounded-full"
                      style={{ width: `${row.score}%` }}
                    />
                  </span>
                  <span className="text-label shrink-0 font-semibold">
                    {row.score}
                    <span className="text-helper inline"> /100</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="border-info/25 bg-info-soft/50 text-helper mt-4 flex items-start gap-2 rounded-xl border p-3">
            <Info className="text-info size-4 shrink-0" />
            <span>{data.breakdownNote}</span>
          </div>
        </FeasibilityPanel>

        <FeasibilityPanel
          title="Suitability Radar"
          subtitle="Visual representation of feasibility dimensions"
        >
          <SuitabilityRadarChart data={data.radar} center={data.radarCenter} />
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="bg-wind h-2 w-4 rounded-full" />
            <span className="text-helper">Current Site Score</span>
          </div>
        </FeasibilityPanel>

        <FeasibilityPanel
          title="Site Constraints Analysis"
          subtitle="Potential constraints and limitations"
        >
          <ul className="divide-border divide-y">
            {data.constraints.map((row) => {
              const Icon = constraintIcons[row.icon];
              return (
                <li key={row.label} className="flex items-center gap-3 py-2.5">
                  <Icon className="text-info size-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-label leading-snug">{row.label}</p>
                    <p className="text-helper leading-snug">{row.description}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-[11px] font-semibold",
                      toneText[row.statusTone === "info" ? "info" : "success"],
                    )}
                  >
                    {row.status}
                  </span>
                  <div className="w-24 shrink-0 text-right">
                    <p className="text-label font-semibold">{row.distance}</p>
                    <p className="text-helper">{row.distanceCaption}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </FeasibilityPanel>
      </div>

      {/* Row 2 */}
      <div className="grid gap-4 xl:grid-cols-3">
        <FeasibilityPanel title="Risk Assessment Matrix" subtitle="Comprehensive risk evaluation">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="min-w-0 space-y-3">
              <RiskDonut
                slices={data.risk.slices}
                overall={data.risk.overall}
                overallLabel={data.risk.overallLabel}
              />
              <ul className="space-y-2">
                {data.risk.slices.map((slice) => (
                  <li key={slice.label} className="flex items-center gap-2">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="text-helper min-w-0 flex-1 leading-snug">{slice.label}</span>
                    <span className="text-label shrink-0 font-semibold">{slice.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-border min-w-0 rounded-xl border p-4">
              <p className="text-label mb-3 font-semibold">Top Risk Factors</p>
              <ul className="divide-border divide-y">
                {data.risk.factors.map((factor) => (
                  <li key={factor.label} className="flex items-center gap-2 py-2.5">
                    <span className="text-helper min-w-0 flex-1 leading-snug">{factor.label}</span>
                    <span
                      className={cn(
                        "shrink-0 text-[11px] font-semibold",
                        riskLevelTone[factor.level],
                      )}
                    >
                      {factor.level}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-border mt-3 flex items-center justify-between border-t pt-3">
                <span className="text-label font-semibold">Total</span>
                <span className="text-label font-semibold">100%</span>
              </div>
            </div>
          </div>
        </FeasibilityPanel>

        <FeasibilityPanel title="Feasibility Summary" subtitle="Key takeaways and recommendations">
          <div className="border-wind/25 bg-wind-soft/40 flex items-start gap-3 rounded-xl border p-4">
            <span className="bg-wind/15 text-wind grid size-11 shrink-0 place-items-center rounded-xl">
              <Medal className="size-6" />
            </span>
            <div className="min-w-0">
              <p className="text-wind text-sm font-semibold">{data.summary.title}</p>
              <p className="text-helper mt-1 leading-snug">{data.summary.description}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {data.summary.metrics.map((metric) => (
              <div
                key={metric.label}
                className={cn("min-w-0 rounded-xl border p-3 text-center", toneSoft[metric.tone])}
              >
                <p className={cn("text-helper leading-snug", toneText[metric.tone])}>
                  {metric.label}
                </p>
                <p className="text-label mt-1 font-bold">{metric.value}</p>
              </div>
            ))}
          </div>
        </FeasibilityPanel>

        <FeasibilityPanel title="Recommendations" subtitle="Actionable recommendations for the site">
          <ul className="divide-border divide-y">
            {data.recommendations.map((item) => (
              <li key={item} className="flex items-start gap-3 py-2.5">
                <CircleCheck className="text-success mt-0.5 size-4 shrink-0" />
                <span className="text-label min-w-0 leading-snug font-normal">{item}</span>
              </li>
            ))}
          </ul>
          <Button
            variant="outline"
            size="sm"
            className="text-wind border-wind/30 mt-4 w-full gap-2"
            onClick={onViewRecommendations}
          >
            View Detailed Recommendations
            <ArrowRight className="size-4" />
          </Button>
        </FeasibilityPanel>
      </div>
    </div>
  );
}
