import {
  ArrowRight,
  BrainCircuit,
  CircleCheck,
  CloudSun,
  Download,
  DollarSign,
  FileText,
  Info,
  Layers,
  Leaf,
  Mountain,
  Sparkles,
  Sun,
  TrendingDown,
  TrendingUp,
  Wind,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { FeasibilityPanel } from "../feasibility/feasibility-primitives";
import { aiInsightsData, type AiInsightsData } from "@/lib/ai-insights-data";
import { cn } from "@/lib/utils";

const accuracyIcon = {
  solar: Sun,
  wind: Wind,
  energy: Zap,
  financial: DollarSign,
} as const;

const accuracyTone = {
  solar: "text-solar",
  wind: "text-wind",
  energy: "text-warning-foreground",
  financial: "text-success",
} as const;

const uncertaintyIcon = {
  solar: Sun,
  wind: Wind,
  financial: DollarSign,
} as const;

const uncertaintyTone = {
  solar: { text: "text-warning-foreground", card: "border-solar/30 bg-solar-soft/40" },
  wind: { text: "text-wind", card: "border-wind/25 bg-wind-soft/40" },
  financial: { text: "text-success", card: "border-success/25 bg-success-soft/40" },
} as const;

const anomalyIcon = {
  terrain: Mountain,
  weather: CloudSun,
  infrastructure: Layers,
  environmental: Leaf,
} as const;

/** Purple ring used for the overall model accuracy visual. */
function AccuracyRing({ value }: { value: number }) {
  const size = 108;
  const thickness = 10;
  const radius = (size - thickness) / 2;
  const c = 2 * Math.PI * radius;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          stroke="var(--hybrid-soft)"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          stroke="var(--hybrid)"
          strokeDasharray={`${(c * value) / 100} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center leading-tight">
        <div>
          <p className="text-hybrid text-xl font-bold tracking-tight">{value}%</p>
          <p className="text-helper mx-auto max-w-[74px] leading-tight">Overall Model Accuracy</p>
        </div>
      </div>
    </div>
  );
}

export function AiInsightsTab({
  data = aiInsightsData,
  onExport,
  onDownload,
  onViewSimilar,
  onViewReport,
}: {
  data?: AiInsightsData;
  onExport: () => void;
  onDownload: () => void;
  onViewSimilar: () => void;
  onViewReport: () => void;
}) {
  const maxImportance = Math.max(...data.featureImportance.items.map((i) => i.value));

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
            Export AI Insights Report
          </Button>
          <Button size="sm" className="gap-2" onClick={onDownload}>
            <Download className="size-4" />
            Download Full Report
          </Button>
        </div>
      </header>

      {/* Performance + confidence + data intelligence */}
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr_0.8fr]">
        <FeasibilityPanel title="AI Model Performance">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <AccuracyRing value={data.performance.overall.value} />
              <StatusBadge tone="hybrid">{data.performance.overall.badge}</StatusBadge>
            </div>
            <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {data.performance.accuracies.map((item) => {
                const Icon = accuracyIcon[item.id];
                return (
                  <div key={item.id} className="min-w-0 space-y-1">
                    <Icon className={cn("size-4", accuracyTone[item.id])} />
                    <p className="text-label text-xs leading-snug font-normal">{item.label}</p>
                    <p className="text-helper leading-snug">{item.caption}</p>
                    <p className="text-lg font-bold tracking-tight">{item.value}</p>
                    <StatusBadge tone="success">{item.badge}</StatusBadge>
                  </div>
                );
              })}
            </div>
          </div>
        </FeasibilityPanel>

        <FeasibilityPanel title="Model Confidence">
          <div className="space-y-3">
            <p className="text-success text-xs font-semibold">{data.confidence.headline}</p>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold tracking-tight">{data.confidence.value}</p>
              <div
                className="h-2.5 flex-1 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, var(--error) 0%, var(--solar) 45%, var(--success) 100%)",
                }}
              />
            </div>
            <p className="text-helper">{data.confidence.caption}</p>
            <ul className="space-y-2">
              {data.confidence.rows.map((row) => (
                <li key={row.label} className="flex items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: row.color }}
                  />
                  <span className="text-label min-w-0 flex-1 text-xs leading-snug font-normal">
                    {row.label}
                  </span>
                  <span className="bg-muted h-1.5 w-20 shrink-0 overflow-hidden rounded-full sm:w-28">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${row.share}%`, backgroundColor: row.color }}
                    />
                  </span>
                  <span className="w-10 shrink-0 text-right text-xs font-semibold">
                    {row.share}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </FeasibilityPanel>

        <FeasibilityPanel title="Data Intelligence Score">
          <div className="flex items-center gap-3">
            <div className="border-hybrid/25 bg-hybrid-soft/50 grid size-16 shrink-0 place-items-center rounded-full border">
              <BrainCircuit className="text-hybrid size-8" />
            </div>
            <div className="min-w-0 space-y-1.5">
              <p className="text-2xl font-bold tracking-tight">
                {data.dataIntelligence.score}
                <span className="text-muted-foreground ml-1 text-sm font-medium">
                  {data.dataIntelligence.max}
                </span>
              </p>
              <StatusBadge tone="success" icon={<CircleCheck className="size-3.5" />}>
                {data.dataIntelligence.badge}
              </StatusBadge>
              <p className="text-helper leading-snug">{data.dataIntelligence.caption}</p>
            </div>
          </div>
        </FeasibilityPanel>
      </div>

      {/* Row 1 */}
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1.15fr]">
        <FeasibilityPanel
          title="AI Predictions Summary"
          subtitle="Key predictions generated by AI models"
        >
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <div className="border-success/25 bg-success-soft/30 min-w-0 rounded-[var(--radius)] border p-3">
              <p className="text-helper mb-2">Primary Prediction</p>
              <div className="border-success/25 bg-card mb-3 flex items-start justify-between gap-2 rounded-[var(--radius)] border p-2.5">
                <div className="min-w-0">
                  <p className="text-success text-sm leading-snug font-semibold">
                    {data.predictions.primary.title}
                  </p>
                  <p className="text-helper">{data.predictions.primary.caption}</p>
                </div>
                <span className="bg-solar-soft grid size-8 shrink-0 place-items-center rounded-full">
                  <Sun className="text-solar size-4" />
                </span>
              </div>
              <ul className="space-y-2.5">
                {data.predictions.primary.rows.map((row) => (
                  <li key={row.label} className="border-success/15 border-t pt-2 first:border-0">
                    <p className="text-base font-bold tracking-tight">{row.value}</p>
                    <p className="text-helper leading-snug">{row.label}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 space-y-3">
              <div className="border-border rounded-[var(--radius)] border p-3">
                <p className="text-label mb-2 text-xs">Prediction Probabilities</p>
                <ul className="space-y-2">
                  {data.predictions.probabilities.map((p) => (
                    <li key={p.label} className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-helper min-w-0 flex-1 leading-snug">{p.label}</span>
                        <span className="shrink-0 text-xs font-semibold">{p.value}%</span>
                      </div>
                      <span className="bg-muted mt-1 block h-1.5 overflow-hidden rounded-full">
                        <span
                          className="block h-full rounded-full"
                          style={{ width: `${p.value}%`, backgroundColor: p.color }}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-border rounded-[var(--radius)] border p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <p className="text-label text-xs">Uncertainty Analysis</p>
                  <span title={data.predictions.uncertainty.caption}>
                    <Info className="text-muted-foreground size-3.5" />
                  </span>
                </div>
                <p className="text-helper mb-2 leading-snug">
                  {data.predictions.uncertainty.caption}
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {data.predictions.uncertainty.rows.map((row) => {
                    const Icon = uncertaintyIcon[row.id];
                    const tone = uncertaintyTone[row.id];
                    return (
                      <div
                        key={row.id}
                        className={cn(
                          "min-w-0 rounded-[var(--radius)] border p-1.5 text-center",
                          tone.card,
                        )}
                      >
                        <Icon className={cn("mx-auto size-4", tone.text)} />
                        <p className={cn("mt-1 text-[10px] leading-tight", tone.text)}>{row.label}</p>
                        <p className={cn("text-xs font-bold", tone.text)}>{row.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </FeasibilityPanel>

        <FeasibilityPanel
          title="Feature Importance (Top 10)"
          subtitle="Key factors influencing AI predictions"
        >
          <div className="space-y-2">
            {data.featureImportance.items.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-helper w-28 shrink-0 leading-snug sm:w-32">{item.label}</span>
                <span className="bg-muted h-2 min-w-0 flex-1 overflow-hidden rounded-full">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${(item.value / maxImportance) * 100}%`,
                      background:
                        "linear-gradient(90deg, var(--hybrid) 0%, color-mix(in oklch, var(--hybrid) 55%, white) 100%)",
                    }}
                  />
                </span>
                <span className="w-11 shrink-0 text-right text-xs font-semibold">
                  {item.value.toFixed(3)}
                </span>
              </div>
            ))}
            <div className="border-hybrid/20 bg-hybrid-soft/30 mt-3 flex items-start gap-2 rounded-[var(--radius)] border p-2.5">
              <Sparkles className="text-hybrid mt-0.5 size-4 shrink-0" />
              <p className="text-helper leading-snug">{data.featureImportance.note}</p>
            </div>
          </div>
        </FeasibilityPanel>

        <FeasibilityPanel
          title="AI Model Ensemble"
          subtitle="Combined predictions from multiple ML models"
        >
          <div className="space-y-3">
            <div className="-mx-1 overflow-x-auto px-1">
              <table className="w-full border-collapse text-left text-[11px]">
                <thead>
                  <tr className="border-border border-b">
                    <th className="text-helper pb-2 font-medium">Model</th>
                    <th className="text-helper pb-2 font-medium">Type</th>
                    <th className="text-helper pb-2 pl-2 text-right font-medium">Weight</th>
                    <th className="text-helper pb-2 pl-1 text-right font-medium">Accuracy</th>
                    <th className="text-helper pb-2 text-right font-medium">Pred.</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ensemble.rows.map((row) => (
                    <tr key={row.model} className="border-border/70 border-b last:border-0">
                      <td className="py-2.5 pr-2 text-xs leading-snug font-semibold">{row.model}</td>
                      <td className="text-helper py-2.5 pr-2">{row.type}</td>
                      <td className="py-2.5 pl-2 text-right text-xs">{row.weight}</td>
                      <td className="py-2.5 pl-1 text-right text-xs font-semibold">{row.accuracy}</td>
                      <td className="py-2.5 text-right">
                        {row.trend === "up" ? (
                          <TrendingUp className="text-success ml-auto size-4" />
                        ) : (
                          <TrendingDown className="text-error ml-auto size-4" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-hybrid/20 bg-hybrid-soft/30 grid grid-cols-2 divide-x divide-[var(--border)] rounded-[var(--radius)] border">
              <div className="p-3 text-center">
                <p className="text-helper">Ensemble Accuracy</p>
                <p className="text-hybrid text-lg font-bold tracking-tight">
                  {data.ensemble.accuracy}
                </p>
              </div>
              <div className="p-3 text-center">
                <p className="text-helper">Ensemble Weight</p>
                <p className="text-hybrid text-lg font-bold tracking-tight">
                  {data.ensemble.weight}
                </p>
              </div>
            </div>
          </div>
        </FeasibilityPanel>
      </div>

      {/* Row 2 */}
      <div className="grid gap-4 xl:grid-cols-3">
        <FeasibilityPanel
          title="Location Similarity Analysis"
          subtitle="AI comparison with similar successful projects"
        >
          <div className="space-y-2">
            <ul className="divide-border divide-y">
              {data.similarProjects.map((p) => (
                <li key={p.location} className="flex items-center gap-2 py-2.5">
                  <span className="bg-primary-soft grid size-8 shrink-0 place-items-center rounded-[var(--radius)]">
                    <Sun className="text-primary size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-label block text-xs leading-snug font-normal">
                      {p.location}
                    </span>
                    <span className="text-helper block">{p.type}</span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold">{p.match}</span>
                  <span className="text-success shrink-0 text-xs font-semibold">{p.status}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" className="w-full gap-2" onClick={onViewSimilar}>
              View Similar Projects
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </FeasibilityPanel>

        <FeasibilityPanel title="Anomaly Detection" subtitle="AI-based anomaly and outlier detection">
          <ul className="divide-border divide-y">
            {data.anomalies.map((row) => {
              const Icon = anomalyIcon[row.id];
              return (
                <li key={row.id} className="flex items-center gap-2 py-2.5">
                  <span className="bg-hybrid-soft/60 grid size-8 shrink-0 place-items-center rounded-[var(--radius)]">
                    <Icon className="text-hybrid size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-label block text-xs leading-snug font-normal">
                      {row.label}
                    </span>
                    <span className="text-helper block leading-snug">{row.detail}</span>
                  </span>
                  <StatusBadge tone="success">{row.status}</StatusBadge>
                </li>
              );
            })}
          </ul>
        </FeasibilityPanel>

        <FeasibilityPanel title="AI Insights Summary" subtitle="Key takeaways from AI analysis">
          <div className="space-y-3">
            <ul className="space-y-2.5">
              {data.summary.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <CircleCheck className="text-success mt-0.5 size-4 shrink-0" />
                  <p className="text-helper leading-snug">{line}</p>
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" className="w-full gap-2" onClick={onViewReport}>
              View Detailed AI Report
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </FeasibilityPanel>
      </div>

      {/* Model status bar */}
      <div className="surface-card border-hybrid/20 bg-hybrid-soft/25 flex flex-wrap items-center justify-between gap-3 border p-4">
        <div className="flex min-w-0 items-center gap-2">
          <BrainCircuit className="text-hybrid size-5 shrink-0" />
          <p className="text-helper leading-snug">{data.modelStatus.message}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-helper">{data.modelStatus.lastUpdate}</p>
          <StatusBadge tone="hybrid" icon={<CircleCheck className="size-3.5" />}>
            {data.modelStatus.badge}
          </StatusBadge>
        </div>
      </div>
    </div>
  );
}
