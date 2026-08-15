import { useState } from "react";
import { Building2, Database, Mail, Phone, ShieldCheck, SlidersHorizontal, User } from "lucide-react";
import { toast } from "sonner";

import { SettingRow, SettingsCard } from "@/components/settings/settings-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { StatusBadge } from "@/components/ui/status-badge";
import { Switch } from "@/components/ui/switch";
import {
  dataSources,
  notificationSettings,
  preferenceWeights,
  securityItems,
  accountProfile,
  systemInformation,
} from "@/lib/settings-data";

export function AccountTab() {
  const fields = [
    { id: "name", label: "Full name", value: accountProfile.name, icon: User },
    { id: "email", label: "Email address", value: accountProfile.email, icon: Mail },
    { id: "org", label: "Organization", value: accountProfile.organization, icon: Building2 },
    { id: "phone", label: "Phone", value: accountProfile.phone, icon: Phone },
  ];

  return (
    <SettingsCard
      title="Account Settings"
      description="Update your profile details and contact information."
      footer={
        <Button onClick={() => toast.success("Profile updated")}>Save Profile</Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.id} className="min-w-0 space-y-1.5">
            <Label htmlFor={`account-${field.id}`} className="text-label">
              {field.label}
            </Label>
            <Input id={`account-${field.id}`} defaultValue={field.value} />
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

export function NotificationsTab() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationSettings.map((n) => [n.id, n.enabled])),
  );

  return (
    <SettingsCard
      title="Notifications"
      description="Choose which platform events reach your inbox."
      footer={<Button onClick={() => toast.success("Notification preferences saved")}>Save Changes</Button>}
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
                  checked={enabled[item.id] ?? false}
                  onCheckedChange={(value) => setEnabled((prev) => ({ ...prev, [item.id]: value }))}
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

export function PreferencesTab() {
  const [weights, setWeights] = useState(preferenceWeights);

  return (
    <SettingsCard
      title="Analysis Preferences"
      description="Default scoring weights applied to new site analyses."
      footer={<Button onClick={() => toast.success("Default weights saved")}>Save Changes</Button>}
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
                setWeights((prev) =>
                  prev.map((item) => (item.id === weight.id ? { ...item, value: value ?? 0 } : item)),
                )
              }
            />
          </div>
        ))}
      </div>
    </SettingsCard>
  );
}

export function SecurityTab() {
  const [enabled, setEnabled] = useState(securityItems.map((item) => item.enabled));

  return (
    <SettingsCard
      title="Security"
      description="Protect your account and control session behaviour."
      footer={<Button onClick={() => toast.success("Security settings saved")}>Save Changes</Button>}
    >
      <div className="min-w-0">
        {securityItems.map((item, index) => (
          <SettingRow
            key={item.title}
            icon={ShieldCheck}
            title={item.title}
            description={item.description}
            control={
              <div className="flex sm:justify-end">
                <Switch
                  checked={enabled[index] ?? false}
                  onCheckedChange={(value) =>
                    setEnabled((prev) => prev.map((item, i) => (i === index ? value : item)))
                  }
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

export function SystemTab() {
  return (
    <SettingsCard
      title="System"
      description="Runtime environment and platform build information."
    >
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        {systemInformation.map((row) => (
          <div key={row.label} className="rounded-lg border border-border p-3">
            <p className="text-helper">{row.label}</p>
            <p className="text-label mt-1">{row.value}</p>
          </div>
        ))}
      </div>
    </SettingsCard>
  );
}
