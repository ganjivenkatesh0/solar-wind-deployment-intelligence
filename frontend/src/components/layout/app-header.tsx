import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import { getCurrentUser, logoutUser } from "@/lib/api/auth";
import {
  getProfileInitials,
  getSettings,
  SETTINGS_UPDATED_EVENT,
  type SettingsState,
} from "@/lib/api/settings";

export function AppHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState("User");
  const [profileRole, setProfileRole] = useState("Energy Analyst");
  const [notifications, setNotifications] = useState<SettingsState["notifications_feed"]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  useEffect(() => {
    const applyUser = (user: { name: string; role?: string }) => {
      setProfileName(user.name || "User");
      setProfileRole(user.role || "Energy Analyst");
    };

    const syncFromSettings = (settings: SettingsState) => {
      if (settings?.account?.name) {
        setProfileName(settings.account.name);
      }
    };

    const handleSettingsUpdated = (event: Event) => {
      const settings = (event as CustomEvent<SettingsState>).detail;
      if (settings?.account?.name) syncFromSettings(settings);
    };

    getCurrentUser().then(applyUser).catch(() => undefined);
    getSettings().then(syncFromSettings).catch(() => undefined);
    window.addEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdated);

    return () => window.removeEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdated);
  }, []);

  const loadNotifications = (open: boolean) => {
    if (!open) return;
    setNotificationsLoading(true);
    getSettings()
      .then((settings) => setNotifications(settings.notifications_feed))
      .catch(() => setNotifications([]))
      .finally(() => setNotificationsLoading(false));
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onOpenSidebar}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0">
            <p className="truncate text-[0.9375rem] font-semibold tracking-tight">
              Solar &amp; Wind Deployment Intelligence
            </p>
            <p className="text-helper hidden truncate sm:block">
              AI-powered site suitability for renewable energy projects
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>

          <DropdownMenu onOpenChange={loadNotifications}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="size-5" />
                <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notificationsLoading ? (
                <DropdownMenuItem disabled>Loading notifications...</DropdownMenuItem>
              ) : notifications.length ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="items-start gap-2 whitespace-normal"
                  >
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-helper">{notification.description}</p>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-accent/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none">
                <Avatar className="size-8">
                  <AvatarFallback>{getProfileInitials(profileName)}</AvatarFallback>
                </Avatar>
                <span className="hidden min-w-0 text-left sm:block">
                  <span className="text-label block truncate">{profileName}</span>
                  <span className="text-helper block truncate">{profileRole}</span>
                </span>
                <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <User className="mr-2 size-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="mr-2 size-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await logoutUser();
                  } finally {
                    await navigate({ to: "/login" });
                  }
                }}
              >
                <LogOut className="mr-2 size-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
