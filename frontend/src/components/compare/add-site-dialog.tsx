import { useState } from "react";
import { Check, Plus } from "lucide-react";

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
import { availableSites, type CompareSite } from "@/lib/compare-sites-data";
import { cn } from "@/lib/utils";

/** Site picker for "+ Add Site" — hides duplicates and blocks selection when full. */
export function AddSiteDialog({
  open,
  onOpenChange,
  selectedIds,
  remainingSlots,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  remainingSlots: number;
  onConfirm: (ids: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  const close = (next: boolean) => {
    if (!next) {
      setQuery("");
      setPicked([]);
    }
    onOpenChange(next);
  };

  const options = availableSites.filter(
    (site: CompareSite) =>
      !selectedIds.includes(site.id) &&
      `${site.city} ${site.state}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const toggle = (id: string) => {
    setPicked((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < remainingSlots
          ? [...prev, id]
          : prev,
    );
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Add site to comparison</DialogTitle>
          <DialogDescription>
            Select from your analysed locations. {remainingSlots} slot
            {remainingSlots === 1 ? "" : "s"} remaining.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search locations"
            className="pl-9"
          />
        </div>

        <div className="max-h-[280px] space-y-1.5 overflow-y-auto pr-1">
          {options.length ? (
            options.map((site) => {
              const active = picked.includes(site.id);
              return (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => toggle(site.id)}
                  className={cn(
                    "border-border flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors",
                    active ? "border-primary bg-primary-soft" : "hover:bg-muted",
                  )}
                >
                  <LocationIcon className="text-primary size-4 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold">{site.city}</span>
                    <span className="text-helper block truncate">
                      {site.state} · {site.suitability.toFixed(1)}/100 · {site.technology}
                    </span>
                  </span>
                  {active ? <Check className="text-primary size-4 shrink-0" /> : null}
                </button>
              );
            })
          ) : (
            <p className="text-helper px-1 py-6 text-center">No more sites available to add.</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => close(false)}>
            Cancel
          </Button>
          <Button
            disabled={!picked.length}
            onClick={() => {
              onConfirm(picked);
              close(false);
            }}
          >
            <Plus className="size-4" />
            Add {picked.length ? `${picked.length} ` : ""}Site
            {picked.length === 1 || !picked.length ? "" : "s"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
