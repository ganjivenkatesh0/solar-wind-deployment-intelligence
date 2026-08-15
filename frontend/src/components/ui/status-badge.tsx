import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
  {
    variants: {
      tone: {
        success: "border-success/25 bg-success-soft text-success",
        warning: "border-warning/30 bg-warning-soft text-warning-foreground",
        error: "border-error/25 bg-error-soft text-error",
        info: "border-info/25 bg-info-soft text-info",
        neutral: "border-border bg-muted text-muted-foreground",
        solar: "border-solar/30 bg-solar-soft text-warning-foreground",
        wind: "border-wind/25 bg-wind-soft text-wind",
        hybrid: "border-hybrid/25 bg-hybrid-soft text-hybrid",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export type StatusTone = NonNullable<VariantProps<typeof statusBadgeVariants>["tone"]>;

export function StatusBadge({
  tone,
  children,
  className,
  icon,
}: {
  tone?: StatusTone;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span className={cn(statusBadgeVariants({ tone }), className)}>
      {icon}
      {children}
    </span>
  );
}

export { statusBadgeVariants };
