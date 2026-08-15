import {
  CircleDollarSign,
  Info,
} from "lucide-react";

import {
  EnvironmentalIcon,
  FeasibilityIcon,
  InfrastructureIcon,
  LocationIcon,
  SolarIcon,
  TerrainIcon,
  WindIcon,
} from "@/lib/icons";
import {
  accentFor,
  comparisonCriteria,
  metricTabs,
  rankSites,
  type CompareSite,
} from "@/lib/compare-sites-data";
import { cn } from "@/lib/utils";

const criterionIcons = {
  solar: SolarIcon,
  wind: WindIcon,
  terrain: TerrainIcon,
  infrastructure: InfrastructureIcon,
  environmental: EnvironmentalIcon,
  economic: CircleDollarSign,
  feasibility: FeasibilityIcon,
} as const;

const criterionIconTone = {
  solar: "text-solar",
  wind: "text-wind",
  terrain: "text-primary",
  infrastructure: "text-hybrid",
  environmental: "text-success",
  economic: "text-solar",
  feasibility: "text-error",
} as const;

function ScoreCell({ value, accent }: { value: number; accent: string }) {
  return (
    <div className="min-w-[104px]">
      <p className="text-[13px] leading-5 font-semibold">{value}</p>
      <div className="bg-muted mt-1 h-1.5 w-full overflow-hidden rounded-full">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, value)}%`, backgroundColor: accent }}
        />
      </div>
    </div>
  );
}

function HeadRow({ sites, firstLabel, secondLabel }: { sites: CompareSite[]; firstLabel: string; secondLabel?: string }) {
  return (
    <thead>
      <tr className="bg-muted/50 border-border border-b">
        <th className="text-helper w-[230px] px-3 py-3 text-left font-semibold">{firstLabel}</th>
        {secondLabel ? (
          <th className="text-helper w-[80px] px-3 py-3 text-left font-semibold">{secondLabel}</th>
        ) : null}
        {sites.map((site, index) => (
          <th key={site.id} className="px-4 py-3 text-left">
            <p className="text-[13px] font-semibold">Site {index + 1}</p>
            <p className="text-helper font-normal">{site.shortLabel}</p>
          </th>
        ))}
      </tr>
    </thead>
  );
}

/** Overview tab: weighted evaluation criteria matrix with progress bars and rank row. */
export function OverviewComparisonTable({ sites }: { sites: CompareSite[] }) {
  const ranks = rankSites(sites);

  return (
    <div className="min-w-0 overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <HeadRow sites={sites} firstLabel="Evaluation Criteria" secondLabel="Weight" />
        <tbody>
          <tr className="border-border border-b">
            <td className="px-4 py-3">
              <span className="flex items-center gap-2 text-[13px] font-medium">
                <LocationIcon className="text-primary size-4" />
                Overall Suitability Score
              </span>
            </td>
            <td className="text-muted-foreground px-3 py-3 text-[13px]">—</td>
            {sites.map((site, index) => (
              <td key={site.id} className="px-4 py-3">
                <ScoreCell value={site.suitability} accent={accentFor(index).color} />
              </td>
            ))}
          </tr>

          {comparisonCriteria.map((criterion) => {
            const Icon = criterionIcons[criterion.icon];
            return (
              <tr key={criterion.id} className="border-border border-b">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2 text-[13px] font-medium">
                    <Icon className={cn("size-4", criterionIconTone[criterion.icon])} />
                    {criterion.label}
                    {criterion.hint ? (
                      <Info
                        className="text-muted-foreground size-3.5"
                        aria-label={criterion.hint}
                      >
                        <title>{criterion.hint}</title>
                      </Info>
                    ) : null}
                  </span>
                </td>
                <td className="px-3 py-3 text-[13px] font-medium">{criterion.weight}%</td>
                {sites.map((site, index) => (
                  <td key={site.id} className="px-4 py-3">
                    <ScoreCell value={site.scores[criterion.id]} accent={accentFor(index).color} />
                  </td>
                ))}
              </tr>
            );
          })}

          <tr className="bg-muted/40">
            <td className="px-4 py-3 text-[13px] font-semibold">Rank</td>
            <td className="text-muted-foreground px-3 py-3 text-[13px]">—</td>
            {sites.map((site, index) => (
              <td key={site.id} className="px-4 py-3">
                <span
                  className="grid size-6 place-items-center rounded-full text-[11px] font-bold text-white"
                  style={{ backgroundColor: accentFor(index).color }}
                >
                  {ranks.get(site.id)}
                </span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/** Resources / Feasibility / Financial / AI / Environmental tabs: metric matrix. */
export function MetricComparisonTable({
  sites,
  tabId,
}: {
  sites: CompareSite[];
  tabId: keyof typeof metricTabs;
}) {
  const rows = metricTabs[tabId]!.rows;
  return (
    <div className="min-w-0 overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <HeadRow sites={sites} firstLabel="Metric" />
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-border border-b last:border-0">
              <td className="px-4 py-3 text-[13px] font-medium">{row.label}</td>
              {sites.map((site, index) => (
                <td key={site.id} className="px-4 py-3">
                  <span className="text-[13px] font-semibold" style={{ color: accentFor(index).color }}>
                    {row.value(site)}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
