import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  DollarSign,
  Gauge,
  IndianRupee,
  LineChart,
  Mountain,
  Percent,
  Plug,
  Settings2,
  Sun,
  Zap,
} from "lucide-react";

import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { ParametersSidebar } from "@/components/analysis/parameters-sidebar";
import { StepProgress } from "@/components/analysis/step-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  defaultParametersDraft,
  formatThousands,
  gridConnectionOptions,
  installationTypeOptions,
  loadParametersDraft,
  projectTypeOptions,
  sanitizeDecimal,
  saveParametersDraft,
  type ParametersDraft,
} from "@/lib/analysis-form";

export const Route = createFileRoute("/new-analysis_/project-parameters")({
  head: () => ({
    meta: [
      { title: "New Analysis — Project Parameters | Solar & Wind Intelligence" },
      {
        name: "description",
        content:
          "Define project type, installation, grid connection and financial assumptions for your renewable energy feasibility analysis.",
      },
      {
        property: "og:title",
        content: "New Analysis — Project Parameters | Solar & Wind Intelligence",
      },
      {
        property: "og:description",
        content:
          "Define project type, installation, grid connection and financial assumptions for your renewable energy feasibility analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectParametersPage,
});

function Field({
  id,
  label,
  helper,
  required,
  icon,
  iconWrap,
  children,
}: {
  id: string;
  label: string;
  helper?: string;
  required?: boolean;
  icon: ReactNode;
  iconWrap: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className={`mt-6 grid size-9 shrink-0 place-items-center rounded-lg ${iconWrap}`}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <Label htmlFor={id} className="text-label mb-1.5 block">
          {label}
          {required ? <span className="text-destructive ml-0.5">*</span> : null}
        </Label>
        {children}
        {helper ? <p className="text-helper mt-1.5">{helper}</p> : null}
      </div>
    </div>
  );
}

function ProjectParametersPage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<ParametersDraft>(defaultParametersDraft);

  useEffect(() => {
    setDraft(loadParametersDraft());
  }, []);

  const update = (patch: Partial<ParametersDraft>) =>
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      saveParametersDraft(next);
      return next;
    });

  return (
    <PageContainer>
      <PageHeader
        title="New Analysis"
        description="Enter site details and preferences to run a comprehensive renewable energy analysis."
        actions={
          <nav aria-label="Breadcrumb" className="text-helper flex items-center gap-2">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <span aria-hidden>›</span>
            <span className="text-foreground font-medium">New Analysis</span>
          </nav>
        }
      />

      <StepProgress current={2} />

      <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-4">
          <section className="surface-card p-4 sm:p-5">
            <h2 className="text-section-title">Project Parameters</h2>
            <p className="text-helper mt-1">
              Define key project parameters for accurate energy and financial estimation.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <Settings2 className="text-primary size-4 shrink-0" />
              <h3 className="text-card-title">Energy Project Configuration</h3>
            </div>

            <div className="mt-4 grid gap-4 rounded-xl border border-border p-4 md:grid-cols-2 md:gap-x-6">
              <Field
                id="project-type"
                label="Project Type"
                required
                helper="Select the primary type of energy project"
                icon={<Sun className="text-solar size-4" />}
                iconWrap="bg-solar-soft"
              >
                <Select
                  value={draft.projectType}
                  onValueChange={(value) => update({ projectType: value })}
                >
                  <SelectTrigger id="project-type" className="w-full">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field
                id="installation-type"
                label="Installation Type"
                required
                helper="Select how the system will be installed"
                icon={<Mountain className="text-success size-4" />}
                iconWrap="bg-success-soft"
              >
                <Select
                  value={draft.installationType}
                  onValueChange={(value) => update({ installationType: value })}
                >
                  <SelectTrigger id="installation-type" className="w-full">
                    <SelectValue placeholder="Select installation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {installationTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field
                id="grid-connection"
                label="Grid Connection Availability"
                required
                helper="Is grid connection available at the site?"
                icon={<Zap className="text-hybrid size-4" />}
                iconWrap="bg-hybrid-soft"
              >
                <Select
                  value={draft.gridConnection}
                  onValueChange={(value) => update({ gridConnection: value })}
                >
                  <SelectTrigger id="grid-connection" className="w-full">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    {gridConnectionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field
                id="grid-distance"
                label="Distance to Nearest Grid (km)"
                helper="Distance from site to nearest grid connection"
                icon={<Plug className="text-wind size-4" />}
                iconWrap="bg-wind-soft"
              >
                <Input
                  id="grid-distance"
                  inputMode="decimal"
                  value={draft.gridDistance}
                  onChange={(e) => update({ gridDistance: sanitizeDecimal(e.target.value) })}
                />
              </Field>

              <Field
                id="project-lifetime"
                label="Expected Project Lifetime (Years)"
                helper="Operational lifetime of the project"
                icon={<CalendarDays className="text-info size-4" />}
                iconWrap="bg-info-soft"
              >
                <Input
                  id="project-lifetime"
                  inputMode="numeric"
                  value={draft.projectLifetime}
                  onChange={(e) => update({ projectLifetime: sanitizeDecimal(e.target.value) })}
                />
              </Field>

              <Field
                id="capacity-factor"
                label="Capacity Factor Assumption (%)"
                helper="Expected average capacity factor"
                icon={<Gauge className="text-success size-4" />}
                iconWrap="bg-success-soft"
              >
                <Input
                  id="capacity-factor"
                  inputMode="decimal"
                  value={draft.capacityFactor}
                  onChange={(e) => update({ capacityFactor: sanitizeDecimal(e.target.value) })}
                />
              </Field>
            </div>
          </section>

          <section className="surface-card p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <IndianRupee className="text-primary size-4 shrink-0" />
              <h3 className="text-card-title">Cost &amp; Financial Assumptions</h3>
            </div>

            <div className="mt-4 grid gap-4 rounded-xl border border-border p-4 md:grid-cols-3 md:gap-x-6">
              <Field
                id="cost-per-mw"
                label="Cost per MW (USD)"
                required
                helper="Total cost required per MW capacity"
                icon={<DollarSign className="text-success size-4" />}
                iconWrap="bg-success-soft"
              >
                <Input
                  id="cost-per-mw"
                  inputMode="numeric"
                  value={draft.costPerMw}
                  onChange={(e) => update({ costPerMw: formatThousands(e.target.value) })}
                />
              </Field>

              <Field
                id="om-cost"
                label="O&amp;M Cost (% of CAPEX/Year)"
                helper="Annual operation &amp; maintenance cost"
                icon={<Settings2 className="text-hybrid size-4" />}
                iconWrap="bg-hybrid-soft"
              >
                <Input
                  id="om-cost"
                  inputMode="decimal"
                  value={draft.omCost}
                  onChange={(e) => update({ omCost: sanitizeDecimal(e.target.value) })}
                />
              </Field>

              <Field
                id="discount-rate"
                label="Discount Rate (%)"
                helper="Discount rate for financial calculations"
                icon={<Percent className="text-info size-4" />}
                iconWrap="bg-info-soft"
              >
                <Input
                  id="discount-rate"
                  inputMode="decimal"
                  value={draft.discountRate}
                  onChange={(e) => update({ discountRate: sanitizeDecimal(e.target.value) })}
                />
              </Field>
            </div>
          </section>

          <section className="surface-card p-4 sm:p-5">
            <div className="flex items-start gap-2">
              <BarChart3 className="text-hybrid mt-0.5 size-4 shrink-0" />
              <div className="min-w-0">
                <h3 className="text-card-title">Project Scale (Optional)</h3>
                <p className="text-helper mt-0.5">
                  Provide target capacity or let the system suggest the optimal size.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 rounded-xl border border-border p-4 md:grid-cols-2 md:gap-x-6">
              <Field
                id="target-capacity"
                label="Target Capacity (MW)"
                helper="Leave blank for system optimization"
                icon={<LineChart className="text-hybrid size-4" />}
                iconWrap="bg-hybrid-soft"
              >
                <Input
                  id="target-capacity"
                  inputMode="decimal"
                  placeholder="e.g., 10.0"
                  value={draft.targetCapacity}
                  onChange={(e) => update({ targetCapacity: sanitizeDecimal(e.target.value) })}
                />
              </Field>

              <Field
                id="energy-demand"
                label="Estimated Energy Demand (MWh/Year)"
                helper="Annual energy demand to be met"
                icon={<Zap className="text-solar size-4" />}
                iconWrap="bg-solar-soft"
              >
                <Input
                  id="energy-demand"
                  inputMode="numeric"
                  placeholder="e.g., 15000"
                  value={draft.energyDemand}
                  onChange={(e) => update({ energyDemand: formatThousands(e.target.value) })}
                />
              </Field>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button variant="outline" onClick={() => navigate({ to: "/new-analysis" })}>
              <ArrowLeft className="size-4" />
              Back: Site Details
            </Button>
            <Button onClick={() => navigate({ to: "/new-analysis/preferences" })}>
              Next: Preferences
              <ArrowRight className="size-4" />
            </Button>

          </div>
        </div>

        <ParametersSidebar />
      </div>
    </PageContainer>
  );
}
