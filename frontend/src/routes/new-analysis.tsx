import { createFileRoute, ClientOnly, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";

import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { AnalysisSidebar } from "@/components/analysis/analysis-sidebar";
import { StepProgress } from "@/components/analysis/step-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteIcon, LocationIcon, SearchIcon } from "@/lib/icons";
import {
  defaultAnalysisDraft,
  formatCoordinates,
  formatThousands,
  landUseOptions,
  loadDraft,
  sanitizeDecimal,
  saveDraft,
  selectedLocationInfo,
  type AnalysisDraft,
} from "@/lib/analysis-form";

const LocationPickerMap = lazy(() => import("@/components/analysis/location-picker-map"));

export const Route = createFileRoute("/new-analysis")({
  head: () => ({
    meta: [
      { title: "New Analysis — Site Details | Solar & Wind Intelligence" },
      {
        name: "description",
        content:
          "Enter site coordinates, land area and budget to run a comprehensive AI-powered solar and wind suitability analysis.",
      },
      { property: "og:title", content: "New Analysis — Site Details | Solar & Wind Intelligence" },
      {
        property: "og:description",
        content:
          "Enter site coordinates, land area and budget to run a comprehensive AI-powered solar and wind suitability analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewAnalysisPage,
});

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: string;
  required?: boolean;
}) {
  return (
    <Label htmlFor={htmlFor} className="text-label mb-1.5 block">
      {children}
      {required ? <span className="text-destructive ml-0.5">*</span> : null}
    </Label>
  );
}

function NewAnalysisPage() {
  const [draft, setDraft] = useState<AnalysisDraft>(defaultAnalysisDraft);

  useEffect(() => {
    setDraft(loadDraft());
  }, []);

  const update = (patch: Partial<AnalysisDraft>) =>
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      saveDraft(next);
      return next;
    });

  const lat = Number(draft.latitude);
  const lon = Number(draft.longitude);
  const mapLat = Number.isFinite(lat) ? lat : 17.385;
  const mapLon = Number.isFinite(lon) ? lon : 78.4867;

  const clearAll = () => {
    setDraft(defaultAnalysisDraft);
    saveDraft(defaultAnalysisDraft);
    toast.info("Form reset to default values.");
  };

  return (
    <PageContainer>
      <PageHeader
        title="New Analysis"
        description="Enter site details and preferences to run a comprehensive renewable energy analysis."
        actions={
          <nav aria-label="Breadcrumb" className="text-helper flex items-center gap-2">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <span aria-hidden>›</span>
            <span className="text-foreground font-medium">New Analysis</span>
          </nav>
        }
      />

      <StepProgress current={1} />

      <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-4">
          {/* Site Location */}
          <section className="surface-card p-4 sm:p-5">
            <h2 className="text-section-title">Site Location</h2>
            <p className="text-helper mt-1">
              Provide the geographic location of the site you want to analyze.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="min-w-0">
                <FieldLabel htmlFor="latitude" required>
                  Latitude
                </FieldLabel>
                <Input
                  id="latitude"
                  inputMode="decimal"
                  value={draft.latitude}
                  onChange={(e) => update({ latitude: sanitizeDecimal(e.target.value) })}
                />
              </div>
              <div className="min-w-0">
                <FieldLabel htmlFor="longitude" required>
                  Longitude
                </FieldLabel>
                <Input
                  id="longitude"
                  inputMode="decimal"
                  value={draft.longitude}
                  onChange={(e) => update({ longitude: sanitizeDecimal(e.target.value) })}
                />
              </div>
              <div className="min-w-0">
                <FieldLabel htmlFor="search-location">Search Location (Optional)</FieldLabel>
                <div className="relative">
                  <Input
                    id="search-location"
                    className="pr-9"
                    placeholder="Search city, district or address"
                    value={draft.searchQuery}
                    onChange={(e) => update({ searchQuery: e.target.value })}
                  />
                  <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="bg-primary-soft mt-4 flex items-center gap-2 rounded-xl border border-primary/25 px-3 py-2.5">
              <Info className="text-primary size-4 shrink-0" />
              <p className="text-helper text-foreground">
                You can also click on the map to select the exact location.
              </p>
            </div>

            <div className="mt-4 grid min-w-0 gap-0 overflow-hidden rounded-xl border border-border lg:grid-cols-[minmax(0,1fr)_260px]">
              <div className="h-[260px] min-w-0 lg:h-[280px]">
                <ClientOnly fallback={<Skeleton className="size-full" />}>
                  <Suspense fallback={<Skeleton className="size-full" />}>
                    <LocationPickerMap
                      latitude={mapLat}
                      longitude={mapLon}
                      onPick={(nextLat, nextLon) =>
                        update({
                          latitude: nextLat.toFixed(4),
                          longitude: nextLon.toFixed(4),
                        })
                      }
                    />
                  </Suspense>
                </ClientOnly>
              </div>
              <div className="bg-muted/40 min-w-0 border-t border-border p-4 lg:border-t-0 lg:border-l">
                <p className="text-card-title flex items-center gap-2">
                  <LocationIcon className="text-primary size-4 shrink-0" />
                  Selected Location
                </p>
                <p className="text-label mt-3 font-semibold">{selectedLocationInfo.name}</p>
                <p className="text-helper mt-0.5">
                  {formatCoordinates(draft.latitude, draft.longitude)}
                </p>
                <dl className="mt-3 space-y-2.5">
                  <div>
                    <dt className="text-helper">Elevation (from SRTM)</dt>
                    <dd className="text-label text-primary font-semibold">
                      {selectedLocationInfo.elevation}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-helper">Terrain Type</dt>
                    <dd className="text-label">{selectedLocationInfo.terrainType}</dd>
                  </div>
                  <div>
                    <dt className="text-helper">Timezone</dt>
                    <dd className="text-label">{selectedLocationInfo.timezone}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          {/* Site Specifications */}
          <section className="surface-card p-4 sm:p-5">
            <h2 className="text-section-title">Site Specifications</h2>
            <p className="text-helper mt-1">
              Provide basic information about the available land and budget.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="min-w-0">
                <FieldLabel htmlFor="land-area" required>
                  Land Area (hectares)
                </FieldLabel>
                <Input
                  id="land-area"
                  inputMode="decimal"
                  value={draft.landArea}
                  onChange={(e) => update({ landArea: sanitizeDecimal(e.target.value) })}
                />
                <p className="text-helper mt-1.5">Total available land for the project</p>
              </div>
              <div className="min-w-0">
                <FieldLabel htmlFor="budget" required>
                  Available Budget (USD)
                </FieldLabel>
                <Input
                  id="budget"
                  inputMode="numeric"
                  value={draft.budget}
                  onChange={(e) => update({ budget: formatThousands(e.target.value) })}
                />
                <p className="text-helper mt-1.5">Total budget for the project</p>
              </div>
              <div className="min-w-0">
                <FieldLabel htmlFor="land-use">Land Use Type</FieldLabel>
                <Select
                  value={draft.landUseType}
                  onValueChange={(value) => update({ landUseType: value })}
                >
                  <SelectTrigger id="land-use" className="w-full">
                    <SelectValue placeholder="Select land use type" />
                  </SelectTrigger>
                  <SelectContent>
                    {landUseOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-helper mt-1.5">Current land usage type</p>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button variant="outline" onClick={clearAll}>
              <DeleteIcon className="size-4" />
              Clear All
            </Button>
            <Button asChild>
              <Link to="/new-analysis/project-parameters">
                Next: Project Parameters
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <AnalysisSidebar />
      </div>
    </PageContainer>
  );
}
