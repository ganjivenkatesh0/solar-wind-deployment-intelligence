import { LocationIcon } from "@/lib/icons";
import { accentFor, type CompareSite } from "@/lib/compare-sites-data";
import { cn } from "@/lib/utils";

function MetricBox({
  label,
  value,
  suffix,
  accent,
  emphasise,
}: {
  label: string;
  value: string;
  suffix?: string;
  accent: string;
  emphasise?: boolean;
}) {
  return (
    <div
      className="border-border min-w-0 rounded-lg border px-1.5 py-1.5"
      style={emphasise ? { backgroundColor: `color-mix(in oklch, ${accent} 8%, transparent)` } : undefined}
    >
      <p className="text-muted-foreground text-[8.5px] leading-[1.15] tracking-tight uppercase font-medium break-words whitespace-normal">
        {label}
      </p>
      <p className="mt-0.5 text-[12px] leading-4 font-bold whitespace-nowrap" style={{ color: emphasise ? accent : undefined }}>
        {value}
        {suffix ? <span className="text-muted-foreground ml-0.5 text-[9px] font-medium">{suffix}</span> : null}
      </p>
    </div>
  );
}

/** Horizontal row of site cards with imagery, coordinates and headline metrics. */
export function SiteCompareCards({
  sites,
  bestSiteId,
  selectedId,
  onSelect,
}: {
  sites: CompareSite[];
  bestSiteId?: string | undefined;
  selectedId?: string | undefined;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {sites.map((site, index) => {
        const accent = accentFor(index);
        const isBest = site.id === bestSiteId;
        const isSelected = site.id === selectedId;
        return (
          <button
            key={site.id}
            type="button"
            onClick={() => onSelect(site.id)}
            aria-pressed={isSelected}
            className={cn(
              "surface-card group min-w-0 overflow-hidden p-0 text-left transition-shadow hover:shadow-[var(--shadow-elevated)]",
              isSelected && "ring-2",
            )}
            style={isSelected ? { boxShadow: `0 0 0 2px ${accent.color}` } : undefined}
          >
            <div className="relative h-[104px] w-full overflow-hidden bg-muted">
              {site.image ? (
                <img
                  src={site.image}
                  alt={`${site.city}, ${site.state} site view`}
                  loading="lazy"
                  width={640}
                  height={512}
                  className="size-full object-cover"
                />
              ) : (
                <div
                  className="size-full"
                  style={{ background: `linear-gradient(135deg, ${accent.soft}, ${accent.color})` }}
                />
              )}
              <span
                className="absolute top-2 left-2 rounded-md px-2 py-0.5 text-[11px] font-semibold text-white"
                style={{ backgroundColor: accent.color }}
              >
                Site {index + 1}
              </span>
              {isBest ? (
                <span className="bg-primary absolute top-2 right-2 rounded-md px-2 py-0.5 text-[11px] font-semibold text-white">
                  Best Overall
                </span>
              ) : null}
            </div>

            <div className="min-w-0 px-3 pt-3 pb-3">
              <p className="flex min-w-0 items-center gap-1.5 text-[13px] font-semibold">
                <LocationIcon className="size-3.5 shrink-0" style={{ color: accent.color }} />
                <span className="truncate">
                  {site.city}, {site.state}
                </span>
              </p>
              <p className="text-helper mt-1 truncate">{site.coordinates}</p>

              <div className="mt-2.5 grid grid-cols-3 gap-1">
                <MetricBox
                  label="Score"
                  value={site.suitability.toFixed(1)}
                  suffix="/100"
                  accent={accent.color}
                  emphasise
                />
                <MetricBox label="Tech" value={site.technology} accent={accent.color} />
                <MetricBox
                  label="Capacity"
                  value={`${site.capacityMw.toFixed(1)} MW`}
                  accent={accent.color}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
