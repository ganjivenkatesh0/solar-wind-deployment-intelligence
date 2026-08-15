import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Gauge,
  Info,
  Leaf,
  LandPlot,
  Loader2,
  MapPin,
  Mountain,
  Network,
  Pencil,
  Percent,
  Play,
  Plug,
  Route as RouteIcon,
  Save,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Wallet,
  Wind,
} from "lucide-react";
import { toast } from "sonner";

import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { ReviewSidebar, type SummaryRow } from "@/components/analysis/review-sidebar";
import { StepProgress } from "@/components/analysis/step-progress";
import { Button } from "@/components/ui/button";
import {
  defaultAnalysisDraft,
  defaultParametersDraft,
  defaultPreferencesDraft,
  factorPriorityItems,
  formatCoordinates,
  gridConnectionOptions,
  installationTypeOptions,
  landUseOptions,
  loadDraft,
  loadParametersDraft,
  loadPreferencesDraft,
  projectTypeOptions,
  riskToleranceOptions,
  analysisFocusOptions,
  selectedLocationInfo,
  saveDraft,
  saveParametersDraft,
  savePreferencesDraft,
  type AnalysisDraft,
  type FactorKey,
  type ParametersDraft,
  type PreferencesDraft,
} from "@/lib/analysis-form";

