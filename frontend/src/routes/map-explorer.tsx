import { lazy, Suspense, useState } from "react";
import { ClientOnly, createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Layers, Plus } from "lucide-react";

import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapLayersPanel, MapSearchBar, SelectedSitePanel, SiteInsights } from "@/components/map/map-panels";
import { mapLayers, mapSummary, selectedSite, mapDataSources, type LayerId } from "@/lib/map-explorer-data";
import { LocationIcon, LandIcon, SolarIcon, EnergyIcon, DateIcon } from "@/lib/icons";

const ExplorerMap = lazy(() => import("@/components/map/explorer-map"));

export const Route = createFileRoute("/map-explorer")({
  head: () => ({
    meta: [
      { title: "Map Explorer — Solar & Wind Deployment Intelligence" },
      {
        name: "description",
        content: "Explore locations on an interactive map and analyze solar, wind and grid infrastructure potential.",
      },
      { property: "og:title", content: "Map Explorer — Solar & Wind Deployment Intelligence" },
      {
        property: "og:description",
        content: "Explore locations on an interactive map and analyze solar, wind and grid infrastructure potential.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapExplorerPage,
});

const defaultLayers = Object.fromEntries(
  mapLayers.map((layer) => [layer.id, layer.defaultOn]),
) as Record<LayerId, boolean>;

function SummaryCard({
  icon,
  iconClass,
  label,
  value,
  caption,
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: string;
  caption?: string;
}) {
  return (
    <div className="surface-card flex min-w-0 items-center gap-3 px-4 py-3 transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <span className={`grid size-9 shrink-0 place-items-center rounded-full ${iconClass}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-helper">{label}</p>
        <p className="text-label font-semibold">{value}</p>
        {caption ? <p className="text-helper truncate">{caption}</p> : null}
      </div>
    </div>
  );
}

function MapExplorerPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Record<LayerId, boolean>>(defaultLayers);
  const [panelOpen, setPanelOpen] = useState(true);

  const toggle = (id: LayerId) => setActive((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <PageContainer>
      <PageHeader
        title="Map Explorer"
        description="Explore locations and analyze renewable energy potential"
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Layers className="size-4" />
                  Layers
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Map Layers</DropdownMenuLabel>
                {mapLayers.map((layer) => (
                  <DropdownMenuCheckboxItem
                    key={layer.id}
                    checked={active[layer.id]}
                    onCheckedChange={() => toggle(layer.id)}
                  >
                    {layer.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" onClick={() => navigate({ to: "/new-analysis" })}>
              <Plus className="size-4" />
              New Analysis
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          icon={<LocationIcon className="size-4" />}
          iconClass="bg-primary-soft text-primary"
          label="Current Location"
          value={mapSummary.location}
          caption={mapSummary.coordinatesLabel}
        />
        <SummaryCard
          icon={<LandIcon className="size-4" />}
          iconClass="bg-success-soft text-success"
          label="Land Area"
          value={mapSummary.landAreaLabel}
        />
        <SummaryCard
          icon={<SolarIcon className="size-4" />}
          iconClass="bg-solar-soft text-solar"
          label="Best Technology"
          value={mapSummary.bestTechnology}
          caption={mapSummary.suitabilityCaption}
        />
        <SummaryCard
          icon={<EnergyIcon className="size-4" />}
          iconClass="bg-wind-soft text-wind"
          label="Annual Energy Potential"
          value={mapSummary.annualEnergy}
          caption={mapSummary.annualEnergyCaption}
        />
        <SummaryCard
          icon={<DateIcon className="size-4" />}
          iconClass="bg-info-soft text-info"
          label="Analysis Time"
          value={mapSummary.analysisTimeLabel}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="surface-card relative h-[560px] min-w-0 overflow-hidden p-1.5">
          <div className="relative size-full overflow-hidden rounded-[calc(var(--radius-xl)-4px)]">
            <ClientOnly fallback={<Skeleton className="size-full" />}>
              <Suspense fallback={<Skeleton className="size-full" />}>
                <ExplorerMap
                  latitude={selectedSite.latitude}
                  longitude={selectedSite.longitude}
                  label={selectedSite.location.split(",")[0] ?? selectedSite.location}
                  active={active}
                  onLayersClick={() => setPanelOpen((v) => !v)}
                />
              </Suspense>
            </ClientOnly>
          </div>

          <div className="pointer-events-none absolute inset-x-3 top-3 z-[500] flex flex-col gap-3 pr-14">
            <MapSearchBar
              value={search}
              onChange={setSearch}
              onUseCurrentLocation={() =>
                toast.info("Using analysed site location", { description: mapSummary.coordinatesLabel })
              }
            />
            {panelOpen ? <MapLayersPanel active={active} onToggle={toggle} /> : null}
          </div>
        </div>

        <SelectedSitePanel onViewFullAnalysis={() => navigate({ to: "/dashboard" })} />
      </div>

      <div className="mt-4">
        <SiteInsights
          onOpenSources={() => toast.info("Map data sources", { description: mapDataSources })}
        />
      </div>
    </PageContainer>
  );
}
