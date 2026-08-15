import {
  LayoutGrid,
  FilePlus2,
  History,
  GitCompareArrows,
  Map,
  FileText,
  Settings,
  Info,
} from "lucide-react";

export type NavItem = {
  title: string;
  to: string;
  icon: typeof LayoutGrid;
};

export const navItems: NavItem[] = [
  { title: "Dashboard", to: "/dashboard", icon: LayoutGrid },
  { title: "New Analysis", to: "/new-analysis", icon: FilePlus2 },
  { title: "Analysis History", to: "/analysis-history", icon: History },
  { title: "Compare Sites", to: "/compare-sites", icon: GitCompareArrows },
  { title: "Map Explorer", to: "/map-explorer", icon: Map },
  { title: "Reports", to: "/reports", icon: FileText },
  { title: "Settings", to: "/settings", icon: Settings },
  { title: "About Platform", to: "/about", icon: Info },
];
