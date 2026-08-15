import { lazy, Suspense, useMemo, useState } from "react";
import { ClientOnly, createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { AddSiteDialog } from "@/components/compare/add-site-dialog";
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
  availableSites,
  defaultSelectedIds,
  maxCompareSites,
} from "@/lib/compare-sites-data";

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
  const [draftIds, setDraftIds] = useState<string[]>(defaultSelectedIds);
  const [appliedIds, setAppliedIds] = useState<string[]>(defaultSelectedIds);
  const [tab, setTab] = useState<CompareTabId>("overview");
  const [addOpen, setAddOpen] = useState(false);
  const [focusedId, setFocusedId] = useState<string | undefined>(defaultSelectedIds[0]);

  const draftSites = useMemo(
    () => draftIds.map((id) => availableSites.find((s) => s.id === id)!).filter(Boolean),
    [draftIds],
  );
  const sites = useMemo(
    () => appliedIds.map((id) => availableSites.find((s) => s.id === id)!).filter(Boolean),
    [appliedIds],
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

  const addSites = (ids: string[]) => {
    const next = [...draftIds, ...ids].slice(0, maxCompareSites);
    setDraftIds(next);
    setAppliedIds(next);
    setFocusedId((prev) => prev ?? next[0]);
    toast.success(ids.length > 1 ? `${ids.length} sites added` : "Site added to comparison");
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
        onOpenChange={setAddOpen}
        selectedIds={draftIds}
        remainingSlots={maxCompareSites - draftIds.length}
        onConfirm={addSites}
      />
    </PageContainer>
  );
}
