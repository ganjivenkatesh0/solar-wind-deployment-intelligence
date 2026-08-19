import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";

import { PageContainer, PageHeader } from "@/components/layout/page-container";
import {
  deleteAnalysisHistory,
  downloadAnalysisHistoryFile,
  getAnalysisHistory,
  listAnalysisHistory,
  type AnalysisHistoryApiRecord,
} from "@/lib/api/analysis-history";
import { saveBlobDownload } from "@/lib/api/client";
import {
  AnalysisDetailsPanel,
  PerformanceSnapshotPanel,
} from "@/components/history/analysis-details-panel";
import { HistorySummaryCard, matchesQuery } from "@/components/history/history-primitives";
import { AnalysisHistoryTable, HistoryPagination } from "@/components/history/history-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/states";
import {
  DateIcon,
  DownloadIcon,
  FilterIcon,
  SearchIcon,
} from "@/lib/icons";
import type {
  AnalysisHistorySummary,
  AnalysisRecord,
} from "@/lib/analysis-history-data";
import {
  defaultAnalysisDraft,
  defaultParametersDraft,
  defaultPreferencesDraft,
  saveDraft,
  saveParametersDraft,
  savePreferencesDraft,
  type AnalysisDraft,
  type ParametersDraft,
  type PreferencesDraft,
} from "@/lib/analysis-form";

