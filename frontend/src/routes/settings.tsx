import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Clock, DollarSign, LandPlot, Monitor, Moon, Palette, Ruler, Save, Sun, Zap } from "lucide-react";
import { toast } from "sonner";

import { PageContainer, PageHeader } from "@/components/layout/page-container";
import {
  SettingRow,
  SettingSelect,
  SettingsCard,
} from "@/components/settings/settings-primitives";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import {
  AccountOverviewCard,
  DangerZoneCard,
  DataStorageCard,
  SystemInformationCard,
} from "@/components/settings/settings-side-panels";
import {
  AccountTab,
  DataSourcesTab,
  NotificationsTab,
  PreferencesTab,
  SecurityTab,
  SystemTab,
} from "@/components/settings/settings-other-tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import {
  analysisTypeOptions,
  areaUnitOptions,
  currencyOptions,
  dateFormatOptions,
  defaultGeneralSettings,
  distanceUnitOptions,
  timeZoneOptions,
  type GeneralSettings,
  type SettingsTabId,
} from "@/lib/settings-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Solar & Wind Deployment Intelligence" },
      {
        name: "description",
        content:
          "Configure default analysis type, units, currency, display, notifications, data sources and security for your renewable energy workspace.",
      },
      { property: "og:title", content: "Settings — Solar & Wind Deployment Intelligence" },
      {
        property: "og:description",
        content:
          "Manage account, preferences, data sources, notifications and application configuration.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [tab, setTab] = useState<SettingsTabId>("general");
  const [general, setGeneral] = useState<GeneralSettings>(defaultGeneralSettings);
  const [compact, setCompact] = useState(false);
  const { theme, setTheme } = useTheme();

  const update = (key: keyof GeneralSettings) => (value: string) =>
    setGeneral((prev) => ({ ...prev, [key]: value }));

  const resetAll = () => {
    setGeneral(defaultGeneralSettings);
    setCompact(false);
    setTheme("light");
    setTab("general");
    toast.success("All settings reset to default");
  };

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Manage your preferences, account settings and application configurations."
      />

      <SettingsTabs active={tab} onChange={setTab} />

      <div className="mt-5 grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className={cn("min-w-0", compact ? "space-y-3" : "space-y-4")}>
          {tab === "general" ? (
            <>
              <SettingsCard
                title="General Settings"
                description="Configure basic application settings and preferences."
              >
                <div className="min-w-0">
                  <SettingRow
                    icon={Zap}
                    title="Default Analysis Type"
                    description="Choose the default analysis type for new projects"
                    control={
                      <SettingSelect
                        label="Default analysis type"
                        value={general.analysisType}
                        options={analysisTypeOptions}
                        onChange={update("analysisType")}
                      />
                    }
                  />
                  <SettingRow
                    icon={DollarSign}
                    title="Default Currency"
                    description="Select the default currency for financial calculations"
                    control={
                      <SettingSelect
                        label="Default currency"
                        value={general.currency}
                        options={currencyOptions}
                        onChange={update("currency")}
                      />
                    }
                  />
                  <SettingRow
                    icon={Ruler}
                    title="Distance Unit"
                    description="Choose the unit for distance measurements"
                    control={
                      <SettingSelect
                        label="Distance unit"
                        value={general.distanceUnit}
                        options={distanceUnitOptions}
                        onChange={update("distanceUnit")}
                      />
                    }
                  />
                  <SettingRow
                    icon={LandPlot}
                    title="Area Unit"
                    description="Choose the unit for area measurements"
                    control={
                      <SettingSelect
                        label="Area unit"
                        value={general.areaUnit}
                        options={areaUnitOptions}
                        onChange={update("areaUnit")}
                      />
                    }
                  />
                  <SettingRow
                    icon={Calendar}
                    title="Date Format"
                    description="Select the date format for displaying dates"
                    control={
                      <SettingSelect
                        label="Date format"
                        value={general.dateFormat}
                        options={dateFormatOptions}
                        onChange={update("dateFormat")}
                      />
                    }
                  />
                  <SettingRow
                    icon={Clock}
                    title="Time Zone"
                    description="Select your local time zone"
                    control={
                      <SettingSelect
                        label="Time zone"
                        value={general.timeZone}
                        options={timeZoneOptions}
                        onChange={update("timeZone")}
                      />
                    }
                  />
                </div>
              </SettingsCard>

              <SettingsCard
                title="Display Settings"
                description="Customize the appearance of the application."
                footer={
                  <Button onClick={() => toast.success("Settings saved successfully")}>
                    <Save className="size-4" /> Save Changes
                  </Button>
                }
              >
                <div className="min-w-0">
                  <SettingRow
                    icon={Palette}
                    title="Theme Mode"
                    description="Choose between light and dark theme"
                    control={
                      <div className="flex gap-2 sm:justify-end">
                        <Button
                          variant={theme === "light" ? "outline" : "ghost"}
                          size="sm"
                          aria-pressed={theme === "light"}
                          className={cn(
                            "flex-1 sm:flex-none",
                            theme === "light" && "border-primary text-primary bg-primary/10",
                          )}
                          onClick={() => setTheme("light")}
                        >
                          <Sun className="size-4" /> Light
                        </Button>
                        <Button
                          variant={theme === "dark" ? "outline" : "ghost"}
                          size="sm"
                          aria-pressed={theme === "dark"}
                          className={cn(
                            "flex-1 sm:flex-none",
                            theme === "dark" && "border-primary text-primary bg-primary/10",
                          )}
                          onClick={() => setTheme("dark")}
                        >
                          <Moon className="size-4" /> Dark
                        </Button>
                      </div>
                    }
                  />
                  <SettingRow
                    icon={Monitor}
                    title="Compact Mode"
                    description="Reduce spacing for more content on screen"
                    control={
                      <div className="flex sm:justify-end">
                        <Switch
                          checked={compact}
                          onCheckedChange={setCompact}
                          aria-label="Compact mode"
                        />
                      </div>
                    }
                  />
                </div>
              </SettingsCard>
            </>
          ) : null}

          {tab === "account" ? <AccountTab /> : null}
          {tab === "data-sources" ? <DataSourcesTab /> : null}
          {tab === "notifications" ? <NotificationsTab /> : null}
          {tab === "preferences" ? <PreferencesTab /> : null}
          {tab === "security" ? <SecurityTab /> : null}
          {tab === "system" ? <SystemTab /> : null}
        </div>

        <aside className="min-w-0 space-y-4">
          <AccountOverviewCard />
          <SystemInformationCard />
          <DataStorageCard />
          <DangerZoneCard onResetSettings={resetAll} />
        </aside>
      </div>
    </PageContainer>
  );
}
