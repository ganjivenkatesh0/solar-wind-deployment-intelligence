import {
  ArrowRight,
  BadgeCheck,
  CircleCheck,
  ClipboardList,
  DollarSign,
  Download,
  FileText,
  Gauge,
  Hammer,
  PackageSearch,
  ShieldCheck,
  Sun,
  Trophy,
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { FeasibilityPanel } from "../feasibility/feasibility-primitives";
import { PriorityIcon, TrendIcon } from "@/lib/icons";
import { recommendationData, type RecommendationData } from "@/lib/recommendation-data";
import { cn } from "@/lib/utils";
import solarImage from "@/assets/rec-solar.jpg";
import windImage from "@/assets/rec-wind.jpg";
import hybridImage from "@/assets/rec-hybrid.jpg";

const statIcon = {
  capacity: Sun,
  performance: BadgeCheck,
  lcoe: DollarSign,
  availability: ShieldCheck,
} as const;

const statTone = {
  capacity: { text: "text-solar", card: "border-solar/30 bg-solar-soft/40" },
  performance: { text: "text-success", card: "border-success/25 bg-success-soft/40" },
  lcoe: { text: "text-info", card: "border-info/25 bg-info-soft/40" },
  availability: { text: "text-hybrid", card: "border-hybrid/25 bg-hybrid-soft/40" },
} as const;

const roadmapIcon = {
  engineering: ClipboardList,
  procurement: PackageSearch,
  construction: Hammer,
  commissioning: CircleCheck,
} as const;

const roadmapTone = {
  engineering: { text: "text-info", card: "bg-info-soft" },
  procurement: { text: "text-solar", card: "bg-solar-soft" },
  construction: { text: "text-warning-foreground", card: "bg-warning-soft" },
  commissioning: { text: "text-success", card: "bg-success-soft" },
} as const;

const riskTone = {
  Low: "text-success",
  Medium: "text-warning-foreground",
  High: "text-error",
} as const;

const altImage = { wind: windImage, hybrid: hybridImage } as const;

const overallIcon = {
  success: TrendIcon,
  priority: PriorityIcon,
  readiness: CircleCheck,
} as const;

const overallTone = {
  success: "text-success",
  priority: "text-solar",
  readiness: "text-success",
} as const;

/** Compact score ring used by the alternative recommendation rows. */
function MiniScoreRing({
  value,
  max,
  tone,
}: {
  value: number;
  max: number;
  tone: "primary" | "hybrid";
}) {
  const size = 66;
  const thickness = 6;
  const radius = (size - thickness) / 2;
  const c = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value / max));
  const stroke = tone === "hybrid" ? "var(--hybrid)" : "var(--primary)";
  const track = tone === "hybrid" ? "var(--hybrid-soft)" : "var(--primary-soft)";

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          stroke={track}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          stroke={stroke}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center leading-tight">
        <div>
          <p className={cn("text-sm font-bold", tone === "hybrid" ? "text-hybrid" : "text-primary")}>
            {value}
          </p>
          <p className="text-muted-foreground text-[9px]">/{max}</p>
        </div>
      </div>
    </div>
  );
}

