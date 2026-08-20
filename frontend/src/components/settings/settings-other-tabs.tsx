import {
  Building2,
  Database,
  Mail,
  Phone,
  ShieldCheck,
  SlidersHorizontal,
  User,
} from "lucide-react";

import { SettingRow, SettingsCard } from "@/components/settings/settings-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { StatusBadge } from "@/components/ui/status-badge";
import { Switch } from "@/components/ui/switch";
import type { SettingsState } from "@/lib/api/settings";
import {
  dataSources,
  notificationSettings,
  preferenceWeights,
  securityItems,
  systemInformation,
} from "@/lib/settings-data";

export function AccountTab({
  account,
  onChange,
  onSave,
}: {
  account: SettingsState["account"];
  onChange: (key: keyof SettingsState["account"], value: string) => void;
  onSave: () => void;
}) {
  const fields = [
    { id: "name" as const, label: "Full name", value: account.name, icon: User },
    { id: "email" as const, label: "Email address", value: account.email, icon: Mail },
    {
      id: "organization" as const,
      label: "Organization",
      value: account.organization,
      icon: Building2,
    },
    { id: "phone" as const, label: "Phone", value: account.phone, icon: Phone },
  ];

  return (
    <SettingsCard
      title="Account Settings"
      description="Update your profile details and contact information."
      footer={<Button onClick={onSave}>Save Profile</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.id} className="min-w-0 space-y-1.5">
            <Label htmlFor={`account-${field.id}`} className="text-label">
              {field.label}
            </Label>
            <Input
              id={`account-${field.id}`}
              value={field.value}
              onChange={(event) => onChange(field.id, event.target.value)}
            />
          </div>
        ))}
      </div>
    </SettingsCard>
  );
}

export function DataSourcesTab() {
  return (
    <SettingsCard
      title="Data Sources"
      description="Connected datasets powering resource, terrain and infrastructure scoring."
    >
      <div className="min-w-0">
        {dataSources.map((source) => (
          <SettingRow
            key={source.name}
            icon={Database}
            title={source.name}
            description={source.description}
            control={
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="text-helper whitespace-nowrap">{source.latency}</span>
                <StatusBadge tone={source.status === "Connected" ? "success" : "warning"}>
                  {source.status}
                </StatusBadge>
              </div>
            }
          />
        ))}
      </div>
    </SettingsCard>
  );
}

export function NotificationsTab({
  enabled,
  onChange,
  onSave,
}: {
  enabled: SettingsState["notifications"];
  onChange: (key: string, value: boolean) => void;
  onSave: () => void;
}) {
  const notificationKey = (id: string) =>
    ({
      "analysis-complete": "analysis_complete",
      "report-ready": "report_ready",
      "data-source": "data_source",
      "weekly-digest": "weekly_digest",
      "product-updates": "product_updates",
    })[id] ?? id;

  return (
    <SettingsCard
      title="Notifications"
      description="Choose which platform events reach your inbox."
      footer={<Button onClick={onSave}>Save Changes</Button>}
    >
      <div className="min-w-0">
        {notificationSettings.map((item) => (
          <SettingRow
            key={item.id}
            icon={Mail}
            title={item.title}
            description={item.description}
            control={
              <div className="flex sm:justify-end">
                <Switch
                  checked={enabled[notificationKey(item.id)] ?? false}
                  onCheckedChange={(value) => onChange(notificationKey(item.id), value)}
                  aria-label={item.title}
                />
              </div>
            }
          />
        ))}
      </div>
    </SettingsCard>
  );
}

export function PreferencesTab({
  preferences,
  onChange,
  onSave,
}: {
  preferences: SettingsState["preferences"];
  onChange: (key: keyof SettingsState["preferences"], value: number) => void;
  onSave: () => void;
}) {
  const weights = preferenceWeights.map((item) => ({
    ...item,
    value: preferences[item.id as keyof SettingsState["preferences"]],
  }));
  return (
    <SettingsCard
      title="Analysis Preferences"
      description="Default scoring weights applied to new site analyses."
      footer={<Button onClick={onSave}>Save Changes</Button>}
    >
      <div className="min-w-0 space-y-5">
        {weights.map((weight) => (
          <div key={weight.id} className="min-w-0">
            <div className="flex items-center justify-between gap-3">
              <span className="text-label flex min-w-0 items-center gap-2">
                <SlidersHorizontal className="text-primary size-4 shrink-0" strokeWidth={1.75} />
                <span className="truncate">{weight.label}</span>
              </span>
              <span className="text-label shrink-0">{weight.value}%</span>
            </div>
            <Slider
              className="mt-2.5"
              value={[weight.value]}
              min={0}
              max={50}
              step={5}
              aria-label={weight.label}
              onValueChange={([value]) =>
                onChange(weight.id as keyof SettingsState["preferences"], value ?? 0)
              }
            />
          </div>
        ))}
      </div>
    </SettingsCard>
  );
}

export function SecurityTab({
  security,
  onChange,
  onSave,
}: {
  security: SettingsState["security"];
  onChange: (key: keyof SettingsState["security"], value: boolean) => void;
  onSave: () => void;
}) {
  return (
    <SettingsCard
      title="Security"
      description="Protect your account and control session behaviour."
      footer={<Button onClick={onSave}>Save Changes</Button>}
    >
      <div className="min-w-0">
        {securityItems.map((item, index) => {
          const key = (["two_factor", "session_timeout", "login_alerts"] as const)[index];
          return (
            <SettingRow
              key={item.title}
              icon={ShieldCheck}
              title={item.title}
              description={item.description}
              control={
                <div className="flex sm:justify-end">
                  <Switch
                    checked={security[key]}
                    onCheckedChange={(value) => onChange(key, value)}
                    aria-label={item.title}
                  />
                </div>
              }
            />
          );
        })}
      </div>
    </SettingsCard>
  );
}

export function SystemTab({ system }: { system: SettingsState["system"] }) {
  return (
    <SettingsCard title="System" description="Runtime environment and platform build information.">
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        {systemInformation.map((row) => (
          <div key={row.label} className="rounded-lg border border-border p-3">
            <p className="text-helper">{row.label}</p>
            <p className="text-label mt-1">{system[row.label] ?? row.value}</p>
          </div>
        ))}
      </div>
    </SettingsCard>
  );
}
