import { MoreVertical, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DeleteIcon, DownloadIcon, DuplicateIcon, RetryIcon, ViewIcon } from "@/lib/icons";
import type { ReportRecord } from "@/lib/reports-data";
import { cn } from "@/lib/utils";
import { AnalysisTypeCell, ReportStatusCell, techColor } from "./report-primitives";

const columns = ["Report Details", "Location", "Generated On", "Analysis Type", "Status"];

export function ReportsTable({
  rows,
  selectedId,
  onSelect,
  onView,
  onDownload,
  onRetry,
  onShare,
  onDelete,
}: {
  rows: ReportRecord[];
  selectedId: string;
  onSelect: (id: string) => void;
  onView: (record: ReportRecord) => void;
  onDownload: (record: ReportRecord) => void;
  onRetry: (record: ReportRecord) => void;
  onShare: (record: ReportRecord) => void;
  onDelete: (record: ReportRecord) => void;
}) {
  return (
    <div className="min-w-0 overflow-x-auto">
      <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left">
        <thead>
          <tr className="bg-muted/60">
            {columns.map((label) => (
              <th key={label} className="text-label px-2.5 py-2.5 font-semibold whitespace-nowrap">
                {label}
              </th>
            ))}
            <th className="text-label sticky right-0 bg-muted/60 px-3 py-2.5 text-right font-semibold whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((record) => {
            const isSelected = record.id === selectedId;
            const isFailed = record.status === "Failed";
            const inProgress = record.status === "In Progress";
            return (
              <tr
                key={record.id}
                onClick={() => onSelect(record.id)}
                className={cn(
                  "cursor-pointer transition-colors hover:bg-muted/40 [&>td]:border-t [&>td]:border-border",
                  isSelected && "bg-primary-soft/50",
                )}
              >
                <td className="px-2.5 py-3">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-lg bg-muted",
                        techColor[record.technology],
                      )}
                    >
                      <FileText className="size-4" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-label font-semibold whitespace-nowrap">{record.name}</p>
                      <p className="text-helper whitespace-nowrap">{record.subtitle}</p>
                      <span className="text-helper mt-1 inline-block rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold">
                        {record.id}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-2.5 py-3">
                  <p className="text-label font-semibold whitespace-nowrap">{record.location}</p>
                  <p className="text-helper whitespace-nowrap">{record.coordinatesLabel}</p>
                </td>
                <td className="px-2.5 py-3">
                  <p className="text-label whitespace-nowrap">{record.dateLabel}</p>
                  <p className="text-helper whitespace-nowrap">{record.timeLabel}</p>
                </td>
                <td className="px-2.5 py-3">
                  <AnalysisTypeCell record={record} />
                </td>
                <td className="px-2.5 py-3">
                  <ReportStatusCell record={record} />
                </td>
                <td
                  className={cn("sticky right-0 px-2.5 py-3", isSelected ? "bg-primary-soft" : "bg-card")}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1">
                    <IconAction
                      label={`View ${record.id}`}
                      onClick={() => onView(record)}
                      disabled={inProgress}
                    >
                      <ViewIcon className="size-4" />
                    </IconAction>
                    {isFailed ? (
                      <IconAction label={`Retry ${record.id}`} onClick={() => onRetry(record)}>
                        <RetryIcon className="size-4" />
                      </IconAction>
                    ) : (
                      <IconAction
                        label={`Download ${record.id}`}
                        onClick={() => onDownload(record)}
                        disabled={inProgress}
                      >
                        <DownloadIcon className="size-4" />
                      </IconAction>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={`More actions for ${record.id}`}
                          className="size-7 rounded-lg text-muted-foreground"
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(record)}>
                          <ViewIcon className="size-4" /> Open full report
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onShare(record)}>
                          <DuplicateIcon className="size-4" /> Copy report link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRetry(record)}>
                          <RetryIcon className="size-4" /> Regenerate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(record)}
                          className="text-error focus:text-error"
                        >
                          <DeleteIcon className="size-4" /> Delete report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function IconAction({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="size-7 rounded-lg text-muted-foreground"
    >
      {children}
    </Button>
  );
}

export function ReportsPagination({
  page,
  pageCount,
  rangeLabel,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: {
  page: number;
  pageCount: number;
  rangeLabel: string;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-4 py-3">
      <p className="text-helper">{rangeLabel}</p>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-lg"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        {Array.from({ length: Math.max(pageCount, 1) }).map((_, i) => {
          const n = i + 1;
          return (
            <Button
              key={n}
              variant={n === page ? "default" : "outline"}
              size="icon"
              className="size-8 rounded-lg"
              aria-current={n === page ? "page" : undefined}
              onClick={() => onPageChange(n)}
            >
              {n}
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-lg"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-helper">Rows per page:</span>
        <Select value={String(rowsPerPage)} onValueChange={(v) => onRowsPerPageChange(Number(v))}>
          <SelectTrigger className="h-9 w-[74px]" aria-label="Rows per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[7, 10, 15].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
