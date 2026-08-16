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
  resolveLocation,
  sanitizeDecimal,
  saveDraft,
  type AnalysisDraft,
} from "@/lib/analysis-form";

const LocationPickerMap = lazy(() => import("@/components/analysis/location-picker-map"));


type LocationSearchResult = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
  };
};


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
  const [locationResults, setLocationResults] = useState<LocationSearchResult[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [locationSearchError, setLocationSearchError] = useState("");
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);

  useEffect(() => {
    setDraft(loadDraft());
  }, []);

  const update = (patch: Partial<AnalysisDraft>) =>
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      saveDraft(next);
      return next;
    });

  useEffect(() => {
    const query = draft.searchQuery.trim();

    if (query.length < 2) {
      setLocationResults([]);
      setLocationSearchError("");
      setIsSearchingLocation(false);
      setActiveLocationIndex(0);
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setIsSearchingLocation(true);
      setLocationSearchError("");

      try {
        const params = new URLSearchParams({
          q: query,
          format: "jsonv2",
          addressdetails: "1",
          limit: "5",
          "accept-language": "en",
        });

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${params.toString()}`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Location search failed: ${response.status}`);
        }

        const results = (await response.json()) as LocationSearchResult[];

        setLocationResults(results);
        setActiveLocationIndex(0);

        if (results.length === 0) {
          setLocationSearchError("No matching locations found.");
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Location search failed:", error);
        setLocationResults([]);
        setLocationSearchError("Unable to search locations right now.");
      } finally {
        if (!controller.signal.aborted) {
          setIsSearchingLocation(false);
        }
      }
    }, 450);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [draft.searchQuery]);

  const selectLocation = async (result: LocationSearchResult) => {
    const latitude = Number(result.lat);
    const longitude = Number(result.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      toast.error("The selected location returned invalid coordinates.");
      return;
    }

    const formattedLatitude = latitude.toFixed(4);
    const formattedLongitude = longitude.toFixed(4);

    setLocationResults([]);
    setLocationSearchError("");
    setActiveLocationIndex(0);

    update({
      searchQuery: result.display_name,
      latitude: formattedLatitude,
      longitude: formattedLongitude,
      locationName: result.display_name,
      elevation: "—",
      terrainType: "—",
      timezone: "—",
    });

    try {
      const resolved = await resolveLocation(latitude, longitude);

      update({
        searchQuery: result.display_name,
        latitude: formattedLatitude,
        longitude: formattedLongitude,
        locationName: resolved.name || result.display_name,
        elevation: resolved.elevation,
        terrainType: resolved.terrainType,
        timezone: resolved.timezone,
      });

      toast.success(`Location selected: ${resolved.name || result.display_name}`);
    } catch {
      toast.success(`Location selected: ${result.display_name}`);
    }
  };

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
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={locationResults.length > 0}
                    aria-controls="location-search-results"
                    aria-autocomplete="list"
                    onChange={(e) => {
                      update({ searchQuery: e.target.value });
                      setLocationSearchError("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown" && locationResults.length > 0) {
                        event.preventDefault();
                        setActiveLocationIndex((current) =>
                          Math.min(current + 1, locationResults.length - 1),
                        );
                      }

                      if (event.key === "ArrowUp" && locationResults.length > 0) {
                        event.preventDefault();
                        setActiveLocationIndex((current) => Math.max(current - 1, 0));
                      }

                      if (event.key === "Enter" && locationResults.length > 0) {
                        event.preventDefault();
                        void selectLocation(locationResults[activeLocationIndex]);
                      }

                      if (event.key === "Escape") {
                        setLocationResults([]);
                        setLocationSearchError("");
                      }
                    }}
                  />

                  <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />

                  {(locationResults.length > 0 ||
                    isSearchingLocation ||
                    locationSearchError) && (
                    <div
                      id="location-search-results"
                      role="listbox"
                      className="bg-background absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border shadow-lg"
                    >
                      {isSearchingLocation && (
                        <div className="text-helper px-3 py-3">
                          Searching locations...
                        </div>
                      )}

                      {!isSearchingLocation &&
                        locationResults.map((result, index) => (
                          <button
                            key={result.place_id}
                            type="button"
                            role="option"
                            aria-selected={index === activeLocationIndex}
                            className={`block w-full px-3 py-2.5 text-left transition-colors ${
                              index === activeLocationIndex
                                ? "bg-primary/10"
                                : "hover:bg-muted"
                            }`}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              void selectLocation(result);
                            }}
                            onMouseEnter={() => setActiveLocationIndex(index)}
                          >
                            <span className="text-label block font-medium">
                              {result.address?.city ||
                                result.address?.town ||
                                result.address?.village ||
                                result.address?.municipality ||
                                result.display_name.split(",")[0]}
                            </span>
                            <span className="text-helper mt-0.5 block truncate">
                              {result.display_name}
                            </span>
                          </button>
                        ))}

                      {!isSearchingLocation &&
                        locationResults.length === 0 &&
                        locationSearchError && (
                          <div className="text-helper px-3 py-3">
                            {locationSearchError}
                          </div>
                        )}
                    </div>
                  )}
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
                      onPick={async (nextLat, nextLon) => {
                        const latitude = nextLat.toFixed(4);
                        const longitude = nextLon.toFixed(4);

                        // Immediately update coordinates so the map/UI responds.
                        update({
                          latitude,
                          longitude,
                          locationName: `${latitude}, ${longitude}`,
                          elevation: "—",
                          terrainType: "—",
                          timezone: "—",
                        });

                        // Reverse-geocode the selected coordinates and update
                        // the complete site-location information.
                        try {
                          const resolved = await resolveLocation(nextLat, nextLon);

                          update({
                            latitude,
                            longitude,
                            locationName: resolved.name,
                            elevation: resolved.elevation,
                            terrainType: resolved.terrainType,
                            timezone: resolved.timezone,
                          });

                          saveDraft({
                            ...draft,
                            latitude,
                            longitude,
                            locationName: resolved.name,
                            elevation: resolved.elevation,
                            terrainType: resolved.terrainType,
                            timezone: resolved.timezone,
                          });
                        } catch (error) {
                          console.error(
                            "Failed to resolve selected map location:",
                            error,
                          );

                          // Never keep the previous location name after a
                          // different map location has been selected.
                          saveDraft({
                            ...draft,
                            latitude,
                            longitude,
                            locationName: `${latitude}, ${longitude}`,
                            elevation: "—",
                            terrainType: "—",
                            timezone: "—",
                          });
                        }
                      }}
                    />
                  </Suspense>
                </ClientOnly>
              </div>
              <div className="bg-muted/40 min-w-0 border-t border-border p-4 lg:border-t-0 lg:border-l">
                <p className="text-card-title flex items-center gap-2">
                  <LocationIcon className="text-primary size-4 shrink-0" />
                  Selected Location
                </p>
                <p className="text-label mt-3 font-semibold">{draft.locationName}</p>
                <p className="text-helper mt-0.5">
                  {formatCoordinates(draft.latitude, draft.longitude)}
                </p>
                <dl className="mt-3 space-y-2.5">
                  <div>
                    <dt className="text-helper">Elevation (from SRTM)</dt>
                    <dd className="text-label text-primary font-semibold">
                      {draft.elevation}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-helper">Terrain Type</dt>
                    <dd className="text-label">{draft.terrainType}</dd>
                  </div>
                  <div>
                    <dt className="text-helper">Timezone</dt>
                    <dd className="text-label">{draft.timezone}</dd>
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
