import { lazy, Suspense } from "react";
import { ClientOnly, useNavigate } from "@tanstack/react-router";

import { CardPanel } from "./card-panel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData } from "@/lib/dashboard-data";

const SiteMap = lazy(() => import("./site-map"));

export function SiteLocationCard({ site }: { site: DashboardData["site"] }) {
  const navigate = useNavigate();

  return (
    <CardPanel
      title="Site Location"
      action={
        <Button variant="outline" size="sm" onClick={() => navigate({ to: "/map-explorer" })}>
          View on Map
        </Button>
      }
    >
      <div className="h-[220px] w-full overflow-hidden rounded-xl border border-border">
        <ClientOnly fallback={<Skeleton className="size-full" />}>
          <Suspense fallback={<Skeleton className="size-full" />}>
            <SiteMap
              latitude={site.latitude}
              longitude={site.longitude}
              label={site.location.split(",")[0] ?? site.location}
            />
          </Suspense>
        </ClientOnly>
      </div>
      <p className="text-helper mt-2">{site.coordinatesLabel}</p>
    </CardPanel>
  );
}
