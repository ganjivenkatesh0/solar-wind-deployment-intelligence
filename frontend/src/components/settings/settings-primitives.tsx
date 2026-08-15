import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** White rounded card with a title / description header used across every settings tab. */
export function SettingsCard({
  title,
  description,
  children,
  footer,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("surface-card min-w-0 p-4 sm:p-5", className)}>
      <header>
        <h2 className="text-card-title">{title}</h2>
        {description ? <p className="text-helper mt-1">{description}</p> : null}
      </header>
      <div className="mt-4 min-w-0">{children}</div>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </section>
  );
}

/** Single settings row: icon + title/description on the left, control on the right. */
export function SettingRow({
  icon: Icon,
  title,
  description,
  control,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  control: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-3 border-b border-border py-3.5 first:pt-0 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
          <Icon className="size-4.5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="text-label">{title}</p>
          <p className="text-helper mt-0.5">{description}</p>
        </div>
      </div>
      <div className="min-w-0 shrink-0 sm:w-[240px]">{control}</div>
    </div>
  );
}

/** Right-aligned select control used by the General tab rows. */
export function SettingSelect({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Label / value line used in the System Information and Data & Storage cards. */
export function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 py-1.5">
      <span className="text-helper flex min-w-0 items-center gap-2">
        <Icon className="text-muted-foreground size-4 shrink-0" strokeWidth={1.75} />
        <span className="truncate">{label}</span>
      </span>
      <span className="text-label shrink-0 whitespace-nowrap">{value}</span>
    </div>
  );
}
