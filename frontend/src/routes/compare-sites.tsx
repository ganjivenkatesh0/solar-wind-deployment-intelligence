import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { ClientOnly, createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { PageContainer, PageHeader } from "@/components/layout/page-container";
import {
  AddSiteDialog,
  type LocationSearchResult,
} from "@/components/compare/add-site-dialog";
import { ComparisonSummaryColumn } from "@/components/compare/comparison-summary";
import {
  MetricComparisonTable,
  OverviewComparisonTable,
} from "@/components/compare/comparison-table";
import {
  ComparisonTabs,
  type CompareTabId,
} from "@/components/compare/comparison-tabs";
import { SiteCompareCards } from "@/components/compare/site-compare-cards";
import { SiteSelectionBar } from "@/components/compare/site-selection-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/states";
import { ChevronRightIcon, LocationIcon } from "@/lib/icons";
import {
  maxCompareSites,
} from "@/lib/compare-sites-data";
import type { CompareSite } from "@/lib/compare-sites-data";
import { listAnalysisHistory } from "@/lib/api/analysis-history";
import { runAnalysis, type AnalysisRequest } from "@/lib/api/analysis";
import {
  mapAnalysisHistoryToCompareSite,
  mapAnalysisResponseToCompareSite,
} from "@/lib/compare-sites-mapper";

const CompareMap = lazy(() => import("@/components/compare/compare-map"));

export const Route = createFileRoute("/compare-sites")({
  head: () => ({
    meta: [
      { title: "Compare Sites — Solar & Wind Deployment Intelligence" },
      {
        name: "description",
        content:
          "Compare up to four renewable energy locations side by side across suitability, resources, feasibility, financials and environmental factors.",
      },
      { property: "og:title", content: "Compare Sites — Solar & Wind Deployment Intelligence" },
      {
        property: "og:description",
        content:
          "Compare up to four renewable energy locations side by side across suitability, resources, feasibility, financials and environmental factors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompareSitesPage,
});

function CompareSitesPage() {
  const navigate = useNavigate();
  const [availableSites, setAvailableSites] = useState<CompareSite[]>([]);
  const [draftIds, setDraftIds] = useState<string[]>([]);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [tab, setTab] = useState<CompareTabId>("overview");
  const [addOpen, setAddOpen] = useState(false);
  const [focusedId, setFocusedId] = useState<string | undefined>();
  const [loadingSites, setLoadingSites] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSites() {
      setLoadingSites(true);

      try {
        const result = await listAnalysisHistory(1, 100);

        console.log("[Compare Sites] History API result:", result);
        console.log("[Compare Sites] History items:", result.items);

        const mapped = result.items
          .filter((item) => item.status === "Completed")
          .map(mapAnalysisHistoryToCompareSite);

        console.log("[Compare Sites] Mapped sites:", mapped);

        if (!cancelled) {
          setAvailableSites(mapped);
          setDraftIds([]);
          setAppliedIds([]);
          setFocusedId(undefined);
        }
      } catch (error) {
        console.error("[Compare Sites] Unable to load analysed sites:", error);

        if (!cancelled) {
          setAvailableSites([]);
          setDraftIds([]);
          setAppliedIds([]);
          setFocusedId(undefined);
        }
      } finally {
        if (!cancelled) {
          setLoadingSites(false);
        }
      }
    }

    void loadSites();

    return () => {
      cancelled = true;
    };
  }, []);

  const draftSites = useMemo(
    () =>
      draftIds
        .map((id) => availableSites.find((site) => site.id === id))
        .filter(Boolean) as CompareSite[],
    [draftIds, availableSites],
  );

  const sites = useMemo(
    () =>
      appliedIds
        .map((id) => availableSites.find((site) => site.id === id))
        .filter(Boolean) as CompareSite[],
    [appliedIds, availableSites],
  );

  const bestSite = useMemo(
    () => [...sites].sort((a, b) => b.suitability - a.suitability)[0],
    [sites],
  );

  const removeSite = (id: string) => {
    setDraftIds((prev) => prev.filter((x) => x !== id));
    setAppliedIds((prev) => prev.filter((x) => x !== id));
  };

  const clearAll = () => {
    setDraftIds([]);
    setAppliedIds([]);
    toast.success("Comparison cleared");
  };

  const addLocation = async (location: LocationSearchResult) => {
    if (draftIds.length >= maxCompareSites) {
      toast.error("You can compare up to 4 sites.");
      return;
    }

    const latitude = Number(location.lat);
    const longitude = Number(location.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      toast.error("Invalid location coordinates.");
      throw new Error("Invalid location coordinates");
    }

    let previousRequest: Partial<AnalysisRequest> = {};

    try {
      const raw = window.sessionStorage.getItem("latestAnalysisRequest");

      if (raw) {
        previousRequest = JSON.parse(raw) as Partial<AnalysisRequest>;
      }
    } catch {
      previousRequest = {};
    }

    const locationName =
      location.display_name ||
      `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;

    const request: AnalysisRequest = {
      latitude,
      longitude,
      land_area_hectares:
        Number(previousRequest.land_area_hectares) > 0
          ? Number(previousRequest.land_area_hectares)
          : 40,
      available_budget:
        Number(previousRequest.available_budget) > 0
          ? Number(previousRequest.available_budget)
          : 5000000,
      project_type:
        previousRequest.project_type === "wind" ||
        previousRequest.project_type === "hybrid"
          ? previousRequest.project_type
          : "solar",
      installation_type:
        previousRequest.installation_type === "rooftop" ||
        previousRequest.installation_type === "other"
          ? previousRequest.installation_type
          : "ground-mounted",
      location_name: locationName,
    };

    toast.info(`Analysing ${locationName.split(",")[0]}...`);

    try {
      const response = await runAnalysis(request);

      const site = mapAnalysisResponseToCompareSite(response, request);

      setAvailableSites((prev) => {
        const withoutDuplicate = prev.filter(
          (existing) =>
            Math.abs(existing.latitude - site.latitude) > 0.00001 ||
            Math.abs(existing.longitude - site.longitude) > 0.00001,
        );

        return [...withoutDuplicate, site];
      });

      setDraftIds((prev) => {
        if (prev.includes(site.id)) return prev;
        return [...prev, site.id].slice(0, maxCompareSites);
      });

      setAppliedIds((prev) => {
        if (prev.includes(site.id)) return prev;
        return [...prev, site.id].slice(0, maxCompareSites);
      });

      setFocusedId(site.id);

      toast.success(`${site.city} added to comparison.`);
    } catch (error) {
      console.error("[Compare Sites] Location analysis failed:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to analyse this location.",
      );

      throw error;
    }
  };

  const updateComparison = () => {
    setAppliedIds(draftIds);
    toast.success("Comparison updated");
  };

  const openReport = () => navigate({ to: "/dashboard" });

  return (
    <PageContainer>
      <PageHeader
        title="Compare Sites"
        description="Compare multiple locations side-by-side to find the best site for your project."
        actions={
          <nav aria-label="Breadcrumb" className="text-helper flex items-center gap-2">
            <Link to="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <ChevronRightIcon className="size-3.5" />
            <span className="text-foreground font-medium">Compare Sites</span>
          </nav>
        }
      />

      <div className="space-y-4">
        <SiteSelectionBar
          sites={draftSites}
          onRemove={removeSite}
          onAdd={() => setAddOpen(true)}
          onClearAll={clearAll}
          onUpdate={updateComparison}
        />

        {sites.length && bestSite ? (
          <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_296px]">
            <div className="min-w-0 space-y-4">
              <SiteCompareCards
                sites={sites}
                bestSiteId={bestSite.id}
                selectedId={focusedId}
                onSelect={setFocusedId}
              />

              <ComparisonTabs value={tab} onChange={setTab}>
                {tab === "overview" ? <OverviewComparisonTable sites={sites} /> : null}
                {tab === "map" ? (
                  <div className="p-3">
                    <div className="border-border h-[380px] overflow-hidden rounded-xl border">
                      <ClientOnly fallback={<Skeleton className="size-full" />}>
                        <Suspense fallback={<Skeleton className="size-full" />}>
                          <CompareMap sites={sites} />
                        </Suspense>
                      </ClientOnly>
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                      {sites.map((site, index) => (
                        <li key={site.id} className="text-helper flex items-center gap-1.5">
                          <LocationIcon
                            className="size-3.5"
                            style={{ color: ["var(--primary)", "var(--wind)", "var(--hybrid)", "var(--solar)"][index] }}
                          />
                          Site {index + 1} · {site.shortLabel} · {site.coordinates}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {tab !== "overview" && tab !== "map" ? (
                  <MetricComparisonTable sites={sites} tabId={tab} />
                ) : null}
              </ComparisonTabs>
            </div>

            <ComparisonSummaryColumn sites={sites} bestSite={bestSite} onOpenReport={openReport} />
          </div>
        ) : (
          <EmptyState
            title="No sites selected"
            description="Add up to 4 sites to begin comparison."
            action={<Button onClick={() => setAddOpen(true)}>Add Site</Button>}
          />
        )}
      </div>

      <AddSiteDialog
        open={addOpen}
        availableSites={availableSites}
        onOpenChange={setAddOpen}
        selectedIds={draftIds}
        remainingSlots={maxCompareSites - draftIds.length}
        onConfirmLocation={addLocation}
        loading={loadingSites}
      />
    </PageContainer>
  );
}
