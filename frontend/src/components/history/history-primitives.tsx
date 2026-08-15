import { BarChart3, CircleCheckBig, FileClock, Star } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { AlertIcon, CheckIcon, HybridIcon, SolarIcon, WindIcon } from "@/lib/icons";
import {
  scoreTone,
  type AnalysisHistorySummary,
  type AnalysisRecord,
  type AnalysisStatus,
  type AnalysisTechnology,
} from "@/lib/analysis-history-data";
import { cn } from "@/lib/utils";

const summaryIcons = {
  history: FileClock,
  check: CircleCheckBig,
  star: Star,
  chart: BarChart3,
} as const;

const summaryTone: Record<AnalysisHistorySummary["tone"], string> = {
  primary: "bg-primary-soft text-primary",
  info: "bg-info-soft text-info",
  solar: "bg-solar-soft text-warning-foreground",
  hybrid: "bg-hybrid-soft text-hybrid",
};

/** One of the four summary cards above the history table. */
export function HistorySummaryCard({ card }: { card: AnalysisHistorySummary }) {
  const Icon = summaryIcons[card.icon];
  return (
    <div className="surface-card flex min-w-0 items-center gap-2.5 px-3.5 py-3.5 transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", summaryTone[card.tone])}>
        <Icon className="size-4.5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="text-helper leading-tight break-words whitespace-normal">{card.label}</p>
        <p className="truncate text-[1.375rem] leading-7 font-bold tracking-tight">
          {card.value}
          {card.suffix ? (
            <span className="text-helper ml-1 align-middle font-medium">{card.suffix}</span>
          ) : null}
        </p>
        <p className="text-helper leading-tight break-words whitespace-normal">{card.caption}</p>
      </div>
    </div>
  );
}

const dialTone = {
  success: "var(--success)",
  warning: "var(--warning)",
  error: "var(--error)",
} as const;

/** Compact circular suitability indicator used in table rows. */
export function ScoreDial({ score, size = 40 }: { score: number; size?: number }) {
  const thickness = 3.5;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, score / 100));
  const color = dialTone[scoreTone(score)];

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={thickness} stroke="var(--border)" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[11px] font-bold" style={{ color }}>
        {score.toFixed(1)}
      </span>
    </div>
  );
}

const techIcon = {
  Solar: SolarIcon,
  Wind: WindIcon,
  Hybrid: HybridIcon,
} as const;

const techColor: Record<AnalysisTechnology, string> = {
  Solar: "text-solar",
  Wind: "text-wind",
  Hybrid: "text-primary",
};

/** Recommended technology + capacity cell. */
export function TechnologyCell({
  technology,
  capacityLabel,
}: {
  technology: AnalysisTechnology;
  capacityLabel: string;
}) {
  const Icon = techIcon[technology];
  return (
    <div className="flex items-center gap-2">
      <Icon className={cn("size-4 shrink-0", techColor[technology])} strokeWidth={2} />
      <div className="min-w-0">
        <p className="text-label whitespace-nowrap">{technology}</p>
        <p className={cn("text-[11px] font-semibold whitespace-nowrap", techColor[technology])}>{capacityLabel}</p>
      </div>
    </div>
  );
}

/** Status badge with the matching icon for each analysis state. */
export function AnalysisStatusBadge({ status }: { status: AnalysisStatus }) {
  if (status === "Failed") {
    return (
      <StatusBadge tone="error" icon={<AlertIcon className="size-3.5" />}>
        Failed
      </StatusBadge>
    );
  }
  if (status === "Running") {
    return <StatusBadge tone="info">Running</StatusBadge>;
  }
  return (
    <StatusBadge tone="success" icon={<CheckIcon className="size-3.5" />}>
      Completed
    </StatusBadge>
  );
}

export function matchesQuery(record: AnalysisRecord, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [record.id, record.location, record.coordinatesLabel, record.notes ?? ""].some((field) =>
    field.toLowerCase().includes(q),
  );
}
