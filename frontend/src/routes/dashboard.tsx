import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { AiInsightsTab } from "@/components/dashboard/ai-insights/ai-insights-tab";
import { DashboardTabs, type DashboardTabId } from "@/components/dashboard/dashboard-tabs";
import { DeploymentRecommendation } from "@/components/dashboard/deployment-recommendation";
import { EnergyAnalysis } from "@/components/dashboard/energy-analysis";
import { EnergyFinancialTab } from "@/components/dashboard/energy-financial/energy-financial-tab";
import { FeasibilityBreakdown } from "@/components/dashboard/feasibility-breakdown";
import { FeasibilityTab } from "@/components/dashboard/feasibility/feasibility-tab";
import { FinancialAnalysis } from "@/components/dashboard/financial-analysis";
import {
  EnergyGenerationCard,
  FeasibilityCard,
  SuitabilityCard,
  TechnologyCard,
} from "@/components/dashboard/highlight-cards";
import { MapPreviewTab } from "@/components/dashboard/map/map-preview-tab";
import { RecommendationTab } from "@/components/dashboard/recommendation/recommendation-tab";
import { ResourceAssessment } from "@/components/dashboard/resource-assessment";
import { ResourcesTab } from "@/components/dashboard/resources/resources-tab";

import { SiteLocationCard } from "@/components/dashboard/site-location-card";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { dashboardData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Solar & Wind Deployment Intelligence" },
      {
        name: "description",
        content:
          "Site analysis results: suitability score, recommended technology, energy generation, feasibility and financial outlook.",
      },
      { property: "og:title", content: "Dashboard — Solar & Wind Deployment Intelligence" },
      {
        property: "og:description",
        content:
          "Site analysis results: suitability score, recommended technology, energy generation, feasibility and financial outlook.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<DashboardTabId>("overview");
  const data = dashboardData;

  const notReady = (section: string) => () =>
    toast.info(`${section} details are coming in a later release.`);

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Overview of your latest renewable energy site analyses."
      />

      <div className="space-y-4">
        <SummaryCards
          site={data.site}
          onDownload={() => toast.success("Report export will be available once the analysis API is connected.")}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SuitabilityCard data={data.suitability} />
          <TechnologyCard data={data.technology} />
          <FeasibilityCard data={data.feasibility} />
          <EnergyGenerationCard data={data.energy} />
        </div>

        <DashboardTabs value={tab} onChange={setTab}>
          {tab === "overview" ? (
            <div className="space-y-4">
              <div className="grid gap-4 xl:grid-cols-[1.35fr_1.1fr_1.1fr]">
                <ResourceAssessment data={data.resources} onViewDetails={() => setTab("resources")} />
                <FeasibilityBreakdown
                  data={data.feasibility}
                  onViewDetails={() => setTab("feasibility")}
                />
                <SiteLocationCard site={data.site} />
              </div>

              <div className="grid gap-4 xl:grid-cols-[1fr_1.05fr_1.05fr]">
                <EnergyAnalysis data={data.energy} />
                <FinancialAnalysis data={data.financial} />
                <AIInsights data={data.ai} onViewDetails={notReady("AI model")} />
              </div>

              <DeploymentRecommendation data={data.recommendation} />
            </div>
          ) : tab === "resources" ? (
            <ResourcesTab
              onViewAllSources={notReady("Data source")}
              onViewTerrain={notReady("Terrain")}
              onViewInfrastructure={notReady("Infrastructure")}
            />
          ) : tab === "feasibility" ? (
            <FeasibilityTab
              onExport={notReady("Feasibility report export")}
              onDownload={() =>
                toast.success("Report export will be available once the analysis API is connected.")
              }
              onViewRecommendations={notReady("Recommendation")}
            />
          ) : tab === "energy" ? (
            <EnergyFinancialTab
              onExport={notReady("Financial report export")}
              onDownload={() =>
                toast.success("Report export will be available once the analysis API is connected.")
              }
            />
          ) : tab === "ai" ? (
            <AiInsightsTab
              onExport={notReady("AI insights report export")}
              onDownload={() =>
                toast.success("Report export will be available once the analysis API is connected.")
              }
              onViewSimilar={notReady("Similar project")}
              onViewReport={notReady("Detailed AI report")}
            />
          ) : tab === "recommendation" ? (
            <RecommendationTab
              onExport={notReady("Recommendation report export")}
              onDownload={() =>
                toast.success("Report export will be available once the analysis API is connected.")
              }
              onCompareOptions={() => navigate({ to: "/compare-sites" })}
              onViewRiskAnalysis={() => setTab("feasibility")}
              onProceed={() => navigate({ to: "/new-analysis/project-parameters" })}
            />
          ) : (
            <MapPreviewTab />
          )}
        </DashboardTabs>
      </div>
    </PageContainer>
  );
}
