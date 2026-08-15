import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import {
  mapLayers,
  selectedSite,
  siteInsights,
  mapDataSources,
  type LayerId,
  type MapLayer,
} from "@/lib/map-explorer-data";
import {
  SolarIcon,
  WindIcon,
  InfrastructureIcon,
  TerrainIcon,
  LandIcon,
  LocationIcon,
  SearchIcon,
  EnergyIcon,
  CheckIcon,
  AlertIcon,
  ChevronRightIcon,
} from "@/lib/icons";
import { Droplets, Flame, ShieldCheck, X, Crosshair } from "lucide-react";

function LayerIcon({ icon }: { icon: MapLayer["icon"] }) {
  const cls = "size-3.5";
  switch (icon) {
    case "heatmap":
      return <Flame className={cn(cls, "text-solar")} />;
    case "solar":
      return <SolarIcon className={cn(cls, "text-solar")} />;
    case "wind":
      return <WindIcon className={cn(cls, "text-wind")} />;
    case "infrastructure":
      return <InfrastructureIcon className={cn(cls, "text-muted-foreground")} />;
    case "terrain":
      return <TerrainIcon className={cn(cls, "text-success")} />;
    case "protected":
      return <ShieldCheck className={cn(cls, "text-success")} />;
    case "water":
      return <Droplets className={cn(cls, "text-wind")} />;
    case "grid":
      return <EnergyIcon className={cn(cls, "text-hybrid")} />;
  }
}

/** Floating search bar + "Use Current Location" action inside the map. */
export function MapSearchBar({
  value,
  onChange,
  onUseCurrentLocation,
}: {
  value: string;
  onChange: (v: string) => void;
  onUseCurrentLocation: () => void;
}) {
  return (
    <div className="pointer-events-auto flex w-full max-w-[560px] flex-wrap items-center gap-2">
      <div className="surface-card flex min-w-0 flex-1 items-center gap-2 px-3 py-2">
        <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search location..."
          aria-label="Search location"
          className="text-label min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground placeholder:font-normal"
        />
        {value ? (
          <button type="button" aria-label="Clear search" onClick={() => onChange("")} className="shrink-0 text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        ) : (
          <X className="size-4 shrink-0 text-muted-foreground/50" aria-hidden />
        )}
      </div>
      <Button variant="outline" size="sm" className="h-[42px] shrink-0 bg-card" onClick={onUseCurrentLocation}>
        <Crosshair className="size-4 text-primary" />
        Use Current Location
      </Button>
    </div>
  );
}

/** Floating layer toggles + suitability legend. */
export function MapLayersPanel({
  active,
  onToggle,
}: {
  active: Record<LayerId, boolean>;
  onToggle: (id: LayerId) => void;
}) {
  return (
    <div className="pointer-events-auto w-[220px] max-w-[70vw] space-y-3">
      <div className="surface-card px-3.5 py-3">
        <p className="text-card-title mb-2.5">Map Layers</p>
        <ul className="space-y-2">
          {mapLayers.map((layer) => (
            <li key={layer.id} className="flex items-center gap-2">
              <Checkbox
                id={`layer-${layer.id}`}
                checked={active[layer.id]}
                onCheckedChange={() => onToggle(layer.id)}
              />
              <label htmlFor={`layer-${layer.id}`} className="text-label flex min-w-0 cursor-pointer items-center gap-1.5">
                <LayerIcon icon={layer.icon} />
                <span className="truncate">{layer.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="surface-card px-3.5 py-3">
        <p className="text-card-title mb-2">Legend (Suitability Score)</p>
        <div
          className="h-2 w-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.65 0.19 30) 0%, oklch(0.78 0.16 60) 25%, oklch(0.86 0.16 95) 50%, oklch(0.78 0.16 130) 75%, oklch(0.62 0.16 150) 100%)",
          }}
        />
        <div className="text-helper mt-1 flex justify-between">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
        <div className="text-helper flex justify-between">
          <span>Low Suitability</span>
          <span>High Suitability</span>
        </div>
      </div>
    </div>
  );
}

/** Right-hand selected site summary card. */
export function SelectedSitePanel({ onViewFullAnalysis }: { onViewFullAnalysis: () => void }) {
  return (
    <section className="surface-card flex min-w-0 flex-col gap-4 p-4">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-section-title">Selected Site</h2>
        <StatusBadge tone="success">{selectedSite.status}</StatusBadge>
      </header>

      <div className="flex items-start gap-2">
        <LocationIcon className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="min-w-0">
          <p className="text-label font-semibold">{selectedSite.location}</p>
          <p className="text-helper">{selectedSite.coordinatesLabel}</p>
        </div>
      </div>

      <div className="border-t border-border pt-3">
        <p className="text-helper">Suitability Score</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-2xl font-bold tracking-tight">
            {selectedSite.score}
            <span className="text-helper ml-1 font-medium">/{selectedSite.outOf}</span>
          </p>
          <StatusBadge tone="success">{selectedSite.rating}</StatusBadge>
        </div>
      </div>

      <dl className="flex-1 divide-y divide-border border-t border-border">
        {selectedSite.metrics.map((metric) => (
          <div key={metric.label} className="flex items-center justify-between gap-3 py-2.5">
            <dt className="text-helper min-w-0">{metric.label}</dt>
            <dd className="text-label flex items-center gap-1.5 font-semibold whitespace-nowrap">
              {metric.value}
              {"icon" in metric && metric.icon === "solar" ? <SolarIcon className="size-4 text-solar" /> : null}
            </dd>
          </div>
        ))}
      </dl>

      <Button className="mt-auto w-full" onClick={onViewFullAnalysis}>
        View Full Analysis
      </Button>
    </section>
  );
}

const insightIcon = (icon: (typeof siteInsights)[number]["icon"]) => {
  const cls = "size-4";
  switch (icon) {
    case "land":
      return <LandIcon className={cls} />;
    case "check":
      return <CheckIcon className={cls} />;
    case "alert":
      return <AlertIcon className={cls} />;
    case "solar":
      return <SolarIcon className={cls} />;
    case "wind":
      return <WindIcon className={cls} />;
  }
};

const toneClass: Record<string, string> = {
  success: "bg-success-soft text-success",
  solar: "bg-solar-soft text-warning-foreground",
  error: "bg-error-soft text-error",
  wind: "bg-wind-soft text-wind",
};

/** Bottom "Site Insights" strip. */
export function SiteInsights({ onOpenSources }: { onOpenSources: () => void }) {
  return (
    <section className="surface-card p-4">
      <h2 className="text-section-title mb-3">Site Insights</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {siteInsights.map((insight) => (
          <div key={insight.label} className="surface-card flex min-w-0 items-start gap-2.5 px-3 py-3">
            <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", toneClass[insight.tone])}>
              {insightIcon(insight.icon)}
            </span>
            <div className="min-w-0">
              <p className="text-helper">{insight.label}</p>
              <p className="text-lg font-bold tracking-tight">{insight.value}</p>
              <p className="text-helper">{insight.caption}</p>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onOpenSources}
          className="surface-card min-w-0 px-3 py-3 text-left transition-shadow hover:shadow-[var(--shadow-elevated)]"
        >
          <span className="text-label flex items-center justify-between gap-2 font-semibold">
            Map Data Sources
            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
          </span>
          <span className="text-helper mt-1 block">{mapDataSources}</span>
        </button>
      </div>
    </section>
  );
}
