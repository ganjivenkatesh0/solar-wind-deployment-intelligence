import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FileText, Plus } from "lucide-react";
import { toast } from "sonner";

import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { ReportSummaryTile } from "@/components/reports/report-primitives";
import { ReportsPagination, ReportsTable } from "@/components/reports/reports-table";
import {
  ReportInsights,
  ReportPreviewPanel,
  ReportQuickActions,
} from "@/components/reports/report-preview-panel";
import { ReportTemplatesList } from "@/components/reports/report-templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import {
  deleteAnalysisHistory,
  downloadAnalysisHistory,
  listAnalysisHistory,
} from "@/lib/api/analysis-history";
import { FilterIcon, ReportIcon, SearchIcon } from "@/lib/icons";
import {
  mapAnalysisToReport,
  matchesReportFilter,
  matchesReportQuery,
  reportFilters,
  reportSorts,
  reportTabs,
  sortReports,
  type ReportFilterId,
  type ReportRecord,
  type ReportSortId,
  type ReportTabId,
} from "@/lib/reports-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Solar & Wind Deployment Intelligence" },
      {
        name: "description",
        content:
          "Generate, preview and manage comprehensive solar, wind and hybrid site assessment reports with insights and exports.",
      },
      { property: "og:title", content: "Reports — Solar & Wind Deployment Intelligence" },
      {
        property: "og:description",
        content:
          "Generate, preview and manage comprehensive solar, wind and hybrid site assessment reports with insights and exports.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const reportsQuery = useQuery({
    queryKey: ["reports"],
    queryFn: () => listAnalysisHistory(1, 100),
  });
  const reportRecords = useMemo(
    () => reportsQuery.data?.items.map(mapAnalysisToReport) ?? [],
    [reportsQuery.data],
  );
  const reportsSummary = useMemo(
    () => [
      {
        label: "Total Reports",
        value: String(reportRecords.length),
        caption: "All time generated",
        icon: "report" as const,
        tone: "primary" as const,
      },
      {
        label: "Completed",
        value: String(reportRecords.filter((record) => record.status === "Completed").length),
        caption: "Successfully generated",
        icon: "check" as const,
        tone: "info" as const,
      },
      {
        label: "In Progress",
        value: String(reportRecords.filter((record) => record.status === "In Progress").length),
        caption: "Currently generating",
        icon: "progress" as const,
        tone: "hybrid" as const,
      },
      {
        label: "Downloads",
        value: String(reportRecords.reduce((total, record) => total + record.downloads, 0)),
        caption: "Total downloads",
        icon: "download" as const,
        tone: "solar" as const,
      },
    ],
    [reportRecords],
  );
  const [tab, setTab] = useState<ReportTabId>("all");
  const [topQuery, setTopQuery] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ReportFilterId>("all");
  const [sort, setSort] = useState<ReportSortId>("newest");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [selectedId, setSelectedId] = useState("");

  const activeQuery = `${topQuery} ${query}`.trim();

  const filtered = useMemo(() => {
    const scoped = reportRecords.filter((record) => {
      if (tab === "mine") return record.ownership === "mine";
      if (tab === "shared") return record.ownership === "shared";
      return true;
    });
    const matched = scoped.filter(
      (record) =>
        matchesReportQuery(record, topQuery) &&
        matchesReportQuery(record, query) &&
        matchesReportFilter(record, filter),
    );
    return sortReports(matched, sort);
  }, [reportRecords, tab, topQuery, query, filter, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * rowsPerPage;
  const rows = filtered.slice(start, start + rowsPerPage);
  const rangeLabel = filtered.length
    ? `Showing ${start + 1} to ${Math.min(start + rowsPerPage, filtered.length)} of ${filtered.length} results`
    : "No results";

  const selected =
    reportRecords.find((r) => r.id === selectedId) ?? filtered[0] ?? reportRecords[0];

  const openReport = (record: ReportRecord) => {
    if (record.status === "In Progress") {
      toast.info(`${record.name} is still generating (${record.progress ?? 0}%).`);
      return;
    }
    navigate({ to: "/reports/$reportId", params: { reportId: record.id } });
  };

  const resetPage = () => setPage(1);

  const downloadReport = async (record: ReportRecord) => {
    try {
      const blob = await downloadAnalysisHistory(record.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${record.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${record.name}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to download report.");
    }
  };

  if (reportsQuery.isLoading) {
    return (
      <PageContainer>
        <LoadingState message="Loading reports…" />
      </PageContainer>
    );
  }

  if (reportsQuery.isError) {
    return (
      <PageContainer>
        <ErrorState
          description={reportsQuery.error.message}
          onRetry={() => void reportsQuery.refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Reports"
        description="Generate, view and manage comprehensive analysis reports."
        actions={
          <>
            <Button variant="outline" onClick={() => setTab("templates")}>
              <FileText className="size-4" />
              Report Templates
            </Button>
            <Button asChild>
              <Link to="/new-analysis">
                <Plus className="size-4" />
                Generate New Report
              </Link>
            </Button>
          </>
        }
      />

      <div className="mb-5">
        <label htmlFor="reports-top-search" className="sr-only">
          Search reports, locations or analysis ID
        </label>
        <div className="relative">
          <Input
            id="reports-top-search"
            className="pr-9"
            placeholder="Search reports, locations or analysis ID..."
            value={topQuery}
            onChange={(e) => {
              setTopQuery(e.target.value);
              resetPage();
            }}
          />
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4">
          <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {reportsSummary.map((card) => (
              <ReportSummaryTile key={card.label} card={card} />
            ))}
          </div>

          <section className="surface-card min-w-0 overflow-hidden">
            <div className="border-b border-border">
              <div
                role="tablist"
                aria-label="Report groups"
                className="flex min-w-0 gap-1 overflow-x-auto px-2"
              >
                {reportTabs.map((item) => {
                  const active = item.id === tab;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => {
                        setTab(item.id);
                        resetPage();
                      }}
                      className={cn(
                        "focus-visible:ring-ring/60 -mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[13px] font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none",
                        active
                          ? "border-primary text-primary"
                          : "text-muted-foreground hover:text-foreground border-transparent",
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {tab === "templates" ? (
              <ReportTemplatesList />
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3 p-4">
                  <div className="relative min-w-[220px] flex-1">
                    <label htmlFor="reports-search" className="sr-only">
                      Search by report name, location or analysis ID
                    </label>
                    <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      id="reports-search"
                      className="pl-9"
                      placeholder="Search by report name, location or analysis ID..."
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        resetPage();
                      }}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <FilterIcon className="size-4" />
                        Filter
                        {filter !== "all" ? (
                          <span className="text-primary ml-1 text-xs font-semibold">
                            · {filter}
                          </span>
                        ) : null}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter reports</DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={filter}
                        onValueChange={(value) => {
                          setFilter(value as ReportFilterId);
                          resetPage();
                        }}
                      >
                        {reportFilters.map((option) => (
                          <DropdownMenuRadioItem key={option.id} value={option.id}>
                            {option.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Select
                    value={sort}
                    onValueChange={(value) => {
                      setSort(value as ReportSortId);
                      resetPage();
                    }}
                  >
                    <SelectTrigger className="w-[200px]" aria-label="Sort reports">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportSorts.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          Sort by: {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {rows.length === 0 ? (
                  <div className="p-4">
                    <EmptyState
                      icon={<ReportIcon className="size-6" />}
                      title={
                        activeQuery || filter !== "all"
                          ? "No reports match your search"
                          : "No reports yet"
                      }
                      description={
                        activeQuery || filter !== "all"
                          ? "Try a different keyword, or clear the filters to see all reports."
                          : "Run a new analysis to generate your first report."
                      }
                      action={
                        activeQuery || filter !== "all" ? (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setQuery("");
                              setTopQuery("");
                              setFilter("all");
                              resetPage();
                            }}
                          >
                            Clear filters
                          </Button>
                        ) : (
                          <Button asChild>
                            <Link to="/new-analysis">Generate New Report</Link>
                          </Button>
                        )
                      }
                    />
                  </div>
                ) : (
                  <>
                    <ReportsTable
                      rows={rows}
                      selectedId={selected?.id ?? ""}
                      onSelect={setSelectedId}
                      onView={openReport}
                      onDownload={(record) => void downloadReport(record)}
                      onRetry={(record) =>
                        toast.info(`Regeneration is not supported for ${record.id}.`)
                      }
                      onShare={(record) => {
                        void navigator.clipboard.writeText(
                          `${window.location.origin}/reports/${record.id}`,
                        );
                        toast.success(`Link to ${record.id} copied.`);
                      }}
                      onDelete={(record) => {
                        if (!window.confirm(`Delete ${record.name}?`)) return;
                        void deleteAnalysisHistory(record.id)
                          .then(() => {
                            void queryClient.invalidateQueries({ queryKey: ["reports"] });
                            toast.success(`${record.name} deleted.`);
                          })
                          .catch((error: unknown) => {
                            toast.error(
                              error instanceof Error ? error.message : "Unable to delete report.",
                            );
                          });
                      }}
                    />
                    <ReportsPagination
                      page={currentPage}
                      pageCount={pageCount}
                      rangeLabel={rangeLabel}
                      rowsPerPage={rowsPerPage}
                      onPageChange={setPage}
                      onRowsPerPageChange={(n) => {
                        setRowsPerPage(n);
                        resetPage();
                      }}
                    />
                  </>
                )}
              </>
            )}
          </section>
        </div>

        <aside className="min-w-0 space-y-4">
          {selected ? (
            <>
              <ReportPreviewPanel record={selected} />
              <ReportInsights record={selected} />
            </>
          ) : null}
          <ReportQuickActions totalReports={reportRecords.length} />
        </aside>
      </div>
    </PageContainer>
  );
}
