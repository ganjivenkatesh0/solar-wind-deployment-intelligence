import { Button } from "@/components/ui/button";
import { SolarIcon, WindIcon } from "@/lib/icons";
import { ResourceAssessmentCard } from "./resource-assessment-card";
import { SiteContextCard } from "./site-context-card";
import { toneSoft, toneText } from "./resource-primitives";
import { resourcesData, type ResourcesData } from "@/lib/resources-data";
import { cn } from "@/lib/utils";

export function ResourcesTab({
  data = resourcesData,
  onViewAllSources,
  onViewTerrain,
  onViewInfrastructure,
}: {
  data?: ResourcesData;
  onViewAllSources: () => void;
  onViewTerrain: () => void;
  onViewInfrastructure: () => void;
}) {
  return (
    <div className="min-w-0 space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-card-title">Resource Assessment</h2>
          <p className="text-helper">Detailed resource availability and quality analysis</p>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-helper font-medium">Data Sources</span>
          {data.dataSources.map((source) => (
            <span
              key={source.name}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                toneSoft[source.tone],
                toneText[source.tone],
              )}
            >
              <span className="bg-current size-1.5 rounded-full" />
              {source.name}
            </span>
          ))}
          <Button variant="outline" size="sm" onClick={onViewAllSources}>
            View All Sources
          </Button>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-2">
        <ResourceAssessmentCard
          title="Solar Resource Assessment"
          icon={SolarIcon}
          iconClass="text-solar"
          data={data.solar}
        />
        <ResourceAssessmentCard
          title="Wind Resource Assessment"
          icon={WindIcon}
          iconClass="text-wind"
          data={data.wind}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SiteContextCard
          title="Land & Terrain"
          description="Topography and land suitability analysis"
          actionLabel="View Terrain Details"
          onAction={onViewTerrain}
          metrics={data.terrain}
        />
        <SiteContextCard
          title="Infrastructure Proximity"
          description="Distance to nearest infrastructure"
          actionLabel="View Infrastructure"
          onAction={onViewInfrastructure}
          metrics={data.infrastructure}
        />
      </div>
    </div>
  );
}
