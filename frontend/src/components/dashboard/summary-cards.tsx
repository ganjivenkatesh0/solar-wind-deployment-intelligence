import { Button } from "@/components/ui/button";
import { DownloadIcon, LocationIcon, LandIcon, FinancialIcon, DateIcon } from "@/lib/icons";
import type { DashboardData } from "@/lib/dashboard-data";

function SummaryCard({
  icon,
  iconClass,
  label,
  value,
  caption,
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: string;
  caption?: string;
}) {
  return (
    <div className="surface-card flex min-w-0 items-center gap-3 px-4 py-3 transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <span className={`grid size-9 shrink-0 place-items-center rounded-full ${iconClass}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-helper">{label}</p>
        <p className="text-label truncate font-semibold">{value}</p>
        {caption ? <p className="text-helper truncate">{caption}</p> : null}
      </div>
    </div>
  );
}

export function SummaryCards({
  site,
  onDownload,
}: {
  site: DashboardData["site"];
  onDownload: () => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
      <SummaryCard
        icon={<LocationIcon className="size-4" />}
        iconClass="bg-primary-soft text-primary"
        label="Location"
        value={site.location}
        caption={site.coordinatesLabel}
      />
      <SummaryCard
        icon={<LandIcon className="size-4" />}
        iconClass="bg-success-soft text-primary"
        label="Land Area"
        value={site.landAreaLabel}
      />
      <SummaryCard
        icon={<FinancialIcon className="size-4" />}
        iconClass="bg-solar-soft text-warning-foreground"
        label="Budget"
        value={site.budgetLabel}
      />
      <SummaryCard
        icon={<DateIcon className="size-4" />}
        iconClass="bg-wind-soft text-wind"
        label="Analysis Time"
        value={site.analysisTimeLabel}
      />
      <div className="surface-card grid place-items-center p-2">
        <Button className="w-full gap-2" onClick={onDownload}>
          <DownloadIcon className="size-4" />
          Download Report
        </Button>
      </div>
    </div>
  );
}