export function RecommendationTab({
  data = recommendationData,
  onExport,
  onDownload,
  onCompareOptions,
  onViewRiskAnalysis,
  onProceed,
}: {
  data?: RecommendationData;
  onExport: () => void;
  onDownload: () => void;
  onCompareOptions: () => void;
  onViewRiskAnalysis: () => void;
  onProceed: () => void;
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
            Export Recommendation Report
          </Button>
          <Button size="sm" className="gap-2" onClick={onDownload}>
            <Download className="size-4" />
            Download Full Report
          </Button>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.15fr]">
        {/* Primary recommendation */}
        <FeasibilityPanel
          title="Primary Recommendation"
          action={<PriorityIcon className="text-solar size-4" />}
        >
          <div className="border-border bg-card/60 rounded-2xl border p-3">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Sun className="text-solar size-5 shrink-0" />
                  <h4 className="text-lg font-bold tracking-tight">{data.primary.name}</h4>
                  <StatusBadge tone="success">{data.primary.badge}</StatusBadge>
                </div>
                <p className="text-helper mt-1 leading-snug">{data.primary.description}</p>

                <ul className="mt-3 space-y-2">
                  {data.primary.metrics.map((m) => (
                    <li
                      key={m.label}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3"
                    >
                      <span className="text-helper flex min-w-0 items-start gap-2 leading-snug">
                        <CircleCheck className="text-primary mt-0.5 size-3.5 shrink-0" />
                        {m.label}
                      </span>
                      <span className="text-label shrink-0 font-semibold">{m.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <img
                src={solarImage}
                alt="Solar photovoltaic panel farm at sunset"
                loading="lazy"
                width={960}
                height={640}
                className="h-full max-h-[180px] min-h-[140px] w-full rounded-xl object-cover"
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {data.primary.stats.map((s) => {
              const Icon = statIcon[s.id];
              const tone = statTone[s.id];
              return (
                <div key={s.id} className={cn("min-w-0 rounded-xl border p-3", tone.card)}>
                  <Icon className={cn("size-4", tone.text)} />
                  <p className="text-helper mt-1 leading-snug">{s.label}</p>
                  <p className="text-sm font-bold tracking-tight">
                    {s.value}
                    {s.unit ? (
                      <span className="text-muted-foreground ml-1 text-[11px] font-medium">
                        {s.unit}
                      </span>
                    ) : null}
                  </p>
                </div>
              );
            })}
          </div>
        </FeasibilityPanel>

        {/* Alternatives */}
        <FeasibilityPanel
          title="Alternative Recommendations"
          action={<TrendIcon className="text-success size-4" />}
        >
          <div className="space-y-4">
            {data.alternatives.map((alt) => (
              <div key={alt.id} className="border-border bg-card/60 rounded-2xl border p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-start">
                  <img
                    src={altImage[alt.id]}
                    alt={alt.name}
                    loading="lazy"
                    width={768}
                    height={512}
                    className="h-[76px] w-[96px] shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-label text-[15px] font-bold">{alt.name}</h4>
                      <StatusBadge tone={alt.badgeTone}>{alt.badge}</StatusBadge>
                    </div>
                    <p className="text-helper mt-0.5 leading-snug">{alt.description}</p>
                    <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                      {alt.metrics.map((m) => (
                        <div key={m.label} className="flex min-w-0 flex-col gap-0.5 overflow-hidden">
                          <dt className="text-helper leading-snug">{m.label}</dt>
                          <dd className="text-label font-semibold">{m.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div className="flex shrink-0 flex-col items-center justify-center gap-1 sm:self-center">
                    <MiniScoreRing
                      value={alt.score}
                      max={alt.scoreOutOf}
                      tone={alt.id === "hybrid" ? "hybrid" : "primary"}
                    />
                    <p className="text-helper text-center">Suitability Score</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-center">
            <Button variant="ghost" size="sm" className="text-primary gap-2" onClick={onCompareOptions}>
              Compare All Options
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </FeasibilityPanel>
      </div>

      {/* Advantages / roadmap / risks */}
      <div className="grid gap-4 xl:grid-cols-3">
        <FeasibilityPanel title="Key Advantages">
          <div className="flex items-center gap-3">
            <ul className="min-w-0 flex-1 space-y-2">
              {data.advantages.map((item) => (
                <li key={item} className="text-helper flex items-start gap-2 leading-snug">
                  <CircleCheck className="text-primary mt-0.5 size-4 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <span className="bg-success-soft text-primary hidden size-24 shrink-0 place-items-center rounded-full sm:grid">
              <Trophy className="size-10" />
            </span>
          </div>
        </FeasibilityPanel>

        <FeasibilityPanel title="Implementation Roadmap">
          <ol className="relative space-y-4">
            {data.roadmap.map((phase, i) => {
              const Icon = roadmapIcon[phase.id];
              const tone = roadmapTone[phase.id];
              const last = i === data.roadmap.length - 1;
              return (
                <li key={phase.id} className="relative flex min-w-0 gap-3">
                  {!last ? (
                    <span className="bg-border absolute top-9 left-[15px] h-[calc(100%-1rem)] w-px" />
                  ) : null}
                  <span
                    className={cn(
                      "relative grid size-8 shrink-0 place-items-center rounded-lg",
                      tone.card,
                      tone.text,
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-label font-semibold">{phase.period}</p>
                    <p className="text-helper leading-snug">{phase.label}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </FeasibilityPanel>

        <FeasibilityPanel title="Risk & Mitigation">
          <ul className="divide-border divide-y">
            {data.risks.map((risk) => (
              <li
                key={risk.factor}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 py-2 first:pt-0 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.2fr)] sm:gap-3"
              >
                <span className="text-helper flex min-w-0 items-start gap-2 leading-snug">
                  <TriangleAlert
                    className={cn("mt-0.5 size-3.5 shrink-0", riskTone[risk.level])}
                  />
                  {risk.factor}
                </span>
                <span className={cn("text-xs font-semibold", riskTone[risk.level])}>
                  {risk.level}
                </span>
                <span className="text-helper col-span-2 leading-snug sm:col-span-1">
                  {risk.mitigation}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary gap-2"
              onClick={onViewRiskAnalysis}
            >
              View Detailed Risk Analysis
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </FeasibilityPanel>
      </div>

      {/* Overall recommendation bar */}
      <section className="surface-card border-primary/25 bg-primary-soft/50 flex flex-col gap-4 p-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="bg-primary/15 text-primary grid size-10 shrink-0 place-items-center rounded-full">
            <Gauge className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-section-title">{data.overall.title}</h3>
            <p className="text-page-subtitle mt-0.5">{data.overall.summary}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-4 sm:grid-cols-3 sm:flex-1">
          {data.overall.indicators.map((ind) => {
            const Icon = overallIcon[ind.id];
            return (
              <div key={ind.id} className="flex items-center gap-2">
                <Icon className={cn("size-4 shrink-0", overallTone[ind.id])} />
                <div className="min-w-0">
                  <p className="text-helper leading-snug">{ind.label}</p>
                  <p className="text-label font-semibold">{ind.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <Button className="gap-2 whitespace-nowrap sm:shrink-0" onClick={onProceed}>
          {data.overall.cta}
          <ArrowRight className="size-4" />
        </Button>
        </div>
      </section>
    </div>
  );
}
