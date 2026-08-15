import { CalendarDays, DollarSign, Info, Mountain, Percent, Sun, Zap } from "lucide-react";

import { parameterInfoItems, parameterTips, type ParameterInfoIcon } from "@/lib/analysis-form";

const infoStyles: Record<
  ParameterInfoIcon,
  { Icon: typeof Sun; wrap: string; icon: string }
> = {
  solar: { Icon: Sun, wrap: "bg-solar-soft", icon: "text-solar" },
  installation: { Icon: Mountain, wrap: "bg-success-soft", icon: "text-success" },
  grid: { Icon: Zap, wrap: "bg-hybrid-soft", icon: "text-hybrid" },
  lifetime: { Icon: CalendarDays, wrap: "bg-wind-soft", icon: "text-wind" },
  cost: { Icon: DollarSign, wrap: "bg-solar-soft", icon: "text-solar" },
  discount: { Icon: Percent, wrap: "bg-info-soft", icon: "text-info" },
};

/** Right-hand column for Step 2: parameter explanations + tips card. */
export function ParametersSidebar() {
  return (
    <div className="space-y-4">
      <section className="bg-primary-soft rounded-xl border border-primary/25 p-4">
        <h2 className="text-section-title flex items-center gap-2">
          <Info className="text-primary size-4 shrink-0" />
          What do these parameters mean?
        </h2>
        <p className="text-helper mt-1">
          These parameters help our AI model provide accurate feasibility, energy and financial
          results.
        </p>
        <ul className="mt-3 space-y-2">
          {parameterInfoItems.map((item) => {
            const style = infoStyles[item.icon];
            const Icon = style.Icon;
            return (
              <li
                key={item.title}
                className="bg-card flex items-start gap-3 rounded-xl border border-border px-3 py-2.5"
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-lg ${style.wrap}`}
                >
                  <Icon className={`size-4 ${style.icon}`} />
                </span>
                <div className="min-w-0">
                  <p className="text-label font-semibold">{item.title}</p>
                  <p className="text-helper">{item.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="bg-info-soft rounded-xl border border-info/25 p-4">
        <h2 className="text-card-title flex items-center gap-2">
          <Info className="text-info size-4 shrink-0" />
          Tip
        </h2>
        <ul className="text-helper mt-3 list-disc space-y-2 pl-5">
          {parameterTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
