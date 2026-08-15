import { CardPanel } from "./card-panel";
import { ScoreRing } from "./score-ring";
import { Button } from "@/components/ui/button";
import {
  EnvironmentalIcon,
  InfrastructureIcon,
  LandIcon,
  TerrainIcon,
  EnergyIcon,
} from "@/lib/icons";
import type { DashboardData } from "@/lib/dashboard-data";

const icons = {
  terrain: TerrainIcon,
  infrastructure: InfrastructureIcon,
  land: LandIcon,
  grid: EnergyIcon,
  environmental: EnvironmentalIcon,
} as const;

export function FeasibilityBreakdown({
  data,
  onViewDetails,
}: {
  data: DashboardData["feasibility"];
  onViewDetails: () => void;
}) {
  return (
    <CardPanel
      title="Technical Feasibility Breakdown"
      action={
        <Button variant="outline" size="sm" onClick={onViewDetails}>
          View Details
        </Button>
      }
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="flex flex-col items-center gap-1">
          <ScoreRing value={data.score} size={112} thickness={11}>
            <span>
              <span className="text-primary block text-xl font-bold">{data.score}</span>
              <span className="text-helper block">/{data.outOf}</span>
            </span>
          </ScoreRing>
          <p className="text-helper font-medium">Feasibility Score</p>
        </div>

        <ul className="min-w-0 flex-1 divide-y divide-border">
          {data.breakdown.map((row) => {
            const Icon = icons[row.icon];
            return (
              <li key={row.label} className="flex items-center gap-2 py-2">
                <Icon className="text-primary size-4 shrink-0" />
                <span className="text-label min-w-0 flex-1 truncate font-normal">{row.label}</span>
                <span className="text-label shrink-0 font-semibold">
                  {row.score}
                  <span className="text-helper inline"> /100</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </CardPanel>
  );
}
