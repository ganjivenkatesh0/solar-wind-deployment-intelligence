import { createFileRoute } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Code2,
  Database,
  Eye,
  Globe,
  Info,
  Leaf,
  Map,
  MapPin,
  Monitor,
  Mountain,
  Satellite,
  Server,
  ShieldCheck,
  Sun,
  Tag,
  Target,
  TrendingUp,
  User,
  Wind,
  Zap,
} from "lucide-react";

import aboutHero from "@/assets/about-hero.jpg";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Platform — Solar & Wind Deployment Intelligence" },
      {
        name: "description",
        content:
          "Learn about the platform mission, AI capabilities and the data sources powering the analyses.",
      },
      {
        property: "og:title",
        content: "About Platform — Solar & Wind Deployment Intelligence",
      },
      {
        property: "og:description",
        content:
          "Learn about the platform mission, AI capabilities and the data sources powering the analyses.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageContainer>
      <PageHeader
        title="About Platform"
        description="Learn more about the Solar & Wind Deployment Intelligence Platform."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <PlatformOverviewCard />
          <PlatformInformationCard />
          <DataSourcesCard />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <MissionVisionCard />
          <KeyCapabilitiesCard />
          <PlatformStatisticsCard />
        </div>
      </div>

      <AboutFooter />
    </PageContainer>
  );
}

function PlatformOverviewCard() {
  return (
    <section className="surface-card overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
        <div className="relative h-52 md:h-auto">
          <img
            src={aboutHero}
            alt="Solar panels and wind turbines on a green landscape"
            width={1024}
            height={768}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-5 sm:p-6">
          <h2 className="text-section-title">
            Solar &amp; Wind Deployment Intelligence
          </h2>
          <p className="mt-1 text-sm font-semibold text-primary">
            AI-Powered Renewable Energy Decision Platform
          </p>
          <p className="text-helper mt-3">
            Our platform leverages advanced AI/ML models, geospatial analytics,
            and multi-source datasets to identify and evaluate optimal locations
            for solar and wind energy projects. We empower developers,
            investors, and planners with accurate insights, risk assessment, and
            actionable recommendations.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Highlight
              icon={Zap}
              label="AI-Powered Analysis"
              colorClass="bg-primary-soft text-primary"
            />
            <Highlight
              icon={Globe}
              label="Multi-Source Data Integration"
              colorClass="bg-primary-soft text-primary"
            />
            <Highlight
              icon={ShieldCheck}
              label="Reliable &amp; Accurate Insights"
              colorClass="bg-primary-soft text-primary"
            />
            <Highlight
              icon={TrendingUp}
              label="Actionable Recommendations"
              colorClass="bg-primary-soft text-primary"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Highlight({
  icon: Icon,
  label,
  colorClass,
}: {
  icon: LucideIcon;
  label: string;
  colorClass: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-full",
          colorClass,
        )}
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <span className="text-helper leading-tight">{label}</span>
    </div>
  );
}

function MissionVisionCard() {
  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Target className="size-5" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-card-title">Our Mission</h3>
          <p className="text-helper mt-1.5 leading-relaxed">
            To accelerate the global transition to clean energy by making
            renewable energy site selection smarter, faster, and more reliable
            through the power of data and AI.
          </p>
        </div>
      </div>

      <div className="my-5 border-t border-border" />

      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Eye className="size-5" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-card-title">Our Vision</h3>
          <p className="text-helper mt-1.5 leading-relaxed">
            A world where every renewable energy project is backed by intelligent
            insights, driving a sustainable and energy-secure future.
          </p>
        </div>
      </div>
    </section>
  );
}

