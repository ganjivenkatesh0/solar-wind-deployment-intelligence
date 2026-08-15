import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  DateIcon,
  DuplicateIcon,
  FeasibilityIcon,
  FinancialIcon,
  LandIcon,
  LocationIcon,
  ReportIcon,
  ScoreIcon,
  SolarIcon,
  ChevronRightIcon,
} from "@/lib/icons";
import type { AnalysisRecord } from "@/lib/analysis-history-data";
import { HybridIcon, WindIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { AnalysisStatusBadge } from "./history-primitives";

const techIcon = { Solar: SolarIcon, Wind: WindIcon, Hybrid: HybridIcon } as const;
const techColor = { Solar: "text-solar", Wind: "text-wind", Hybrid: "text-primary" } as const;

function DetailRow({
  icon,
  iconClass,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
      <span className="flex min-w-0 items-center gap-2">
        <span className={cn("shrink-0", iconClass)}>{icon}</span>
        <span className="text-helper truncate">{label}</span>
      </span>
      <span className="text-label text-right font-medium">{value}</span>
    </div>
  );
}

export function AnalysisDetailsPanel({
  record,
  onViewReport,
  onDuplicate,
}: {
  record: AnalysisRecord;
  onViewReport: () => void;
  onDuplicate: () => void;
}) {
  return (
    <section className="surface-card flex min-w-0 flex-col gap-4 p-4">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-card-title truncate">Analysis Details</h2>
        <button
          type="button"
          onClick={onViewReport}
          className="text-primary inline-flex shrink-0 items-center gap-1 text-xs font-semibold hover:underline"
        >
          View Full Report
          <ChevronRightIcon className="size-3.5" />
        </button>
      </header>

      <div className="flex items-center justify-between gap-3">
        <p className="text-section-title truncate">{record.id}</p>
        <AnalysisStatusBadge status={record.status} />
      </div>

      <div className="flex items-start gap-2">
        <LocationIcon className="text-primary mt-0.5 size-4 shrink-0" />
        <div className="min-w-0">
          <p className="text-label truncate font-semibold">{record.location}</p>
          <p className="text-wind truncate text-[11px]">{record.coordinatesLabel}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <DetailRow
          icon={<DateIcon className="size-4" />}
          iconClass="text-wind"
          label="Analysis Time"
          value={`${record.dateLabel} • ${record.timeLabel}`}
        />
        <DetailRow
          icon={<LandIcon className="size-4" />}
          iconClass="text-primary"
          label="Land Area"
          value={record.details.landAreaLabel}
        />
        <DetailRow
          icon={<FinancialIcon className="size-4" />}
          iconClass="text-primary"
          label="Budget"
          value={record.details.budgetLabel}
        />
        <DetailRow
          icon={<SolarIcon className="size-4" />}
          iconClass="text-solar"
          label="Project Type"
          value={record.details.projectType}
        />
        <DetailRow
          icon={<FeasibilityIcon className="size-4" />}
          iconClass="text-primary"
          label="Min. Feasibility Score"
          value={record.details.minFeasibilityLabel}
        />
        <DetailRow
          icon={<ScoreIcon className="size-4" />}
          iconClass="text-warning-foreground"
          label="Risk Tolerance"
          value={record.details.riskTolerance}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="gap-2" onClick={onViewReport}>
          <ReportIcon className="size-4" />
          View Report
        </Button>
        <Button variant="outline" className="gap-2" onClick={onDuplicate}>
          <DuplicateIcon className="size-4" />
          Duplicate
        </Button>
      </div>
    </section>
  );
}

export function PerformanceSnapshotPanel({ record }: { record: AnalysisRecord }) {
  const Icon = techIcon[record.technology];
  return (
    <section className="surface-card flex min-w-0 flex-col gap-1 p-4">
      <h2 className="text-card-title">Performance Snapshot</h2>
      <p className="text-helper">{record.id}</p>

      <div className="h-[260px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={record.radar} outerRadius="62%" margin={{ top: 22, right: 34, bottom: 22, left: 34 }}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={({ payload, x, y, textAnchor }) => {
                const point = record.radar.find((d) => d.dimension === payload.value);
                const words = String(payload.value).split(" ");
                const lines = words.length > 2 ? [words.slice(0, 2).join(" "), words.slice(2).join(" ")] : words;
                return (
                  <g>
                    {lines.map((line, i) => (
                      <text
                        key={line}
                        x={x}
                        y={y + i * 10}
                        textAnchor={textAnchor}
                        fill="var(--muted-foreground)"
                        fontSize={9}
                      >
                        {line}
                      </text>
                    ))}
                    <text
                      x={x}
                      y={y + lines.length * 10}
                      textAnchor={textAnchor}
                      fill="var(--foreground)"
                      fontSize={10}
                      fontWeight={700}
                    >
                      {point?.score}
                    </text>
                  </g>
                );
              }}
            />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Score"
              dataKey="score"
              stroke="var(--primary)"
              strokeWidth={1.75}
              fill="var(--primary)"
              fillOpacity={0.14}
              isAnimationActive={false}
              dot={{ r: 3, fill: "var(--primary)", stroke: "none" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-primary/20 bg-primary-soft/60 px-4 py-3">
        <div className="min-w-0">
          <p className="text-helper">Overall Suitability Score</p>
          <p className="text-primary text-2xl font-bold tracking-tight">
            {record.score.toFixed(1)}
            <span className="text-helper ml-1 align-middle font-medium">/100</span>
          </p>
        </div>
        <div className="min-w-0 text-right">
          <p className="text-helper">Recommended</p>
          <span className="mt-0.5 flex items-center justify-end gap-1.5">
            <Icon className={cn("size-4", techColor[record.technology])} />
            <span className="min-w-0">
              <span className="text-label block truncate font-semibold">{record.technology}</span>
              <span className={cn("block truncate text-[11px] font-semibold", techColor[record.technology])}>
                {record.capacityLabel}
              </span>
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
