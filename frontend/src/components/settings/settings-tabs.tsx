import { Bell, Database, LayoutGrid, ShieldCheck, SlidersHorizontal, Server, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { settingsTabs, type SettingsTabId } from "@/lib/settings-data";
import { cn } from "@/lib/utils";

const tabIcons: Record<SettingsTabId, LucideIcon> = {
  general: LayoutGrid,
  account: User,
  "data-sources": Database,
  notifications: Bell,
  preferences: SlidersHorizontal,
  security: ShieldCheck,
  system: Server,
};

/** Horizontal settings navigation with a green active underline. */
export function SettingsTabs({
  active,
  onChange,
}: {
  active: SettingsTabId;
  onChange: (id: SettingsTabId) => void;
}) {
  return (
    <div className="surface-card min-w-0 overflow-x-auto p-0">
      <div role="tablist" aria-label="Settings sections" className="flex min-w-max items-center px-2">
        {settingsTabs.map((tab) => {
          const Icon = tabIcons[tab.id];
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                "text-nav flex items-center gap-2 border-b-2 border-transparent px-4 py-4 whitespace-nowrap transition-colors",
                isActive
                  ? "border-primary text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4.5 shrink-0" strokeWidth={1.75} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
