import {
  AiIcon,
  FeasibilityIcon,
  FinancialIcon,
  InfrastructureIcon,
  SolarIcon,
  TerrainIcon,
  WindIcon,
} from "@/lib/icons";
import { Lightbulb } from "lucide-react";
import { analysisFactors, analysisTips, type AnalysisFactorIcon } from "@/lib/analysis-form";

const factorStyles: Record<
  AnalysisFactorIcon,
  { Icon: typeof SolarIcon; wrap: string; icon: string }
> = {
  solar: { Icon: SolarIcon, wrap: "bg-solar-soft", icon: "text-solar" },
  wind: { Icon: WindIcon, wrap: "bg-wind-soft", icon: "text-wind" },
  terrain: { Icon: TerrainIcon, wrap: "bg-success-soft", icon: "text-success" },
  infrastructure: { Icon: InfrastructureIcon, wrap: "bg-hybrid-soft", icon: "text-hybrid" },
  feasibility: { Icon: FeasibilityIcon, wrap: "bg-info-soft", icon: "text-info" },
  financial: { Icon: FinancialIcon, wrap: "bg-success-soft", icon: "text-success" },
  ai: { Icon: AiIcon, wrap: "bg-hybrid-soft", icon: "text-hybrid" },
};

/** Right-hand column: what the model analyses + tips card. */
export function AnalysisSidebar() {
  return (
    <div className="space-y-4">
      <section className="surface-card p-4">
        <h2 className="text-section-title">What will we analyze?</h2>
        <p className="text-helper mt-1">
          Our AI model will analyze multiple factors to provide insights and recommendations.
        </p>
        <ul className="mt-3 space-y-2">
          {analysisFactors.map((factor) => {
            const style = factorStyles[factor.icon];
            const Icon = style.Icon;
            return (
              <li
                key={factor.title}
                className="flex items-start gap-3 rounded-xl border border-border px-3 py-2.5"
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-lg ${style.wrap}`}
                >
                  <Icon className={`size-4 ${style.icon}`} />
                </span>
                <div className="min-w-0">
                  <p className="text-label font-semibold">{factor.title}</p>
                  <p className="text-helper">{factor.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="bg-primary-soft rounded-xl border border-primary/25 p-4">
        <h2 className="text-card-title flex items-center gap-2">
          <Lightbulb className="text-primary size-4 shrink-0" />
          Tips for Better Analysis
        </h2>
        <ul className="text-helper mt-3 list-disc space-y-2 pl-5">
          {analysisTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
