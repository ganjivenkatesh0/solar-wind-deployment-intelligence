import { Link, useRouter } from "@tanstack/react-router";

import { navItems } from "@/lib/nav-items";
import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-mark";
import { SidebarAboutCard } from "./sidebar-about-card";

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const isReports = pathname === "/reports";
  const isSettings = pathname === "/settings";

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <Link
        to="/dashboard"
        onClick={onNavigate}
        className="flex items-center gap-3 px-5 py-5 focus-visible:outline-none"
      >
        <BrandMark className="size-10 shrink-0" />
        <span className="min-w-0">
          <span className="block truncate text-[1.15rem] font-bold tracking-tight text-sidebar-foreground">
            Solar &amp; Wind
          </span>
          <span className="text-helper block truncate">Deployment Intelligence</span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 pt-2 pb-6">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            activeProps={{ "data-nav-active": "true" }}
            className={cn(
              "text-nav group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-colors",
              "hover:bg-sidebar-accent/60",
              "data-[nav-active=true]:bg-sidebar-accent data-[nav-active=true]:font-semibold data-[nav-active=true]:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="size-5 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4">
        {isReports ? (
          <SidebarAboutCard
            title="About Reports"
            description="Generate comprehensive reports with insights, visualizations and recommendations for your renewable energy projects."
          />
        ) : isSettings ? (
          <SidebarAboutCard
            title="About Settings"
            description="Manage your account, preferences, data sources, notifications and application configuration."
          />
        ) : (
          <SidebarAboutCard />
        )}
      </div>


    </div>
  );
}