export const Route = createFileRoute("/analysis-history")({
  head: () => ({
    meta: [
      { title: "Analysis History — Solar & Wind Deployment Intelligence" },
      {
        name: "description",
        content:
          "View and manage all your past renewable energy site analyses, suitability scores, recommended technology and reports.",
      },
      { property: "og:title", content: "Analysis History — Solar & Wind Deployment Intelligence" },
      {
        property: "og:description",
        content:
          "View and manage all your past renewable energy site analyses, suitability scores, recommended technology and reports.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalysisHistoryPage,
});


function clampScore(value: number) {
  return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
}

function mapHistoryRecord(item: AnalysisHistoryApiRecord): AnalysisRecord {
  const response = item.response_data ?? {};
  const deploymentPlan =
    typeof response.deployment_plan === "object" &&
    response.deployment_plan !== null
      ? (response.deployment_plan as Record<string, unknown>)
      : {};

  const solarFeatures =
    typeof response.solar_features === "object" &&
    response.solar_features !== null
      ? (response.solar_features as Record<string, unknown>)
      : {};

  const windAssessment =
    typeof response.wind_assessment === "object" &&
    response.wind_assessment !== null
      ? (response.wind_assessment as Record<string, unknown>)
      : {};

  const technical =
    typeof response.technical_feasibility === "object" &&
    response.technical_feasibility !== null
      ? (response.technical_feasibility as Record<string, unknown>)
      : {};

  const solarIrradiance = Number(solarFeatures.solar_irradiance ?? 0);
  const windCapacityFactor = Number(windAssessment.capacity_factor ?? 0);

  const solarScore = clampScore(solarIrradiance * 10);
  const windScore = clampScore(
    windCapacityFactor <= 1
      ? windCapacityFactor * 100
      : windCapacityFactor,
  );

  const recommended = item.recommended_deployment || "Not Recommended";

  const technology: "Solar" | "Wind" | "Hybrid" =
    recommended.toLowerCase().includes("hybrid")
      ? "Hybrid"
      : recommended.toLowerCase().includes("wind")
        ? "Wind"
        : "Solar";

  const capacity = Number(deploymentPlan.recommended_capacity_mw ?? 0);

  const created = new Date(item.created_at);

  const dateLabel = Number.isNaN(created.getTime())
    ? "—"
    : created.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

  const timeLabel = Number.isNaN(created.getTime())
    ? "—"
    : created.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });

  return {
    id: item.analysis_id,
    requestData: {
      latitude: item.latitude,
      longitude: item.longitude,
      location_name: item.location_name,
      land_area_hectares: item.land_area_hectares,
      available_budget: item.available_budget,
      project_type: item.project_type,
      installation_type: item.installation_type,
    },
    responseData: response,
    location:
      item.location_name ||
      `${item.latitude.toFixed(4)}°, ${item.longitude.toFixed(4)}°`,
    coordinatesLabel:
      `${item.latitude.toFixed(4)}° N, ${item.longitude.toFixed(4)}° E`,
    dateLabel,
    timeLabel,
    score: Number(item.overall_site_score ?? 0),
    technology,
    capacityLabel: capacity > 0 ? `${capacity.toFixed(1)} MW` : "—",
    status:
      item.status === "Failed" || item.status === "Running"
        ? item.status
        : "Completed",
    notes:
      typeof response.recommendation_reason === "string"
        ? response.recommendation_reason
        : undefined,
    details: {
      landAreaLabel: `${item.land_area_hectares.toLocaleString("en-US")} hectares`,
      budgetLabel: `$${item.available_budget.toLocaleString("en-US")}`,
      projectType:
        item.project_type.charAt(0).toUpperCase() +
        item.project_type.slice(1) +
        " Project",
      minFeasibilityLabel: "—",
      riskTolerance: "—",
    },
    radar: [
      { dimension: "Solar Resource", score: solarScore },
      { dimension: "Wind Resource", score: windScore },
      {
        dimension: "Terrain & Topography",
        score: clampScore(Number(response.terrain_score ?? 0)),
      },
      {
        dimension: "Infrastructure",
        score: clampScore(Number(response.infrastructure_score ?? 0)),
      },
      {
        dimension: "Economic",
        score: clampScore(Number(response.economic_score ?? 0)),
      },
      {
        dimension: "Technical Feasibility",
        score: clampScore(Number(technical.feasibility_score ?? 0)),
      },
    ],
  };
}

function AnalysisHistoryPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [pendingDelete, setPendingDelete] = useState<AnalysisRecord | null>(null);

  const [dateFilter, setDateFilter] = useState<
    "all" | "7days" | "30days" | "month"
  >("all");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "Completed" | "Failed" | "Running"
  >("all");

  const [technologyFilter, setTechnologyFilter] = useState<
    "all" | "Solar" | "Wind" | "Hybrid"
  >("all");

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        setLoading(true);
        setLoadError(null);

        const response = await listAnalysisHistory(1, 100);
        const mapped = response.items.map(mapHistoryRecord);

        if (!active) return;

        setRecords(mapped);
        setSelectedId(mapped[0]?.id ?? "");
      } catch (error) {
        if (!active) return;

        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load analysis history.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadHistory();

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();

    return records.filter((record) => {
      if (!matchesQuery(record, query)) {
        return false;
      }

      if (
        statusFilter !== "all" &&
        record.status !== statusFilter
      ) {
        return false;
      }

      if (
        technologyFilter !== "all" &&
        record.technology !== technologyFilter
      ) {
        return false;
      }

      if (dateFilter !== "all") {
        const recordDate = new Date(
          `${record.dateLabel} ${record.timeLabel}`,
        );

        if (Number.isNaN(recordDate.getTime())) {
          return false;
        }

        const diffMs = now.getTime() - recordDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (dateFilter === "7days" && (diffDays < 0 || diffDays > 7)) {
          return false;
        }

        if (dateFilter === "30days" && (diffDays < 0 || diffDays > 30)) {
          return false;
        }

        if (
          dateFilter === "month" &&
          (
            recordDate.getMonth() !== now.getMonth() ||
            recordDate.getFullYear() !== now.getFullYear()
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    records,
    query,
    dateFilter,
    statusFilter,
    technologyFilter,
  ]);
  useEffect(() => {
    setPage(1);
  }, [query, dateFilter, statusFilter, technologyFilter, rowsPerPage]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * rowsPerPage;
  const rows = filtered.slice(start, start + rowsPerPage);
  const selected = filtered.find((r) => r.id === selectedId) ?? rows[0] ?? filtered[0] ?? null;

  const rangeLabel = filtered.length
    ? `Showing ${start + 1} to ${Math.min(start + rowsPerPage, filtered.length)} of ${filtered.length} results`
    : "No results";

  function handleDuplicate(record: AnalysisRecord) {
    const request = record.requestData ?? {};

    const latitude = Number(request.latitude ?? "");
    const longitude = Number(request.longitude ?? "");
    const landArea = Number(request.land_area_hectares ?? "");
    const budget = Number(request.available_budget ?? "");

    const projectType =
      typeof request.project_type === "string"
        ? request.project_type
        : defaultParametersDraft.projectType;

    const installationType =
      typeof request.installation_type === "string"
        ? request.installation_type
        : defaultParametersDraft.installationType;

    const locationName =
      typeof request.location_name === "string"
        ? request.location_name
        : record.location;

    const siteDraft: AnalysisDraft = {
      ...defaultAnalysisDraft,
      latitude: Number.isFinite(latitude)
        ? latitude.toFixed(4)
        : defaultAnalysisDraft.latitude,
      longitude: Number.isFinite(longitude)
        ? longitude.toFixed(4)
        : defaultAnalysisDraft.longitude,
      landArea: Number.isFinite(landArea)
        ? String(landArea)
        : defaultAnalysisDraft.landArea,
      budget: Number.isFinite(budget)
        ? budget.toLocaleString("en-US")
        : defaultAnalysisDraft.budget,
      locationName,
    };

    const parametersDraft: ParametersDraft = {
      ...defaultParametersDraft,
      projectType,
      installationType,
    };

    const preferencesDraft: PreferencesDraft = {
      ...defaultPreferencesDraft,
    };

    saveDraft(siteDraft);
    saveParametersDraft(parametersDraft);
    savePreferencesDraft(preferencesDraft);

    toast.success("Analysis duplicated", {
      description: "The previous analysis has been copied into a new draft.",
    });

    navigate({ to: "/new-analysis" });
  }

  async function handleView(record: AnalysisRecord) {
    setSelectedId(record.id);

    try {
      const detail = await getAnalysisHistory(record.id);

      sessionStorage.setItem(
        "latestAnalysisResult",
        JSON.stringify(detail.response_data ?? {}),
      );

      sessionStorage.setItem(
        "latestAnalysisRequest",
        JSON.stringify(detail.request_data ?? record.requestData ?? {}),
      );

      sessionStorage.setItem(
        "latestAnalysisId",
        detail.analysis_id,
      );

      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Unable to load ${record.id}.`,
      );
    }
  }

  async function handleDownload(record: AnalysisRecord) {
    try {
      const { blob, filename } = await downloadAnalysisHistoryFile(record.id);
      saveBlobDownload(blob, filename);
      toast.success(`${record.id} report downloaded.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Unable to download ${record.id}.`,
      );
    }
  }

  function escapeCsv(value: unknown) {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  function exportHistory() {
    if (!records.length) {
      toast.info("No analysis records are available to export.");
      return;
    }

    const headers = [
      "Analysis ID",
      "Location",
      "Latitude",
      "Longitude",
      "Project Type",
      "Installation Type",
      "Land Area (hectares)",
      "Available Budget",
      "Suitability Score",
      "Recommended Deployment",
      "Status",
      "Created At",
    ];
    const csvRows = filtered.map((record) => {
      const requestData = record.requestData ?? {};
      const responseData = record.responseData ?? {};

      return [
        record.id,
        record.location,
        requestData["latitude"],
        requestData["longitude"],
        requestData["project_type"],
        requestData["installation_type"],
        requestData["land_area_hectares"],
        requestData["available_budget"],
        record.score,
        responseData["recommended_deployment"],
        record.status,
        `${record.dateLabel} ${record.timeLabel}`,
      ];
    });
    const csv = [headers, ...csvRows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");
    saveBlobDownload(
      new Blob([`\uFEFF${csv}\r\n`], { type: "text/csv;charset=utf-8" }),
      "analysis-history.csv",
    );
    toast.success("Analysis history exported.");
  }

  function handleRetry(record: AnalysisRecord) {
    toast.info(`Re-running analysis ${record.id}`, {
      description: `${record.location} has been queued for a new run.`,
    });
  }

  async function confirmDelete() {
    if (!pendingDelete) return;

    const id = pendingDelete.id;

    try {
      await deleteAnalysisHistory(id);

      setRecords((prev) => {
        const next = prev.filter((r) => r.id !== id);

        if (selectedId === id) {
          setSelectedId(next[0]?.id ?? "");
        }

        return next;
      });

      setCheckedIds((prev) => prev.filter((c) => c !== id));
      setPendingDelete(null);

      toast.success(`${id} deleted`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Unable to delete ${id}.`,
      );
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Analysis History"
        description="View and manage all your past site analysis and results."
        actions={
          <>
            <Select
              value={dateFilter}
              onValueChange={(value) =>
                setDateFilter(
                  value as "all" | "7days" | "30days" | "month",
                )
              }
            >
              <SelectTrigger className="h-10 w-auto min-w-[220px] gap-2 rounded-xl">
                <DateIcon className="size-4 shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="all">All saved analyses</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={
                statusFilter === "all"
                  ? "all"
                  : `status:${statusFilter}`
              }
              onValueChange={(value) => {
                if (value.startsWith("status:")) {
                  setStatusFilter(
                    value.replace("status:", "") as
                      | "Completed"
                      | "Failed"
                      | "Running",
                  );
                } else {
                  setStatusFilter("all");
                }
              }}
            >
              <SelectTrigger className="h-10 w-auto min-w-[125px] gap-2 rounded-xl">
                <FilterIcon className="size-4 shrink-0" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="status:Completed">Completed</SelectItem>
                <SelectItem value="status:Failed">Failed</SelectItem>
                <SelectItem value="status:Running">Running</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={
                technologyFilter === "all"
                  ? "all"
                  : `technology:${technologyFilter}`
              }
              onValueChange={(value) => {
                if (value.startsWith("technology:")) {
                  setTechnologyFilter(
                    value.replace("technology:", "") as
                      | "Solar"
                      | "Wind"
                      | "Hybrid",
                  );
                } else {
                  setTechnologyFilter("all");
                }
              }}
            >
              <SelectTrigger className="h-10 w-auto min-w-[145px] gap-2 rounded-xl">
                <span className="text-sm">
                  {technologyFilter === "all"
                    ? "All technologies"
                    : technologyFilter}
                </span>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="all">All technologies</SelectItem>
                <SelectItem value="technology:Solar">Solar</SelectItem>
                <SelectItem value="technology:Wind">Wind</SelectItem>
                <SelectItem value="technology:Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" aria-label="More history options">
              <ChevronDown className="size-4" />
            </Button>
          </>
        }
      />

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_284px]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {(() => {
              const completed = records.filter((r) => r.status === "Completed").length;
              const scores = records.map((r) => r.score).filter(Number.isFinite);
              const topScore = scores.length ? Math.max(...scores) : 0;
              const avgScore = scores.length
                ? scores.reduce((sum, score) => sum + score, 0) / scores.length
                : 0;

              const cards: AnalysisHistorySummary[] = [
                {
                  label: "Total Analyses",
                  value: String(records.length),
                  caption: "All saved analyses",
                  icon: "history",
                  tone: "primary",
                },
                {
                  label: "Completed",
                  value: String(completed),
                  caption: "Successfully completed",
                  icon: "check",
                  tone: "info",
                },
                {
                  label: "Top Suitability Score",
                  value: topScore.toFixed(1),
                  suffix: "/100",
                  caption: "Best score achieved",
                  icon: "star",
                  tone: "solar",
                },
                {
                  label: "Avg. Suitability Score",
                  value: avgScore.toFixed(1),
                  suffix: "/100",
                  caption: "Average of saved analyses",
                  icon: "chart",
                  tone: "hybrid",
                },
              ];

              return cards.map((card) => (
                <HistorySummaryCard key={card.label} card={card} />
              ));
            })()}
          </div>

          <div className="surface-card min-w-0 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="relative min-w-0 flex-1 sm:max-w-[320px]">
                <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by location, notes or analysis ID..."
                  aria-label="Search analyses"
                  className="rounded-full pl-9"
                />
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={exportHistory}
              >
                <DownloadIcon className="size-4" />
                Export History
              </Button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading your saved analyses...
              </div>
            ) : loadError ? (
              <div className="p-8 text-center text-destructive">
                {loadError}
              </div>
            ) : rows.length ? (
              <>
                <AnalysisHistoryTable
                  rows={rows}
                  selectedId={selected?.id ?? ""}
                  checkedIds={checkedIds}
                  onSelect={setSelectedId}
                  onToggleCheck={(id) =>
                    setCheckedIds((prev) =>
                      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
                    )
                  }
                  onToggleAll={(checked) =>
                    setCheckedIds(checked ? rows.map((r) => r.id) : [])
                  }
                  onView={handleView}
                  onDownload={handleDownload}
                  onRetry={handleRetry}
                  onDelete={setPendingDelete}
                />
                <HistoryPagination
                  page={currentPage}
                  pageCount={pageCount}
                  rangeLabel={rangeLabel}
                  rowsPerPage={rowsPerPage}
                  onPageChange={setPage}
                  onRowsPerPageChange={(n) => {
                    setRowsPerPage(n);
                    setPage(1);
                  }}
                />
              </>
            ) : (
              <EmptyState
                title="No analyses match your search"
                description="Try a different location, analysis ID or clear the search field."
                className="border-0 shadow-none"
              />
            )}
          </div>
        </div>

        {selected ? (
          <div className="flex min-w-0 flex-col gap-4">
            <AnalysisDetailsPanel
              record={selected}
              onViewReport={() => navigate({ to: "/reports" })}
              onDuplicate={() => handleDuplicate(selected)}
            />
            <PerformanceSnapshotPanel record={selected} />
          </div>
        ) : null}
      </div>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {pendingDelete?.id}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the analysis for {pendingDelete?.location} from your history. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete analysis</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
