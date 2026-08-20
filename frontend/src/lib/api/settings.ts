import { apiRequest } from "./client";

export const SETTINGS_UPDATED_EVENT = "swdi-settings-updated";

export function getProfileInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }

  return (words[0] ?? "").slice(0, 2).toUpperCase();
}

export type SettingsState = {
  general: {
    analysis_type: string;
    currency: string;
    distance_unit: string;
    area_unit: string;
    date_format: string;
    time_zone: string;
    theme: "light" | "dark";
    compact: boolean;
  };
  account: {
    name: string;
    email: string;
    organization: string;
    phone: string;
  };
  notifications: Record<string, boolean>;
  preferences: Record<"resource" | "financial" | "infrastructure" | "environment" | "risk", number>;
  security: {
    two_factor: boolean;
    session_timeout: boolean;
    login_alerts: boolean;
  };
  statistics: Record<string, string>;
  system: Record<string, string>;
  notifications_feed: Array<{ id: string; title: string; description: string }>;
  updated_at: string | null;
};

export function getSettings(): Promise<SettingsState> {
  return apiRequest<SettingsState>("/settings");
}

export function updateSettings(
  settings: Pick<
    SettingsState,
    "general" | "account" | "notifications" | "preferences" | "security"
  >,
): Promise<SettingsState> {
  return apiRequest<SettingsState>("/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  }).then((saved) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent<SettingsState>(SETTINGS_UPDATED_EVENT, { detail: saved }),
      );
    }
    return saved;
  });
}

export function resetSettings(): Promise<SettingsState> {
  return apiRequest<SettingsState>("/settings/reset", { method: "POST" }).then((saved) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent<SettingsState>(SETTINGS_UPDATED_EVENT, { detail: saved }),
      );
    }
    return saved;
  });
}
