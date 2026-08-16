import { lazy, Suspense, useMemo, useState } from "react";
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
import {
  createMapExplorerData,
  mapLayers,
  type LayerId,
} from "@/lib/map-explorer-data";
import type { AnalysisRequest, AnalysisResponse } from "@/lib/api/analysis";
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

function readCurrentAnalysis(): {
  request: AnalysisRequest;
  result: AnalysisResponse;
} | null {
  try {
    const requestRaw = sessionStorage.getItem("latestAnalysisRequest");
    const resultRaw = sessionStorage.getItem("latestAnalysisResult");

    if (!requestRaw || !resultRaw) {
      return null;
    }

    return {
      request: JSON.parse(requestRaw) as AnalysisRequest,
      result: JSON.parse(resultRaw) as AnalysisResponse,
    };
  } catch {
    return null;
  }
}

function MapExplorerPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Record<LayerId, boolean>>(defaultLayers);
  const [panelOpen, setPanelOpen] = useState(true);

  const analysis = readCurrentAnalysis();

  const mapData = useMemo(() => {
    if (!analysis) {
      return null;
    }

    return createMapExplorerData(
      analysis.result,
      analysis.request,
    );
  }, [analysis]);

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
          value={mapData?.mapSummary.location ?? "No analysis selected"}
          caption={mapData?.mapSummary.coordinatesLabel ?? "Run an analysis first"}
        />
        <SummaryCard
          icon={<LandIcon className="size-4" />}
          iconClass="bg-success-soft text-success"
          label="Land Area"
          value={mapData?.mapSummary.landAreaLabel ?? "—"}
        />
        <SummaryCard
          icon={<SolarIcon className="size-4" />}
          iconClass="bg-solar-soft text-solar"
          label="Best Technology"
          value={mapData?.mapSummary.bestTechnology ?? "—"}
          caption={mapData?.mapSummary.suitabilityCaption ?? "Current suitability score"}
        />
        <SummaryCard
          icon={<EnergyIcon className="size-4" />}
          iconClass="bg-wind-soft text-wind"
          label="Annual Energy Potential"
          value={mapData?.mapSummary.annualEnergy ?? "—"}
          caption={mapData?.mapSummary.annualEnergyCaption ?? "Estimated annual energy generation"}
        />
        <SummaryCard
          icon={<DateIcon className="size-4" />}
          iconClass="bg-info-soft text-info"
          label="Analysis Time"
          value={mapData?.mapSummary.analysisTimeLabel ?? "—"}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="surface-card relative h-[560px] min-w-0 overflow-hidden p-1.5">
          <div className="relative size-full overflow-hidden rounded-[calc(var(--radius-xl)-4px)]">
            <ClientOnly fallback={<Skeleton className="size-full" />}>
              <Suspense fallback={<Skeleton className="size-full" />}>
                <ExplorerMap
                  latitude={mapData?.selectedSite.latitude ?? 0}
                  longitude={mapData?.selectedSite.longitude ?? 0}
                  label={mapData?.selectedSite.location.split(",")[0] ?? "Selected site"}
                  active={active}
                  onLayersClick={() => setPanelOpen((v) => !v)}
                  mapData={mapData ?? {
                    selectedSite: {
                      status: "No Analysis",
                      location: "No analysis selected",
                      coordinatesLabel: "—",
                      latitude: 0,
                      longitude: 0,
                      score: 0,
                      outOf: 100,
                      rating: "Unavailable",
                      metrics: [],
                    },
                    mapSites: [],
                    heatPoints: [],
                    windPoints: [],
                    waterBodies: [],
                    protectedAreas: [],
                    infrastructureLines: [],
                  }}
                />
              </Suspense>
            </ClientOnly>
          </div>

          <div className="pointer-events-none absolute inset-x-3 top-3 z-[500] flex flex-col gap-3 pr-14">
            <MapSearchBar
              value={search}
              onChange={setSearch}
              onUseCurrentLocation={() =>
                toast.info("Using analysed site location", { description: mapData?.mapSummary.coordinatesLabel ?? "Run an analysis first" })
              }
            />
            {panelOpen ? <MapLayersPanel active={active} onToggle={toggle} /> : null}
          </div>
        </div>

        <SelectedSitePanel
          selectedSite={
            mapData?.selectedSite ?? {
              status: "Unavailable",
              location: "No analysis selected",
              coordinatesLabel: "Run an analysis first",
              latitude: 0,
              longitude: 0,
              score: 0,
              outOf: 100,
              rating: "Low",
              metrics: [],
            }
          }
          onViewFullAnalysis={() => navigate({ to: "/dashboard" })}
        />
      </div>

      <div className="mt-4">
        <SiteInsights
          siteInsights={mapData?.siteInsights ?? []}
          mapDataSources={
            mapData?.mapDataSources ?? "Analysis data sources unavailable"
          }
          onOpenSources={() =>
            toast.info("Map data sources", {
              description:
                mapData?.mapDataSources ?? "Analysis data sources",
            })
          }
        />
      </div>
    </PageContainer>
  );
}