function PlatformInformationCard() {
  return (
    <section className="surface-card overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-section-title">Platform Information</h2>
      </div>
      <div className="divide-y">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={Monitor}
            label="Platform Name"
            value="Solar & Wind Deployment Intelligence"
          />
          <InfoRow icon={Tag} label="Version" value="v1.0.0" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={User}
            label="Developer"
            value="Infosys Springboard Internship Project"
          />
          <InfoRow icon={Calendar} label="Release Date" value="Aug 13, 2026" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <InfoRow
            icon={Code2}
            label="Built With"
            value="FastAPI, PostgreSQL, Python, Machine Learning, Geospatial Analytics, React"
          />
          <InfoRow icon={Server} label="Environment" value="Production" />
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Icon className="size-4.5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="text-helper">{label}</p>
        <p className="text-label mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

function KeyCapabilitiesCard() {
  const capabilities = [
    "Solar, Wind & Hybrid potential assessment",
    "AI/ML based energy estimation",
    "Technical, environmental & financial feasibility",
    "Risk assessment and suitability scoring",
    "Interactive maps and geospatial exploration",
    "Comprehensive reports and exports",
  ];

  return (
    <section className="surface-card p-5 sm:p-6">
      <h2 className="text-section-title">Key Capabilities</h2>
      <ul className="mt-4 grid gap-2.5">
        {capabilities.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <CheckCircle2
              className="mt-0.5 size-4 shrink-0 text-primary"
              strokeWidth={2}
            />
            <span className="text-sm text-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DataSourcesCard() {
  const sources = [
    {
      icon: Sun,
      name: "NASA POWER",
      description: "Solar irradiance, weather & climate data",
      colorClass: "bg-info-soft text-info",
    },
    {
      icon: Wind,
      name: "Global Wind Atlas",
      description: "Wind speed and density data",
      colorClass: "bg-wind-soft text-wind",
    },
    {
      icon: Mountain,
      name: "SRTM",
      description: "Elevation and terrain data",
      colorClass: "bg-warning-soft text-warning",
    },
    {
      icon: Map,
      name: "OpenStreetMap",
      description: "Roads, infrastructure & accessibility",
      colorClass: "bg-success-soft text-success",
    },
    {
      icon: Satellite,
      name: "Sentinel Hub",
      description: "Satellite imagery & land use data",
      colorClass: "bg-hybrid-soft text-hybrid",
    },
  ];

  return (
    <section className="surface-card p-5 sm:p-6">
      <h2 className="text-section-title">Data Sources We Use</h2>
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {sources.map((source) => (
          <div key={source.name} className="flex flex-col items-center gap-2 text-center">
            <div
              className={cn(
                "flex size-11 items-center justify-center rounded-full",
                source.colorClass,
              )}
            >
              <source.icon className="size-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-label">{source.name}</p>
              <p className="text-helper mt-0.5 leading-tight">
                {source.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-primary-soft/50 px-3 py-2.5">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2} />
        <p className="text-xs text-foreground">
          We continuously integrate and validate data from trusted global sources
          to ensure accuracy and reliability.
        </p>
      </div>
    </section>
  );
}

function PlatformStatisticsCard() {
  const stats = [
    {
      icon: BarChart3,
      value: "18",
      label: "Analyses Completed",
      sublabel: "All time",
    },
    {
      icon: MapPin,
      value: "1,240+",
      label: "Locations Evaluated",
      sublabel: "Across regions",
    },
    {
      icon: Database,
      value: "5.6M+",
      label: "Data Points Processed",
      sublabel: "From multiple sources",
    },
    {
      icon: ShieldCheck,
      value: "99.9%",
      label: "Uptime",
      sublabel: "Platform reliability",
    },
  ];

  return (
    <section className="surface-card p-5 sm:p-6">
      <h2 className="text-section-title">Platform Statistics</h2>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-background/50 p-3"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-primary-soft text-primary">
              <stat.icon className="size-4" strokeWidth={1.75} />
            </div>
            <p className="mt-2 text-xl font-bold tracking-tight text-foreground">
              {stat.value}
            </p>
            <p className="text-label mt-0.5">{stat.label}</p>
            <p className="text-helper mt-0.5">{stat.sublabel}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutFooter() {
  return (
    <footer className="mt-8 rounded-xl border border-border bg-primary-soft px-5 py-4 sm:px-6">
      <div className="flex flex-col items-center gap-3 text-center md:flex-row md:justify-between md:gap-4 md:text-left">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="size-4" strokeWidth={2} />
          </div>
          <span className="text-sm font-medium text-foreground">
            Building a sustainable future with intelligent renewable energy
            solutions.
          </span>
        </div>

        <p className="text-helper">
          © 2026 Solar &amp; Wind Deployment Intelligence Platform. All rights
          reserved.
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary">
            Privacy Policy
          </a>
          <span className="hidden md:inline">·</span>
          <a href="#" className="hover:text-primary">
            Terms of Service
          </a>
          <span className="hidden md:inline">·</span>
          <a href="#" className="hover:text-primary">
            Contact Us
          </a>
        </nav>
      </div>
    </footer>
  );
}
