import { CircleCheckBig, Download, FileText, LoaderCircle } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { AlertIcon, CheckIcon, HybridIcon, SolarIcon, WindIcon } from "@/lib/icons";
import type {
  ReportRecord,
  ReportSummaryCard,
  ReportTechnology,
} from "@/lib/reports-data";
import { cn } from "@/lib/utils";

const summaryIcons = {
  report: FileText,
  check: CircleCheckBig,
  progress: LoaderCircle,
  download: Download,
} as const;

const summaryTone: Record<ReportSummaryCard["tone"], string> = {
  primary: "bg-primary-soft text-primary",
  info: "bg-info-soft text-info",
  hybrid: "bg-hybrid-soft text-hybrid",
  solar: "bg-solar-soft text-warning-foreground",
};

/** One of the four summary cards above the reports list. */
export function ReportSummaryTile({ card }: { card: ReportSummaryCard }) {
  const Icon = summaryIcons[card.icon];
  return (
    <div className="surface-card flex min-w-0 items-center gap-3 px-4 py-4 transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", summaryTone[card.tone])}>
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="text-helper leading-tight break-words whitespace-normal">{card.label}</p>
        <p className="text-[1.5rem] leading-8 font-bold tracking-tight">{card.value}</p>
        <p className="text-helper leading-tight break-words whitespace-normal">{card.caption}</p>
      </div>
    </div>
  );
}

const techIcon = {
  Solar: SolarIcon,
  Wind: WindIcon,
  Hybrid: HybridIcon,
} as const;

export const techColor: Record<ReportTechnology, string> = {
  Solar: "text-solar",
  Wind: "text-wind",
  Hybrid: "text-primary",
};

/** Analysis type + capacity cell. */
export function AnalysisTypeCell({ record }: { record: ReportRecord }) {
  const Icon = techIcon[record.technology];
  return (
    <div className="flex items-center gap-2">
      <Icon className={cn("size-4 shrink-0", techColor[record.technology])} strokeWidth={2} />
      <div className="min-w-0">
        <p className="text-label whitespace-nowrap">{record.technology}</p>
        <p className="text-helper whitespace-nowrap">{record.capacityLabel}</p>
      </div>
    </div>
  );
}

/** Status badge / progress indicator for a report row. */
export function ReportStatusCell({ record }: { record: ReportRecord }) {
  if (record.status === "Failed") {
    return (
      <StatusBadge tone="error" icon={<AlertIcon className="size-3.5" />}>
        Failed
      </StatusBadge>
    );
  }
  if (record.status === "In Progress") {
    const pct = record.progress ?? 0;
    return (
      <div className="min-w-[92px]">
        <p className="text-info text-[11px] font-semibold whitespace-nowrap">In Progress</p>
        <div className="mt-1 flex items-center gap-1.5">
          <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
            <div className="bg-info h-full rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-helper shrink-0">{pct}%</span>
        </div>
      </div>
    );
  }
  return (
    <StatusBadge tone="success" icon={<CheckIcon className="size-3.5" />}>
      Completed
    </StatusBadge>
  );
}