export const Route = createFileRoute("/new-analysis_/review")({
  head: () => ({
    meta: [
      { title: "New Analysis — Review & Submit | Solar & Wind Intelligence" },
      {
        name: "description",
        content:
          "Review your site details, project parameters and analysis preferences before running the AI-powered renewable energy suitability analysis.",
      },
      {
        property: "og:title",
        content: "New Analysis — Review & Submit | Solar & Wind Intelligence",
      },
      {
        property: "og:description",
        content:
          "Review your site details, project parameters and analysis preferences before running the AI-powered renewable energy suitability analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewPage,
});

const factorStyles: Record<FactorKey, { Icon: typeof Sun; icon: string; bar: string }> = {
  solarResource: { Icon: Sun, icon: "text-solar", bar: "bg-solar" },
  windResource: { Icon: Wind, icon: "text-wind", bar: "bg-wind" },
  terrain: { Icon: Mountain, icon: "text-success", bar: "bg-success" },
  infrastructure: { Icon: Network, icon: "text-hybrid", bar: "bg-hybrid" },
  environmental: { Icon: Leaf, icon: "text-success", bar: "bg-success" },
  economic: { Icon: DollarSign, icon: "text-solar", bar: "bg-solar" },
  technical: { Icon: ShieldCheck, icon: "text-destructive", bar: "bg-destructive" },
};

function labelOf(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function formatMoney(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "—";
  return `$${Number(digits).toLocaleString("en-US")}`;
}

function isPositiveNumber(value: string) {
  const num = Number(value.replace(/,/g, ""));
  return Number.isFinite(num) && num > 0;
}

function CardHeader({
  step,
  title,
  onEdit,
}: {
  step: number;
  title: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="bg-primary text-primary-foreground grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold">
          {step}
        </span>
        <h3 className="text-card-title truncate">{title}</h3>
      </div>
      <Button variant="outline" size="sm" onClick={onEdit}>
        <Pencil className="size-3.5" />
        Edit
      </Button>
    </div>
  );
}

function Row({
  Icon,
  iconClass,
  label,
  children,
}: {
  Icon: typeof Sun;
  iconClass: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-helper flex min-w-0 items-center gap-2">
        <Icon className={`size-4 shrink-0 ${iconClass}`} />
        <span className="truncate">{label}</span>
      </span>
      <div className="text-label min-w-0 text-right font-medium">{children}</div>
    </div>
  );
}

function ReviewPage() {
  const navigate = useNavigate();
  const [site, setSite] = useState<AnalysisDraft>(defaultAnalysisDraft);
  const [params, setParams] = useState<ParametersDraft>(defaultParametersDraft);
  const [prefs, setPrefs] = useState<PreferencesDraft>(defaultPreferencesDraft);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisTime, setAnalysisTime] = useState("—");

  useEffect(() => {
    setSite(loadDraft());
    setParams(loadParametersDraft());
    setPrefs(loadPreferencesDraft());
    const now = new Date();
    setAnalysisTime(
      `${now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} • ${now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`,
    );
  }, []);

  const focusLabel = labelOf(
    analysisFocusOptions.map((option) => ({ value: option.value, label: option.title })),
    prefs.focus,
  );
  const projectTypeLabel = labelOf(projectTypeOptions, params.projectType);
  const installationLabel = labelOf(installationTypeOptions, params.installationType);
  const gridLabel = labelOf(gridConnectionOptions, params.gridConnection);
  const riskLabel = labelOf(riskToleranceOptions, prefs.riskTolerance);

  const summary: SummaryRow[] = useMemo(
    () => [
      {
        Icon: MapPin,
        iconClass: "text-success",
        label: "Location",
        value: selectedLocationInfo.name,
      },
      {
        Icon: LandPlot,
        iconClass: "text-wind",
        label: "Land Area",
        value: site.landArea ? `${site.landArea} hectares` : "—",
      },
      { Icon: Wallet, iconClass: "text-success", label: "Budget", value: formatMoney(site.budget) },
      { Icon: Sun, iconClass: "text-solar", label: "Project Type", value: projectTypeLabel },
      {
        Icon: Network,
        iconClass: "text-hybrid",
        label: "Installation Type",
        value: installationLabel,
      },
      { Icon: Sun, iconClass: "text-solar", label: "Analysis Focus", value: focusLabel },
      {
        Icon: ShieldCheck,
        iconClass: "text-success",
        label: "Minimum Feasibility Score",
        value: prefs.minFeasibility ? `${prefs.minFeasibility}%` : "—",
      },
      { Icon: ShieldAlert, iconClass: "text-destructive", label: "Risk Tolerance", value: riskLabel },
    ],
    [
      site.landArea,
      site.budget,
      projectTypeLabel,
      installationLabel,
      focusLabel,
      prefs.minFeasibility,
      riskLabel,
    ],
  );

  const validate = () => {
    if (!isPositiveNumber(site.landArea)) return "Land area must be a valid number greater than 0.";
    if (!isPositiveNumber(site.budget)) return "Available budget must be a valid amount.";
    const lat = Number(site.latitude);
    const lon = Number(site.longitude);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) return "Latitude must be between -90 and 90.";
    if (!Number.isFinite(lon) || lon < -180 || lon > 180)
      return "Longitude must be between -180 and 180.";
    if (!isPositiveNumber(params.projectLifetime)) return "Project lifetime must be valid.";
    if (!isPositiveNumber(params.costPerMw)) return "Cost per MW must be a valid amount.";
    if (!isPositiveNumber(prefs.minFeasibility))
      return "Minimum feasibility score must be a valid percentage.";
    const total = Object.values(prefs.weights).reduce((sum, value) => sum + value, 0);
    if (total <= 0) return "Factor priorities must add up to more than 0%.";
    return null;
  };

  const persistAll = () => {
    saveDraft(site);
    saveParametersDraft(params);
    savePreferencesDraft(prefs);
  };

  const runAnalysis = async () => {
    const message = validate();
    if (message) {
      setError(message);
      toast.error(message);
      return;
    }
    setError(null);
    setRunning(true);
    persistAll();
    try {
      // No analysis backend is connected to this workflow yet — the inputs are
      // persisted locally and the user is taken to the results screen.
      await new Promise((resolve) => setTimeout(resolve, 900));
      toast.success("Analysis submitted — opening your results.");
      navigate({ to: "/dashboard" });
    } catch {
      setRunning(false);
      setError("We couldn't run the analysis. Please try again.");
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="New Analysis"
        description="Review your analysis inputs and preferences before generating results."
        actions={
          <nav aria-label="Breadcrumb" className="text-helper flex items-center gap-2">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <span aria-hidden>›</span>
            <Link to="/new-analysis" className="hover:text-foreground transition-colors">
              New Analysis
            </Link>
            <span aria-hidden>›</span>
            <span className="text-foreground font-medium">Review &amp; Submit</span>
          </nav>
        }
      />

      <StepProgress current={4} />

      <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-4">
          <section className="surface-card p-4 sm:p-5">
            <h2 className="text-section-title">Review Your Analysis</h2>
            <p className="text-helper mt-1">
              Please review all the information below. You can go back and edit any section if
              needed.
            </p>

            <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-2">
              <div className="border-border min-w-0 rounded-xl border p-4">
                <CardHeader
                  step={1}
                  title="Site Details"
                  onEdit={() => navigate({ to: "/new-analysis" })}
                />
                <div className="mt-4 space-y-3">
                  <Row Icon={MapPin} iconClass="text-success" label="Location">
                    <span className="block">{selectedLocationInfo.name}</span>
                    <span className="text-helper block">
                      {formatCoordinates(site.latitude, site.longitude)}
                    </span>
                  </Row>
                  <Row Icon={LandPlot} iconClass="text-wind" label="Land Area">
                    {site.landArea ? `${site.landArea} hectares` : "—"}
                  </Row>
                  <Row Icon={Wallet} iconClass="text-success" label="Budget">
                    {formatMoney(site.budget)}
                  </Row>
                  <Row Icon={Clock} iconClass="text-info" label="Analysis Time">
                    {analysisTime}
                  </Row>
                  <Row Icon={Mountain} iconClass="text-hybrid" label="Land Use Type">
                    {labelOf(landUseOptions, site.landUseType)}
                  </Row>
                </div>
              </div>

              <div className="border-border min-w-0 rounded-xl border p-4">
                <CardHeader
                  step={2}
                  title="Project Parameters"
                  onEdit={() => navigate({ to: "/new-analysis/project-parameters" })}
                />
                <div className="mt-4 space-y-3">
                  <Row Icon={Sun} iconClass="text-solar" label="Project Type">
                    {projectTypeLabel}
                  </Row>
                  <Row Icon={Network} iconClass="text-hybrid" label="Installation Type">
                    {installationLabel}
                  </Row>
                  <Row Icon={Plug} iconClass="text-success" label="Grid Connection">
                    {gridLabel}
                  </Row>
                  <Row Icon={RouteIcon} iconClass="text-wind" label="Distance to Grid">
                    {params.gridDistance ? `${params.gridDistance} km` : "—"}
                  </Row>
                  <Row Icon={Calendar} iconClass="text-info" label="Project Lifetime">
                    {params.projectLifetime ? `${params.projectLifetime} Years` : "—"}
                  </Row>
                  <Row Icon={Gauge} iconClass="text-success" label="Capacity Factor Assumption">
                    {params.capacityFactor ? `${params.capacityFactor}%` : "—"}
                  </Row>
                  <Row Icon={DollarSign} iconClass="text-solar" label="Cost per MW">
                    {formatMoney(params.costPerMw)}
                  </Row>
                  <Row Icon={Percent} iconClass="text-wind" label="O&M Cost">
                    {params.omCost ? `${params.omCost}%` : "—"}
                  </Row>
                  <Row Icon={Percent} iconClass="text-hybrid" label="Discount Rate">
                    {params.discountRate ? `${params.discountRate}%` : "—"}
                  </Row>
                  {params.targetCapacity ? (
                    <Row Icon={Gauge} iconClass="text-solar" label="Target Capacity">
                      {`${params.targetCapacity} MW`}
                    </Row>
                  ) : null}
                  {params.energyDemand ? (
                    <Row Icon={Gauge} iconClass="text-wind" label="Estimated Energy Demand">
                      {`${params.energyDemand} MWh/Year`}
                    </Row>
                  ) : null}
                </div>
              </div>

              <div className="border-border min-w-0 rounded-xl border p-4 lg:col-span-2">
                <CardHeader
                  step={3}
                  title="Preferences"
                  onEdit={() => navigate({ to: "/new-analysis/preferences" })}
                />
                <div className="mt-4 grid min-w-0 gap-5 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                  <div className="space-y-3">
                    <Row Icon={Sun} iconClass="text-solar" label="Analysis Focus">
                      {focusLabel}
                    </Row>
                    <Row Icon={ShieldAlert} iconClass="text-destructive" label="Risk Tolerance">
                      {riskLabel}
                    </Row>
                    <Row
                      Icon={ShieldCheck}
                      iconClass="text-success"
                      label="Minimum Feasibility Score"
                    >
                      {prefs.minFeasibility ? `${prefs.minFeasibility}%` : "—"}
                    </Row>
                    <Row Icon={Calendar} iconClass="text-info" label="Include Future Projections">
                      {prefs.futureProjections ? "Yes (20 years)" : "No"}
                    </Row>
                  </div>

                  <div className="min-w-0 md:border-l md:border-border md:pl-6">
                    <p className="text-label font-semibold">Factor Priorities</p>
                    <ul className="mt-3 space-y-2.5">
                      {factorPriorityItems.map((item) => {
                        const style = factorStyles[item.key];
                        const Icon = style.Icon;
                        const value = prefs.weights[item.key];
                        return (
                          <li key={item.key} className="flex min-w-0 items-center gap-2.5">
                            <Icon className={`size-4 shrink-0 ${style.icon}`} />
                            <span className="text-helper min-w-0 flex-1 truncate">
                              {item.label}
                            </span>
                            <span className="bg-muted h-1.5 w-20 shrink-0 overflow-hidden rounded-full">
                              <span
                                className={`block h-full rounded-full ${style.bar}`}
                                style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                              />
                            </span>
                            <span className="text-helper w-9 shrink-0 text-right font-medium">
                              {value}%
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-info-soft border-info/25 rounded-xl border p-4">
            <h2 className="text-card-title flex items-center gap-2">
              <Info className="text-info size-4 shrink-0" />
              Important Note
            </h2>
            <p className="text-helper mt-2">
              The analysis may take a few moments to complete as we collect and process data from
              multiple sources.
              <br />
              You will be notified when your results are ready.
            </p>
          </section>

          {error ? (
            <p role="alert" className="text-label text-destructive">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/new-analysis/preferences" })}
              disabled={running}
            >
              <ArrowLeft className="size-4" />
              Back: Preferences
            </Button>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                disabled={running}
                onClick={() => {
                  persistAll();
                  toast.success("Draft saved — your inputs are preserved.");
                }}
              >
                <Save className="size-4" />
                Save as Draft
              </Button>
              <Button onClick={runAnalysis} disabled={running}>
                {running ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Running Analysis...
                  </>
                ) : (
                  <>
                    Run Analysis
                    <Play className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <ReviewSidebar summary={summary} />
      </div>
    </PageContainer>
  );
}
