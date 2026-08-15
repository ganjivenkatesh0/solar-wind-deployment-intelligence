import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { PageContainer, PageHeader } from "@/components/layout/page-container";
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
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/states";
import {
  DateIcon,
  DownloadIcon,
  FilterIcon,
  SearchIcon,
} from "@/lib/icons";
import {
  analysisHistoryDateRange,
  analysisHistoryRecords,
  analysisHistorySummary,
  type AnalysisRecord,
} from "@/lib/analysis-history-data";

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

function AnalysisHistoryPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<AnalysisRecord[]>(analysisHistoryRecords);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedId, setSelectedId] = useState(analysisHistoryRecords[0]!.id);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [pendingDelete, setPendingDelete] = useState<AnalysisRecord | null>(null);

  const filtered = useMemo(() => records.filter((r) => matchesQuery(r, query)), [records, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * rowsPerPage;
  const rows = filtered.slice(start, start + rowsPerPage);
  const selected = filtered.find((r) => r.id === selectedId) ?? rows[0] ?? filtered[0] ?? null;

  const rangeLabel = filtered.length
    ? `Showing ${start + 1} to ${Math.min(start + rowsPerPage, filtered.length)} of ${filtered.length} results`
    : "No results";

  function handleView(record: AnalysisRecord) {
    setSelectedId(record.id);
    navigate({ to: "/dashboard" });
  }

  function handleDownload(record: AnalysisRecord) {
    toast.success(`Preparing report for ${record.id}`, {
      description: "Report generation will be connected to your account shortly.",
    });
  }

  function handleRetry(record: AnalysisRecord) {
    toast.info(`Re-running analysis ${record.id}`, {
      description: `${record.location} has been queued for a new run.`,
    });
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setCheckedIds((prev) => prev.filter((c) => c !== id));
    if (selectedId === id) {
      const next = records.find((r) => r.id !== id);
      if (next) setSelectedId(next.id);
    }
    setPendingDelete(null);
    toast.success(`${id} deleted`);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Analysis History"
        description="View and manage all your past site analysis and results."
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <DateIcon className="size-4" />
              <span className="hidden sm:inline">{analysisHistoryDateRange}</span>
              <span className="sm:hidden">Date range</span>
              <ChevronDown className="size-4 opacity-60" />
            </Button>
            <Button variant="outline" className="gap-2">
              <FilterIcon className="size-4" />
              Filter
            </Button>
            <Button variant="outline" size="icon" aria-label="More history options">
              <ChevronDown className="size-4" />
            </Button>
          </>
        }
      />

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_284px]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {analysisHistorySummary.map((card) => (
              <HistorySummaryCard key={card.label} card={card} />
            ))}
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
                onClick={() =>
                  toast.success("Export started", {
                    description: `${filtered.length} analyses will be exported as CSV.`,
                  })
                }
              >
                <DownloadIcon className="size-4" />
                Export History
              </Button>
            </div>

            {rows.length ? (
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
              onDuplicate={() =>
                toast.success(`${selected.id} duplicated`, {
                  description: "A new draft analysis was created from this site.",
                })
              }
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
