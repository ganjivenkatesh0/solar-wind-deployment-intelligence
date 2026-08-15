import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Standard dashboard panel: card surface, title row and optional action. */
export function CardPanel({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "surface-card flex min-w-0 flex-col transition-shadow hover:shadow-[var(--shadow-elevated)]",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
        <h2 className="text-card-title truncate">{title}</h2>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className={cn("min-w-0 flex-1 px-4 pb-4", bodyClassName)}>{children}</div>
    </section>
  );
}
