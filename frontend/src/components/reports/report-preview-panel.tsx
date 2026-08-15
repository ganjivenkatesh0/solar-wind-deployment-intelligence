import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { BrandMark } from "@/components/layout/brand-mark";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { DownloadIcon, EnergyIcon, LocationIcon, ScoreIcon, SolarIcon } from "@/lib/icons";
import { reportImages, type ReportRecord } from "@/lib/reports-data";
import { cn } from "@/lib/utils";

export function ReportPreviewPanel({ record }: { record: ReportRecord }) {
  const totalPages = Math.max(record.pageCount, 1);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [record.id]);

  return (
    <section className="surface-card min-w-0 p-4">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-card-title">Report Preview</h2>
        <Link
          to="/reports/$reportId"
          params={{ reportId: record.id }}
          className="text-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline"
        >
          View Full Report
          <ArrowRight className="size-3.5" />
        </Link>
      </header>

      <div
        className={cn(
          "mt-3 overflow-hidden rounded-xl border border-border bg-card",
          expanded && "ring-primary/40 ring-2",
        )}
      >
        <div className="p-4">
          <div className="flex items-center gap-2">
            <BrandMark className="size-7 shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold tracking-tight">Solar &amp; Wind</p>
              <p className="text-helper truncate text-[10px]">Deployment Intelligence</p>
            </div>
          </div>

          <h3 className="mt-3 text-[1.15rem] leading-7 font-bold tracking-tight">{record.subtitle}</h3>
          <div className="mt-2">
            <StatusBadge tone="success">{record.id}</StatusBadge>
          </div>

          <p className="text-label mt-3 flex items-start gap-1.5">
            <LocationIcon className="text-primary mt-0.5 size-4 shrink-0" />
            <span className="min-w-0">
              {record.location}, India
              <span className="text-helper block">{record.coordinatesLabel}</span>
            </span>
          </p>

          <img
            src={reportImages[record.technology]}
            alt={`${record.technology} project site imagery for ${record.location}`}
            loading="lazy"
            className={cn(
              "mt-3 w-full rounded-lg object-cover transition-[height]",
              expanded ? "h-[260px]" : "h-[150px]",
            )}
          />
        </div>

        <dl className="grid grid-cols-3 gap-2 border-t border-border px-4 py-3">
          <div className="min-w-0">
            <dt className="text-helper text-[10px]">Generated On</dt>
            <dd className="text-label font-semibold whitespace-nowrap">{record.dateLabel}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-helper text-[10px]">Project Capacity</dt>
            <dd className="text-label font-semibold whitespace-nowrap">{record.capacityLabel}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-helper text-[10px]">Report Type</dt>
            <dd className="text-label font-semibold whitespace-nowrap">{record.reportType}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-lg"
          aria-label="Previous preview page"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-label rounded-lg border border-border px-3 py-1.5 whitespace-nowrap">
          {page} <span className="text-helper">/ {totalPages}</span>
        </span>
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-lg"
          aria-label="Next preview page"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="ml-auto size-8 rounded-lg"
          aria-label={expanded ? "Collapse preview" : "Expand preview"}
          aria-pressed={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          <Maximize2 className="size-4" />
        </Button>
      </div>
    </section>
  );
}

export function ReportInsights({ record }: { record: ReportRecord }) {
  const cards = [
    {
      label: "Overall Suitability Score",
      value: record.score.toFixed(1),
      suffix: "/100",
      caption: record.scoreLabel,
      icon: ScoreIcon,
      tone: "bg-primary-soft text-primary",
      valueClass: "text-primary",
    },
    {
      label: "Recommended Technology",
      value: record.technology,
      caption: record.recommendedTechnologyDetail,
      icon: SolarIcon,
      tone: "bg-wind-soft text-wind",
    },
    {
      label: "Estimated Annual Generation",
      value: record.annualGenerationLabel,
      icon: EnergyIcon,
      tone: "bg-hybrid-soft text-hybrid",
    },
    {
      label: "Project Capacity",
      value: record.capacityLabel,
      icon: EnergyIcon,
      tone: "bg-solar-soft text-warning-foreground",
    },
  ];

  return (
    <section className="surface-card min-w-0 p-4">
      <h2 className="text-card-title">Report Insights</h2>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {cards.map((card) => (
          <div key={card.label} className="min-w-0 rounded-xl border border-border p-3">
            <div className="flex items-start gap-2">
              <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg", card.tone)}>
                <card.icon className="size-4" strokeWidth={1.75} />
              </span>
              <p className="text-helper leading-tight">{card.label}</p>
            </div>
            <p className={cn("mt-2 text-[1.1rem] leading-6 font-bold tracking-tight", card.valueClass)}>
              {card.value}
              {card.suffix ? <span className="text-helper ml-1 font-medium">{card.suffix}</span> : null}
            </p>
            {card.caption ? <p className="text-helper mt-0.5">{card.caption}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function ReportQuickActions({ totalReports }: { totalReports: number }) {
  return (
    <section className="surface-card min-w-0 p-4">
      <h2 className="text-card-title">Quick Actions</h2>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        <Button
          variant="outline"
          onClick={() => toast.success(`Export queued for ${totalReports} reports.`)}
        >
          <DownloadIcon className="size-4" />
          Export All Reports
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("Report scheduling will be available once reporting jobs are connected.")}
        >
          <CalendarClock className="size-4" />
          Schedule Reports
        </Button>
      </div>
    </section>
  );
}
