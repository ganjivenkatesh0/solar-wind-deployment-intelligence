import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  DollarSign,
  Info,
  Leaf,
  Mountain,
  Network,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Wind,
} from "lucide-react";
import { toast } from "sonner";

import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { PreferencesSidebar } from "@/components/analysis/preferences-sidebar";
import { StepProgress } from "@/components/analysis/step-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  analysisFocusOptions,
  defaultFactorWeights,
  defaultPreferencesDraft,
  factorPriorityItems,
  loadPreferencesDraft,
  riskToleranceOptions,
  savePreferencesDraft,
  type AnalysisFocus,
  type FactorKey,
  type PreferencesDraft,
} from "@/lib/analysis-form";

export const Route = createFileRoute("/new-analysis_/preferences")({
  head: () => ({
    meta: [
      { title: "New Analysis — Preferences | Solar & Wind Intelligence" },
      {
        name: "description",
        content:
          "Choose your analysis focus, tune factor priorities, risk tolerance and feasibility thresholds before running the renewable energy analysis.",
      },
      { property: "og:title", content: "New Analysis — Preferences | Solar & Wind Intelligence" },
      {
        property: "og:description",
        content:
          "Choose your analysis focus, tune factor priorities, risk tolerance and feasibility thresholds before running the renewable energy analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PreferencesPage,
});

const focusIcons: Record<AnalysisFocus, { Icon: typeof Sun; color: string }> = {
  solar: { Icon: Sun, color: "text-solar" },
  wind: { Icon: Wind, color: "text-wind" },
  hybrid: { Icon: Leaf, color: "text-hybrid" },
  custom: { Icon: BarChart3, color: "text-info" },
};

const factorStyles: Record<
  FactorKey,
  { Icon: typeof Sun; wrap: string; icon: string; slider: string }
> = {
  solarResource: {
    Icon: Sun,
    wrap: "bg-solar-soft",
    icon: "text-solar",
    slider: "[&>span:first-child>span]:bg-solar [&_[role=slider]]:border-solar",
  },
  windResource: {
    Icon: Wind,
    wrap: "bg-wind-soft",
    icon: "text-wind",
    slider: "[&>span:first-child>span]:bg-wind [&_[role=slider]]:border-wind",
  },
  terrain: {
    Icon: Mountain,
    wrap: "bg-success-soft",
    icon: "text-success",
    slider: "[&>span:first-child>span]:bg-success [&_[role=slider]]:border-success",
  },
  infrastructure: {
    Icon: Network,
    wrap: "bg-hybrid-soft",
    icon: "text-hybrid",
    slider: "[&>span:first-child>span]:bg-hybrid [&_[role=slider]]:border-hybrid",
  },
  environmental: {
    Icon: Leaf,
    wrap: "bg-success-soft",
    icon: "text-success",
    slider: "[&>span:first-child>span]:bg-success [&_[role=slider]]:border-success",
  },
  economic: {
    Icon: DollarSign,
    wrap: "bg-solar-soft",
    icon: "text-solar",
    slider: "[&>span:first-child>span]:bg-solar [&_[role=slider]]:border-solar",
  },
  technical: {
    Icon: ShieldCheck,
    wrap: "bg-destructive/10",
    icon: "text-destructive",
    slider: "[&>span:first-child>span]:bg-destructive [&_[role=slider]]:border-destructive",
  },
};

function PreferencesPage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<PreferencesDraft>(defaultPreferencesDraft);

  useEffect(() => {
    setDraft(loadPreferencesDraft());
  }, []);

  const update = (patch: Partial<PreferencesDraft>) =>
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      savePreferencesDraft(next);
      return next;
    });

  const setWeight = (key: FactorKey, value: number) =>
    update({ weights: { ...draft.weights, [key]: value } });

  const total = Object.values(draft.weights).reduce((sum, value) => sum + value, 0);

  const left = factorPriorityItems.slice(0, 4);
  const right = factorPriorityItems.slice(4);

  const renderFactor = (item: (typeof factorPriorityItems)[number]) => {
    const style = factorStyles[item.key];
    const Icon = style.Icon;
    const value = draft.weights[item.key];
    return (
      <div key={item.key} className="flex min-w-0 items-center gap-3">
        <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${style.wrap}`}>
          <Icon className={`size-4 ${style.icon}`} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Label htmlFor={`factor-${item.key}`} className="text-helper text-foreground">
              {item.label}
            </Label>
            <span
              title={item.hint}
              aria-label={`${item.label}: ${item.hint}`}
              className="text-muted-foreground"
            >
              <Info className="size-3.5" />
            </span>
          </div>
          <Slider
            id={`factor-${item.key}`}
            aria-label={item.label}
            className={cn("mt-2", style.slider)}
            min={0}
            max={100}
            step={1}
            value={[value]}
            onValueChange={([next]) => setWeight(item.key, next ?? 0)}
          />
        </div>
        <span className="text-label grid h-9 w-16 shrink-0 place-items-center rounded-lg border border-border font-medium">
          {value}%
        </span>
      </div>
    );
  };

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

      <StepProgress current={3} />

      <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-4">
          <section className="surface-card p-4 sm:p-5">
            <h2 className="text-section-title">Analysis Preferences</h2>
            <p className="text-helper mt-1">Customize the factors and priorities for your analysis.</p>

            <h3 className="text-card-title mt-5">Analysis Focus</h3>
            <p className="text-helper mt-0.5">Select the primary focus of your analysis</p>

            <div
              role="radiogroup"
              aria-label="Analysis focus"
              className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
            >
              {analysisFocusOptions.map((option) => {
                const active = draft.focus === option.value;
                const { Icon, color } = focusIcons[option.value];
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => update({ focus: option.value })}
                    className={cn(
                      "relative min-w-0 rounded-xl border p-4 text-center transition-colors",
                      active
                        ? "border-primary bg-primary-soft"
                        : "bg-card border-border hover:border-primary/40",
                    )}
                  >
                    {active ? (
                      <span
                        aria-hidden
                        className="border-primary absolute top-3 left-3 grid size-4 place-items-center rounded-full border-2"
                      >
                        <span className="bg-primary size-2 rounded-full" />
                      </span>
                    ) : null}
                    <Icon className={cn("mx-auto size-6", color)} />
                    <p className="text-label mt-3 font-semibold">{option.title}</p>
                    <p className="text-helper mt-1">{option.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-card-title">Factor Priorities</h3>
                  <p className="text-helper mt-0.5">
                    Adjust the importance of different factors in the analysis
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    update({ weights: { ...defaultFactorWeights } });
                    toast.info("Factor priorities reset to default.");
                  }}
                >
                  <RotateCcw className="size-3.5" />
                  Reset to Default
                </Button>
              </div>

              <div className="mt-4 grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <div className="space-y-4">{left.map(renderFactor)}</div>
                <div className="space-y-4">{right.map(renderFactor)}</div>
              </div>

              <p className="text-helper mt-4">
                Total weight:{" "}
                <span
                  className={cn(
                    "font-semibold",
                    total === 100 ? "text-success" : "text-destructive",
                  )}
                >
                  {total}%
                </span>
              </p>
            </div>
          </section>

          <section className="surface-card p-4 sm:p-5">
            <h3 className="text-card-title">Additional Preferences</h3>
            <p className="text-helper mt-0.5">Configure additional options for the analysis</p>

            <div className="mt-4 grid gap-4 rounded-xl border border-border p-4 md:grid-cols-3 md:gap-x-6">
              <div className="min-w-0">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Label htmlFor="risk-tolerance" className="text-label">
                    Risk Tolerance
                  </Label>
                  <ShieldAlert className="text-muted-foreground size-3.5" />
                </div>
                <Select
                  value={draft.riskTolerance}
                  onValueChange={(value) => update({ riskTolerance: value })}
                >
                  <SelectTrigger id="risk-tolerance" className="w-full">
                    <SelectValue placeholder="Select risk tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    {riskToleranceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-helper mt-1.5">Balance between risk and return</p>
              </div>

              <div className="min-w-0">
                <Label htmlFor="min-feasibility" className="text-label mb-1.5 block">
                  Minimum Feasibility Score (%)
                </Label>
                <Input
                  id="min-feasibility"
                  inputMode="numeric"
                  value={draft.minFeasibility}
                  onChange={(e) =>
                    update({ minFeasibility: e.target.value.replace(/[^\d]/g, "").slice(0, 3) })
                  }
                />
                <p className="text-helper mt-1.5">Minimum acceptable feasibility score</p>
              </div>

              <div className="min-w-0 md:border-l md:border-border md:pl-6">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="future-projections" className="text-label">
                    Include Future Projections
                  </Label>
                  <Switch
                    id="future-projections"
                    checked={draft.futureProjections}
                    onCheckedChange={(checked) => update({ futureProjections: checked })}
                  />
                </div>
                <p className="text-helper mt-1.5">
                  Include 20-year energy and financial projections
                </p>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/new-analysis/project-parameters" })}
            >
              <ArrowLeft className="size-4" />
              Back: Project Parameters
            </Button>
            <Button onClick={() => navigate({ to: "/new-analysis/review" })}>
              Next: Review &amp; Submit
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        <PreferencesSidebar />
      </div>
    </PageContainer>
  );
}
