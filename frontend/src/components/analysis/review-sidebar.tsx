import { ArrowDown, Brain, ClipboardList, FileText, MapPin, Sun } from "lucide-react";

const stages: {
  Icon: typeof Sun;
  wrap: string;
  icon: string;
  title: string;
  description: string;
}[] = [
  {
    Icon: MapPin,
    wrap: "bg-success-soft",
    icon: "text-success",
    title: "Data Collection",
    description: "We will collect data from multiple sources for your location.",
  },
  {
    Icon: Sun,
    wrap: "bg-solar-soft",
    icon: "text-solar",
    title: "AI Analysis",
    description: "Our AI model will analyze all factors based on your inputs and preferences.",
  },
  {
    Icon: Brain,
    wrap: "bg-wind-soft",
    icon: "text-wind",
    title: "Results Generation",
    description: "Comprehensive results and recommendations will be generated.",
  },
  {
    Icon: FileText,
    wrap: "bg-hybrid-soft",
    icon: "text-hybrid",
    title: "Report Ready",
    description: "You can download the full analysis report with all insights.",
  },
];

export type SummaryRow = {
  Icon: typeof Sun;
  iconClass: string;
  label: string;
  value: string;
};

/** Right-hand column for Step 4: process timeline + analysis summary. */
export function ReviewSidebar({ summary }: { summary: SummaryRow[] }) {
  return (
    <div className="space-y-4">
      <section className="bg-success-soft border-success/25 rounded-xl border p-4">
        <h2 className="text-section-title flex items-center gap-2">
          <ClipboardList className="text-primary size-4 shrink-0" />
          What happens next?
        </h2>
        <ol className="mt-3 space-y-0">
          {stages.map((stage, index) => {
            const Icon = stage.Icon;
            return (
              <li key={stage.title}>
                <div className="bg-card border-border flex items-start gap-3 rounded-xl border p-3">
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-lg ${stage.wrap}`}
                  >
                    <Icon className={`size-4 ${stage.icon}`} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-label text-primary font-semibold">{stage.title}</p>
                    <p className="text-helper mt-0.5">{stage.description}</p>
                  </div>
                </div>
                {index < stages.length - 1 ? (
                  <div className="flex justify-center py-1.5" aria-hidden>
                    <ArrowDown className="text-success size-4" />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </section>

      <section className="surface-card p-4">
        <h2 className="text-section-title">Analysis Summary</h2>
        <dl className="mt-3 space-y-2.5">
          {summary.map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-3">
              <dt className="text-helper flex min-w-0 items-center gap-2">
                <row.Icon className={`size-3.5 shrink-0 ${row.iconClass}`} />
                <span className="truncate">{row.label}</span>
              </dt>
              <dd className="text-label text-right font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
