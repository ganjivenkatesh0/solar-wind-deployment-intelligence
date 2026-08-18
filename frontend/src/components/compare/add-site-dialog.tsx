import { useEffect, useState } from "react";
import { Check, Loader2, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationIcon, SearchIcon } from "@/lib/icons";
import type { CompareSite } from "@/lib/compare-sites-data";
import { cn } from "@/lib/utils";

export type LocationSearchResult = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    district?: string;
    state?: string;
    country?: string;
  };
};

export function AddSiteDialog({
  open,
  onOpenChange,
  selectedIds,
  remainingSlots,
  onConfirmLocation,
  availableSites,
  loading = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  remainingSlots: number;
  onConfirmLocation: (location: LocationSearchResult) => Promise<void>;
  availableSites: CompareSite[];
  loading?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [picked, setPicked] = useState<LocationSearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    if (!open) return;

    const value = query.trim();

    if (value.length < 2) {
      setResults([]);
      setSearching(false);
      setSearchError("");
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setSearching(true);
      setSearchError("");

      try {
        const params = new URLSearchParams({
          q: value,
          format: "jsonv2",
          addressdetails: "1",
          limit: "8",
          countrycodes: "in",
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
          throw new Error("Location search failed");
        }

        const data = (await response.json()) as LocationSearchResult[];

        setResults(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("[Compare Sites] Location search failed:", error);
        setResults([]);
        setSearchError("Unable to search locations right now.");
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, query]);

  const close = (next: boolean) => {
    if (!next) {
      setQuery("");
      setResults([]);
      setPicked(null);
      setSearchError("");
      setAdding(false);
    }

    onOpenChange(next);
  };

  const selectLocation = (location: LocationSearchResult) => {
    if (remainingSlots <= 0) return;
    setPicked(location);
  };

  const addSelectedLocation = async () => {
    if (!picked || adding || remainingSlots <= 0) return;

    setAdding(true);

    try {
      await onConfirmLocation(picked);
      close(false);
    } catch (error) {
      console.error("[Compare Sites] Unable to add location:", error);
    } finally {
      setAdding(false);
    }
  };

  const recentOptions = availableSites.filter(
    (site) =>
      !selectedIds.includes(site.id) &&
      `${site.city} ${site.state} ${site.shortLabel}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add site to comparison</DialogTitle>
          <DialogDescription>
            Search any location in India and add its real analysis to the comparison.
            {remainingSlots} slot{remainingSlots === 1 ? "" : "s"} remaining.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPicked(null);
            }}
            placeholder="Search city, district or address"
            className="pl-9 pr-9"
            autoFocus
          />
          {searching ? (
            <Loader2 className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin" />
          ) : null}
        </div>

        {searchError ? (
          <p className="text-destructive text-helper px-1">{searchError}</p>
        ) : null}

        <div className="max-h-[320px] space-y-1.5 overflow-y-auto pr-1">
          {picked ? (
            <button
              type="button"
              onClick={() => setPicked(null)}
              className="border-primary bg-primary-soft flex w-full items-center gap-2.5 rounded-xl border px-3 py-3 text-left"
            >
              <LocationIcon className="text-primary size-5 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold">
                  {picked.address?.city ||
                    picked.address?.town ||
                    picked.address?.village ||
                    picked.address?.municipality ||
                    picked.address?.district ||
                    picked.display_name.split(",")[0]}
                </span>
                <span className="text-helper block truncate">
                  {picked.display_name}
                </span>
                <span className="text-helper block">
                  {Number(picked.lat).toFixed(4)}°, {Number(picked.lon).toFixed(4)}°
                </span>
              </span>
              <Check className="text-primary size-5 shrink-0" />
            </button>
          ) : searching ? (
            <p className="text-helper px-1 py-8 text-center">
              Searching locations...
            </p>
          ) : query.trim().length >= 2 && results.length ? (
            results.map((location) => {
              const city =
                location.address?.city ||
                location.address?.town ||
                location.address?.village ||
                location.address?.municipality ||
                location.address?.district ||
                location.display_name.split(",")[0];

              return (
                <button
                  key={location.place_id}
                  type="button"
                  onClick={() => selectLocation(location)}
                  className={cn(
                    "border-border flex w-full items-center gap-2.5 rounded-xl border px-3 py-3 text-left transition-colors",
                    "hover:border-primary hover:bg-primary-soft",
                  )}
                >
                  <LocationIcon className="text-primary size-4 shrink-0" />

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold">
                      {city}
                    </span>
                    <span className="text-helper block truncate">
                      {location.display_name}
                    </span>
                    <span className="text-helper block">
                      {Number(location.lat).toFixed(4)}°,{" "}
                      {Number(location.lon).toFixed(4)}°
                    </span>
                  </span>
                </button>
              );
            })
          ) : query.trim().length >= 2 ? (
            <p className="text-helper px-1 py-8 text-center">
              No locations found. Try another city or district.
            </p>
          ) : recentOptions.length ? (
            <>
              <p className="text-helper px-1 pb-1">
                Previously analysed locations
              </p>

              {recentOptions.map((site) => (
                <button
                  key={site.id}
                  type="button"
                  onClick={() =>
                    selectLocation({
                      place_id: Number(site.id.length),
                      lat: String(site.latitude),
                      lon: String(site.longitude),
                      display_name: site.shortLabel,
                      address: {
                        city: site.city,
                        state: site.state,
                        country: "India",
                      },
                    })
                  }
                  className="border-border hover:bg-muted flex w-full items-center gap-2.5 rounded-xl border px-3 py-3 text-left"
                >
                  <LocationIcon className="text-primary size-4 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold">
                      {site.city}
                    </span>
                    <span className="text-helper block truncate">
                      {site.state} · {site.suitability.toFixed(1)}/100 ·{" "}
                      {site.technology}
                    </span>
                  </span>
                </button>
              ))}
            </>
          ) : (
            <p className="text-helper px-1 py-8 text-center">
              Start typing a city, district or address.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => close(false)} disabled={adding}>
            Cancel
          </Button>

          <Button
            disabled={!picked || adding || remainingSlots <= 0}
            onClick={() => void addSelectedLocation()}
          >
            {adding ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}

            {adding ? "Analysing..." : "Add Site"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
