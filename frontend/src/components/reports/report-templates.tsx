import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HybridIcon, SolarIcon, WindIcon } from "@/lib/icons";
import { reportTemplates } from "@/lib/reports-data";
import { cn } from "@/lib/utils";

const icons = { Solar: SolarIcon, Wind: WindIcon, Hybrid: HybridIcon } as const;
const tones = {
  Solar: "bg-solar-soft text-warning-foreground",
  Wind: "bg-wind-soft text-wind",
  Hybrid: "bg-hybrid-soft text-hybrid",
} as const;

/** Templates tab: reusable report blueprints, not generated reports. */
export function ReportTemplatesList() {
  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2">
      {reportTemplates.map((template) => {
        const Icon = icons[template.technology];
        return (
          <article
            key={template.id}
            className="min-w-0 rounded-xl border border-border p-4 transition-shadow hover:shadow-[var(--shadow-elevated)]"
          >
            <div className="flex items-start gap-2.5">
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", tones[template.technology])}>
                <Icon className="size-4.5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-label font-semibold">{template.name}</p>
                <p className="text-helper mt-0.5 leading-5">{template.description}</p>
              </div>
            </div>
            <div className="text-helper mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <FileText className="size-3.5" />
                {template.sections} sections
              </span>
              <span>{template.pages}</span>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link to="/new-analysis">Use template</Link>
            </Button>
          </article>
        );
      })}
    </div>
  );
}
