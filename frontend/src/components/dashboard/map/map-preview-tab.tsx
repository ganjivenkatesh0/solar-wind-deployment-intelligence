import { lazy, Suspense } from "react";
import { ClientOnly, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { ChevronRightIcon, EnergyIcon, LocationIcon, ScoreIcon, SolarIcon } from "@/lib/icons";
import { selectedSite } from "@/lib/map-explorer-data";
import { cn } from "@/lib/utils";

const PreviewMap = lazy(() => import("@/components/map/preview-map"));

const insightCards = [
  { label: "Suitability", value: String(selectedSite.score), caption: selectedSite.rating, icon: ScoreIcon, tone: "text-success" },
  { label: "Best Technology", value: "Solar", caption: "8.0 MW", icon: SolarIcon, tone: "text-solar" },
  { label: "Annual Energy", value: "204.98", caption: "MWh", icon: EnergyIcon, tone: "text-wind" },
  { label: "Payback", value: "4.2", caption: "Years", icon: ScoreIcon, tone: "text-info" },
];

export function MapPreviewTab() {
  const navigate = useNavigate();
  const openExplorer = () => navigate({ to: "/map-explorer" });

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-card-title">Map Preview</h2>
          <p className="text-helper">Selected site location and suitability overview</p>
        </div>
        <Button variant="outline" size="sm" className="bg-card" onClick={openExplorer}>
          Open Map Explorer
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="surface-card flex min-w-0 flex-col overflow-hidden p-2">
          <div className="h-[340px] min-h-[340px] w-full flex-1 overflow-hidden rounded-xl border border-border">
            <ClientOnly fallback={<Skeleton className="size-full" />}>
              <Suspense fallback={<Skeleton className="size-full" />}>
                <PreviewMap
                  latitude={selectedSite.latitude}
                  longitude={selectedSite.longitude}
                  label={selectedSite.location.split(",")[0] ?? selectedSite.location}
                />
              </Suspense>
            </ClientOnly>
          </div>
        </div>

        <section className="surface-card flex min-w-0 flex-col gap-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-card-title">Selected Site</h3>
            <StatusBadge tone="success">{selectedSite.status}</StatusBadge>
          </div>

          <div className="flex min-w-0 items-start gap-2">
            <LocationIcon className="mt-0.5 size-4 shrink-0 text-info" />
            <div className="min-w-0">
              <p className="text-label truncate">{selectedSite.location}</p>
              <p className="text-helper">{selectedSite.coordinatesLabel}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 px-3.5 py-3">
            <p className="text-helper">Suitability Score</p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-bold text-success">{selectedSite.score}</span>
              <span className="text-helper">/{selectedSite.outOf}</span>
              <StatusBadge tone="success" className="ml-auto">
                {selectedSite.rating}
              </StatusBadge>
            </div>
          </div>

          <dl className="min-w-0 divide-y divide-border">
            {selectedSite.metrics.map((m) => (
              <div key={m.label} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 py-2">
                <dt className="text-helper">{m.label}</dt>
                <dd className="text-label whitespace-nowrap">{m.value}</dd>
              </div>
            ))}
          </dl>

          <Button className="mt-auto w-full" onClick={openExplorer}>
            Open Map Explorer
            <ChevronRightIcon className="size-4" />
          </Button>
        </section>
      </div>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {insightCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="surface-card flex min-w-0 items-center gap-3 px-4 py-3.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-muted/50">
                <Icon className={cn("size-4", card.tone)} />
              </span>
              <div className="min-w-0">
                <p className="text-helper truncate">{card.label}</p>
                <p className="text-lg leading-tight font-bold whitespace-nowrap">{card.value}</p>
                <p className="text-helper truncate">{card.caption}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
