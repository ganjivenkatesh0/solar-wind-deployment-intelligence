import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { createDashboardData, type LatestAnalysisRequest } from "@/lib/dashboard-data";
import { buildDashboardSectionData } from "@/lib/dashboard-section-data";
import type { AnalysisResponse } from "@/lib/api/analysis";
import { downloadAnalysisHistoryFile, listAnalysisHistory } from "@/lib/api/analysis-history";
import { saveBlobDownload } from "@/lib/api/client";

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
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [data, setData] = useState<ReturnType<typeof createDashboardData> | null>(null);
  const [sectionData, setSectionData] = useState<ReturnType<
    typeof buildDashboardSectionData
  > | null>(null);

  const downloadCurrentReport = async () => {
    try {
      const history = await listAnalysisHistory(1, 100);
      const currentId = sessionStorage.getItem("latestAnalysisId");
      const latest =
        history.items.find(
          (item) => item.analysis_id === currentId && item.status === "Completed",
        ) ?? history.items.find((item) => item.status === "Completed");
      if (!latest) {
        toast.info("No completed analysis is available to download.");
        return;
      }

      const { blob, filename } = await downloadAnalysisHistoryFile(latest.analysis_id);
      saveBlobDownload(blob, filename);
      toast.success("Report downloaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to download report.");
    }
  };

  useEffect(() => {
    try {
      setLoading(true);
      setDataError(null);

      if (typeof window === "undefined") {
        return;
      }

      const storedResult = sessionStorage.getItem("latestAnalysisResult");
      const storedRequest = sessionStorage.getItem("latestAnalysisRequest");

      if (!storedResult || !storedRequest) {
        setData(null);
        return;
      }

      const result = JSON.parse(storedResult) as AnalysisResponse;
      const request = JSON.parse(storedRequest) as LatestAnalysisRequest;

      setData(createDashboardData(result, request));
      setSectionData(buildDashboardSectionData(result, request));
    } catch (error) {
      setData(null);
      setDataError(
        error instanceof Error ? error.message : "We couldn't load the latest analysis results.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const notReady = (section: string) => () =>
    toast.info(`${section} details are coming in a later release.`);

  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Dashboard"
          description="Overview of your latest renewable energy site analyses."
        />
        <LoadingState message="Loading your latest analysis…" className="min-h-[360px]" />
      </PageContainer>
    );
  }

  if (dataError) {
    return (
      <PageContainer>
        <PageHeader
          title="Dashboard"
          description="Overview of your latest renewable energy site analyses."
        />
        <ErrorState
          title="Unable to load analysis"
          description={dataError}
          onRetry={() => window.location.reload()}
          className="min-h-[360px]"
        />
      </PageContainer>
    );
  }

  if (!data || !sectionData) {
    return (
      <PageContainer>
        <PageHeader
          title="Dashboard"
          description="Overview of your latest renewable energy site analyses."
        />
        <EmptyState
          title="No analysis available"
          description="Run a new site analysis to see suitability, energy, feasibility and financial results here."
          action={
            <Button onClick={() => navigate({ to: "/new-analysis" })}>Start New Analysis</Button>
          }
          className="min-h-[360px]"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Overview of your latest renewable energy site analyses."
      />

      <div className="space-y-4">
        <SummaryCards site={data.site} onDownload={() => void downloadCurrentReport()} />

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
                <ResourceAssessment
                  data={data.resources}
                  onViewDetails={() => setTab("resources")}
                />
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
              data={data.resourcesDetails}
              onViewAllSources={notReady("Data source")}
              onViewTerrain={notReady("Terrain")}
              onViewInfrastructure={notReady("Infrastructure")}
            />
          ) : tab === "feasibility" ? (
            <FeasibilityTab
              data={sectionData.feasibilityDetails}
              onExport={() => void downloadCurrentReport()}
              onDownload={() => void downloadCurrentReport()}
              onViewRecommendations={notReady("Recommendation")}
            />
          ) : tab === "energy" ? (
            <EnergyFinancialTab
              data={sectionData.energyFinancialDetails}
              onExport={() => void downloadCurrentReport()}
              onDownload={() => void downloadCurrentReport()}
            />
          ) : tab === "ai" ? (
            <AiInsightsTab
              data={sectionData.aiInsightsDetails}
              onExport={() => void downloadCurrentReport()}
              onDownload={() => void downloadCurrentReport()}
              onViewSimilar={notReady("Similar project")}
              onViewReport={notReady("Detailed AI report")}
            />
          ) : tab === "recommendation" ? (
            <RecommendationTab
              data={sectionData.recommendationDetails}
              onExport={() => void downloadCurrentReport()}
              onDownload={() => void downloadCurrentReport()}
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
