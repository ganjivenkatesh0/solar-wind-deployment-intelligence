import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { ReportInsights } from "@/components/reports/report-preview-panel";
import { ReportStatusCell, AnalysisTypeCell } from "@/components/reports/report-primitives";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { DownloadIcon } from "@/lib/icons";
import { findReport, reportImages } from "@/lib/reports-data";

export const Route = createFileRoute("/reports_/$reportId")({
  loader: ({ params }) => {
    const record = findReport(params.reportId);
    if (!record) throw notFound();
    return { record };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Report unavailable — Solar & Wind" }, { name: "robots", content: "noindex" }],
      };
    }
    const { record } = loaderData;
    const title = `${record.name} — ${record.subtitle}`;
    const description = `Full ${record.technology.toLowerCase()} report for ${record.location}: ${record.capacityLabel} capacity, suitability ${record.score.toFixed(1)}/100.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ReportNotFound,
  component: ReportDetailsPage,
});

function ReportNotFound() {
  return (
    <PageContainer>
      <EmptyState
        title="Report not found"
        description="This report may have been deleted. Return to the Reports list to pick another one."
        action={
          <Button asChild>
            <Link to="/reports">Back to Reports</Link>
          </Button>
        }
      />
    </PageContainer>
  );
}

function ReportDetailsPage() {
  const { record } = Route.useLoaderData();

  return (
    <PageContainer>
      <PageHeader
        title={record.name}
        description={record.subtitle}
        breadcrumb={
          <nav aria-label="Breadcrumb" className="text-helper flex items-center gap-2">
            <Link to="/reports" className="hover:text-foreground transition-colors">
              Reports
            </Link>
            <span aria-hidden>›</span>
            <span className="text-foreground font-medium">{record.id}</span>
          </nav>
        }
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/reports">
                <ArrowLeft className="size-4" />
                Back
              </Link>
            </Button>
            <Button onClick={() => toast.success(`Downloading ${record.name}…`)}>
              <DownloadIcon className="size-4" />
              Download PDF
            </Button>
          </>
        }
      />

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="surface-card min-w-0 overflow-hidden">
          <img
            src={reportImages[record.technology]}
            alt={`${record.technology} project site imagery for ${record.location}`}
            className="h-[240px] w-full object-cover"
          />
          <div className="p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <ReportStatusCell record={record} />
              <AnalysisTypeCell record={record} />
            </div>
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              <Detail label="Location" value={record.location} caption={record.coordinatesLabel} />
              <Detail label="Generated On" value={record.dateLabel} caption={record.timeLabel} />
              <Detail label="Report Type" value={record.reportType} caption={`${record.pageCount} pages`} />
              <Detail label="Project Capacity" value={record.capacityLabel} />
              <Detail
                label="Suitability Score"
                value={`${record.score.toFixed(1)}/100`}
                caption={record.scoreLabel}
              />
              <Detail label="Annual Generation" value={record.annualGenerationLabel} />
            </dl>
            <p className="text-helper mt-5 leading-6">
              Detailed report sections — resource assessment, feasibility, energy &amp; financial modelling,
              AI insights and recommendations — will render here once report content is connected in a
              following task.
            </p>
          </div>
        </section>

        <div className="min-w-0 space-y-4">
          <ReportInsights record={record} />
        </div>
      </div>
    </PageContainer>
  );
}

function Detail({ label, value, caption }: { label: string; value: string; caption?: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-helper">{label}</dt>
      <dd className="text-label font-semibold">{value}</dd>
      {caption ? <p className="text-helper mt-0.5">{caption}</p> : null}
    </div>
  );
}
