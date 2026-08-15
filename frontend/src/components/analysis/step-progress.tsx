import { Check } from "lucide-react";

import { analysisSteps } from "@/lib/analysis-form";
import { cn } from "@/lib/utils";

/** Horizontal 4-step workflow indicator for the New Analysis flow. */
export function StepProgress({ current }: { current: number }) {
  return (
    <nav
      aria-label="Analysis steps"
      className="surface-card flex min-w-0 items-center gap-1 overflow-x-auto px-3 py-2 sm:px-5"
    >
      {analysisSteps.map((step, index) => {
        const active = step.id === current;
        const done = step.id < current;
        return (
          <div key={step.id} className="flex min-w-0 shrink-0 items-center gap-1 sm:flex-1">
            <div
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2.5 border-b-2 px-2 py-3 sm:px-3",
                active ? "border-primary" : "border-transparent",
              )}
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                  active
                    ? "bg-primary text-primary-foreground"
                    : done
                      ? "text-success bg-success-soft"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" aria-label="completed" /> : step.id}
              </span>
              <span
                className={cn(
                  "text-label whitespace-nowrap",
                  active
                    ? "font-semibold text-foreground"
                    : done
                      ? "text-foreground"
                      : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < analysisSteps.length - 1 ? (
              <span aria-hidden className="text-muted-foreground hidden flex-1 text-center sm:block">
                →
              </span>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
