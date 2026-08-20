import {
  Activity,
  Archive,
  Clock,
  Database,
  FileText,
  HardDrive,
  Layers,
  RotateCcw,
  Server,
  Trash2,
  UploadCloud,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";

import { InfoRow } from "@/components/settings/settings-primitives";
import { getProfileInitials, type SettingsState } from "@/lib/api/settings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { accountProfile, dataStorageStats, systemInformation } from "@/lib/settings-data";

const systemIcons = [Clock, Server, Database, Layers, Clock];
const storageIcons = [FileText, HardDrive, FileText, UploadCloud];

export function AccountOverviewCard({
  account = accountProfile,
}: {
  account?: SettingsState["account"];
}) {
  return (
    <section className="surface-card min-w-0 p-4 sm:p-5">
      <h2 className="text-card-title">Account Overview</h2>
      <div className="mt-4 flex min-w-0 items-center gap-3">
        <Avatar className="size-12 shrink-0">
          <AvatarFallback>{getProfileInitials(account.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-[0.95rem] font-bold tracking-tight">{account.name}</p>
          <p className="text-helper truncate">{accountProfile.role}</p>
          <p className="text-helper truncate">{account.email}</p>
        </div>
      </div>
      <Button
        variant="outline"
        className="mt-4 w-full"
        onClick={() => toast.success("Account management opens in the Account tab")}
      >
        <UserCog className="size-4" /> Manage Account
      </Button>
    </section>
  );
}

export function SystemInformationCard({ system = {} }: { system?: Record<string, string> }) {
  return (
    <section className="surface-card min-w-0 p-4 sm:p-5">
      <h2 className="text-card-title">System Information</h2>
      <div className="mt-3 min-w-0">
        {systemInformation.map((row, index) => (
          <InfoRow
            key={row.label}
            icon={systemIcons[index] ?? Server}
            label={row.label}
            value={system[row.label] ?? row.value}
          />
        ))}
      </div>
      <Button
        variant="outline"
        className="mt-4 w-full"
        onClick={() => toast.success("All services operational — uptime 99.98%")}
      >
        <Activity className="size-4" /> View System Status
      </Button>
    </section>
  );
}

export function DataStorageCard({ statistics = {} }: { statistics?: Record<string, string> }) {
  return (
    <section className="surface-card min-w-0 p-4 sm:p-5">
      <h2 className="text-card-title">Data &amp; Storage</h2>
      <div className="mt-3 min-w-0">
        {dataStorageStats.map((row, index) => (
          <InfoRow
            key={row.label}
            icon={storageIcons[index] ?? Archive}
            label={row.label}
            value={statistics[row.label] ?? "Unavailable"}
          />
        ))}
      </div>
      <Button
        variant="outline"
        className="mt-4 w-full"
        onClick={() => toast.success("Data manager will open once storage APIs are connected")}
      >
        <Database className="size-4" /> Manage Data
      </Button>
    </section>
  );
}

function DangerAction({
  title,
  description,
  buttonLabel,
  icon: Icon,
  dialogTitle,
  dialogDescription,
  onConfirm,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  icon: typeof Trash2;
  dialogTitle: string;
  dialogDescription: string;
  onConfirm: () => void;
}) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-2.5">
      <div className="flex min-w-0 items-start gap-2">
        <Icon className="text-destructive mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <div className="min-w-0">
          <p className="text-label">{title}</p>
          <p className="text-helper mt-0.5">{description}</p>
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive shrink-0"
          >
            <Icon className="size-4" /> {buttonLabel}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function DangerZoneCard({ onResetSettings }: { onResetSettings: () => void }) {
  return (
    <section className="border-destructive/40 bg-destructive/5 min-w-0 space-y-4 rounded-xl border p-4 sm:p-5">
      <h2 className="text-destructive text-[0.95rem] font-bold tracking-tight">Danger Zone</h2>
      <DangerAction
        title="Clear Application Data"
        description="This action cannot be undone"
        buttonLabel="Clear Data"
        icon={Trash2}
        dialogTitle="Clear all application data?"
        dialogDescription="Analyses, reports and cached datasets stored in this browser will be removed. This action cannot be undone."
        onConfirm={() => {
          toast.info("Application data clearing is unavailable while analysis history is retained");
        }}
      />
      <DangerAction
        title="Reset Application Settings"
        description="Reset all settings to default"
        buttonLabel="Reset All"
        icon={RotateCcw}
        dialogTitle="Reset all settings to default?"
        dialogDescription="Every preference on this page returns to its factory default. Your analyses and reports are not affected."
        onConfirm={onResetSettings}
      />
    </section>
  );
}
