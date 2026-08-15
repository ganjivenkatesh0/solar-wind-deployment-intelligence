import { Trophy } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { CardPanel } from "@/components/dashboard/card-panel";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "@/lib/icons";
import {
  accentFor,
  technologyBreakdown,
  technologyColor,
  type CompareSite,
} from "@/lib/compare-sites-data";

/** Right-hand column: narrative summary, score chart, technology mix and best site. */
export function ComparisonSummaryColumn({
  sites,
  bestSite,
  onOpenReport,
}: {
  sites: CompareSite[];
  bestSite: CompareSite;
  onOpenReport: () => void;
}) {
  const bestIndex = sites.findIndex((s) => s.id === bestSite.id);
  const chartData = sites.map((site, index) => ({
    name: `Site ${index + 1}`,
    score: site.suitability,
    color: accentFor(index).color,
  }));
  const techData = technologyBreakdown(sites);

  return (
    <div className="min-w-0 space-y-4">
      <section className="surface-card px-4 py-4">
        <h2 className="text-card-title">Comparison Summary</h2>
        <p className="text-helper mt-2 leading-relaxed">
          <span className="text-foreground font-semibold">
            Site {bestIndex + 1} ({bestSite.city})
          </span>{" "}
          is the best overall location based on all evaluation criteria.
        </p>
      </section>

      <CardPanel title="Suitability Score Comparison" bodyClassName="pt-1">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 18, right: 6, left: -14, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <Bar dataKey="score" radius={[3, 3, 0, 0]} barSize={26}>
                <LabelList
                  dataKey="score"
                  position="top"
                  style={{ fontSize: 11, fontWeight: 700, fill: "var(--foreground)" }}
                />
                {chartData.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardPanel>

      <CardPanel title="Recommended Technology">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-[130px] w-[130px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={techData}
                  dataKey="count"
                  nameKey="technology"
                  innerRadius={32}
                  outerRadius={56}
                  paddingAngle={2}
                  stroke="none"
                >
                  {techData.map((d) => (
                    <Cell key={d.technology} fill={technologyColor[d.technology]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="min-w-0 space-y-2">
            {techData.map((d) => (
              <li key={d.technology} className="flex items-center gap-2 text-[13px]">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: technologyColor[d.technology] }}
                />
                <span className="truncate">
                  {d.technology} ({d.count})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardPanel>

      <section className="border-primary/25 bg-primary-soft rounded-2xl border px-4 py-4">
        <h2 className="text-card-title">Best Site Recommendation</h2>
        <div className="mt-3 flex min-w-0 items-start gap-3">
          <span className="bg-card grid size-14 shrink-0 place-items-center rounded-full shadow-[var(--shadow-soft)]">
            <Trophy className="text-solar size-7" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold">
              Site {bestIndex + 1} - {bestSite.city}, {bestSite.state}
            </p>
            <p className="text-helper mt-1 leading-relaxed">
              Highest overall suitability score with excellent {bestSite.technology.toLowerCase()}{" "}
              potential and strong infrastructure.
            </p>
          </div>
        </div>
        <Button variant="outline" className="bg-card mt-3 w-full justify-between" onClick={onOpenReport}>
          View Full Analysis Report
          <ChevronRightIcon className="size-4" />
        </Button>
      </section>
    </div>
  );
}
