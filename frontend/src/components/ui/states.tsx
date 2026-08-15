import { CircleAlert, Inbox, Loader2, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Full-panel loading state with spinner + message. */
export function LoadingState({ message = "Loading…", className }: { message?: string; className?: string }) {
  return (
    <div className={cn("surface-card flex flex-col items-center justify-center gap-3 p-12", className)}>
      <Loader2 className="size-6 animate-spin text-primary" />
      <p className="text-helper">{message}</p>
    </div>
  );
}

/** Skeleton grid used while cards or table rows stream in. */
export function SkeletonCards({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface-card p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-8 w-32" />
          <Skeleton className="mt-3 h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

/** Empty state with icon, copy and optional primary action. */
export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "surface-card flex flex-col items-center justify-center gap-3 p-12 text-center",
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
        {icon ?? <Inbox className="size-6" />}
      </span>
      <div>
        <p className="text-card-title">{title}</p>
        {description ? <p className="text-helper mx-auto mt-1 max-w-sm">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

/** Error state with retry affordance. */
export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this data. Please try again.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "surface-card flex flex-col items-center justify-center gap-3 p-12 text-center",
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-full bg-error-soft text-error">
        <CircleAlert className="size-6" />
      </span>
      <div>
        <p className="text-card-title">{title}</p>
        <p className="text-helper mx-auto mt-1 max-w-sm">{description}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="size-4" /> Try again
        </Button>
      ) : null}
    </div>
  );
}
