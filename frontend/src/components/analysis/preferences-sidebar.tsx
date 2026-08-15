import { Info, Sun, Wind, ShieldAlert, ShieldCheck, ClipboardList } from "lucide-react";

import { preferenceInfoItems } from "@/lib/analysis-form";

type PreferenceInfoIcon = (typeof preferenceInfoItems)[number]["icon"];

const infoStyles: Record<PreferenceInfoIcon, { Icon: typeof Sun; wrap: string; icon: string }> = {
  focus: { Icon: Sun, wrap: "bg-solar-soft", icon: "text-solar" },
  priorities: { Icon: Wind, wrap: "bg-wind-soft", icon: "text-wind" },
  risk: { Icon: ShieldAlert, wrap: "bg-solar-soft", icon: "text-solar" },
  feasibility: { Icon: ShieldCheck, wrap: "bg-success-soft", icon: "text-success" },
};


/** Right-hand column for Step 3: preference explanations + note card. */
export function PreferencesSidebar() {
  return (
    <div className="space-y-4">
      <section className="surface-card p-4">
        <h2 className="text-section-title flex items-center gap-2">
          <ClipboardList className="text-primary size-4 shrink-0" />
          About Preferences
        </h2>
        <p className="text-helper mt-1">
          Set your analysis focus and adjust factor priorities to get results that match your project
          goals and requirements.
        </p>
        <ul className="mt-3 space-y-2">
          {preferenceInfoItems.map((item) => {
            const style = infoStyles[item.icon];
            const Icon = style.Icon;
            return (
              <li
                key={item.title}
                className="flex items-start gap-3 rounded-xl border border-border px-3 py-2.5"
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
          Note
        </h2>
        <p className="text-helper mt-2">
          You can review and modify all preferences before final submission.
        </p>
      </section>
    </div>
  );
}
