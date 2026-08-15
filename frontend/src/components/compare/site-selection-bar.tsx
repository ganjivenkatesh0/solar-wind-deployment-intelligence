import { Plus, RefreshCw, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LocationIcon } from "@/lib/icons";
import { accentFor, maxCompareSites, type CompareSite } from "@/lib/compare-sites-data";
import { cn } from "@/lib/utils";

/** "Select Sites to Compare (Max 4)" panel with chips, add control and actions. */
export function SiteSelectionBar({
  sites,
  onRemove,
  onAdd,
  onClearAll,
  onUpdate,
}: {
  sites: CompareSite[];
  onRemove: (id: string) => void;
  onAdd: () => void;
  onClearAll: () => void;
  onUpdate: () => void;
}) {
  const canAdd = sites.length < maxCompareSites;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
      <div className="surface-card min-w-0 px-4 pt-3.5 pb-4">
        <p className="text-helper mb-2.5 font-semibold">
          Select Sites to Compare (Max {maxCompareSites})
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {sites.map((site, index) => {
            const accent = accentFor(index);
            return (
              <div
                key={site.id}
                className="border-border bg-card flex min-w-0 items-center gap-2.5 rounded-xl border px-3 py-2.5"
              >
                <LocationIcon
                  className="size-4 shrink-0"
                  style={{ color: accent.color }}
                  strokeWidth={2}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold">Site {index + 1}</p>
                  <p className="text-helper truncate">{site.shortLabel}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(site.id)}
                  aria-label={`Remove ${site.city} from comparison`}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground grid size-6 shrink-0 place-items-center rounded-md transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            );
          })}

          {canAdd ? (
            <button
              type="button"
              onClick={onAdd}
              className={cn(
                "border-primary/40 text-primary hover:bg-primary-soft flex min-h-[62px] min-w-0 items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-2.5 text-[13px] font-medium transition-colors",
              )}
            >
              <Plus className="size-4" />
              Add Site
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <Button className="w-full" onClick={onUpdate}>
          <RefreshCw className="size-4" />
          Update Comparison
        </Button>
        <Button variant="outline" className="w-full" onClick={onClearAll} disabled={!sites.length}>
          <Trash2 className="size-4" />
          Clear All
        </Button>
      </div>
    </div>
  );
}
