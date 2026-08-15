import { useState, type ReactNode } from "react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

/**
 * Global application shell: fixed sidebar (desktop), slide-over sidebar (mobile),
 * sticky header and the scrollable content region every page renders into.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-[272px] shrink-0 border-r border-sidebar-border lg:block">
        <div className="fixed top-0 bottom-0 left-0 w-[272px] overflow-y-auto border-r border-sidebar-border">
          <AppSidebar />
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <AppSidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader onOpenSidebar={() => setMobileOpen(true)} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
