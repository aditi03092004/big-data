import React from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  LineChart,
  Radio,
  Database,
  TerminalSquare,
  FileBarChart,
  Settings,
  Layers3,
  ArrowUpRight,
} from "lucide-react";
import { DataModeBadge } from "../status/DataModeBadge";
import { DataMode } from "../../types";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: DataMode;
}

const mainNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Products & Sales", href: "/products", icon: Package },
  { label: "Orders & Delivery", href: "/orders", icon: ShoppingBag },
  { label: "Revenue", href: "/revenue", icon: LineChart },
  { label: "Live Analytics", href: "/live", icon: Radio, pulse: true },
];

const bigdataNav = [
  { label: "Data Explorer", href: "/data-explorer", icon: Database },
  { label: "Query Analytics", href: "/queries", icon: TerminalSquare },
  { label: "Reports", href: "/reports", icon: FileBarChart },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ open, setOpen, mode }) => {
  const [location] = useLocation();

  const isActive = (href: string) => {
    if (href === "/dashboard") return location === "/" || location === "/dashboard";
    return location.startsWith(href);
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs md:hidden" onClick={() => setOpen(false)} />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 text-sidebar-foreground transition-transform duration-200 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <Layers3 className="h-5 w-5 stroke-[2.4]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-sidebar-foreground">BIG DATA HUB</h1>
            <p className="font-mono text-[9px] uppercase tracking-widest text-sidebar-foreground/50">E-Commerce Analytics</p>
          </div>
        </div>

        <div className="mb-6 px-2">
          <DataModeBadge mode={mode} />
        </div>

        <p className="mb-2 px-3 font-mono text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40">Analytics Modules</p>
        <nav className="space-y-1">
          {mainNav.map(({ label, href, icon: Icon, pulse }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-sidebar-primary" : "text-sidebar-foreground/60"}`} />
                <span>{label}</span>
                {pulse && <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-sidebar-primary" />}
              </Link>
            );
          })}
        </nav>

        <p className="mb-2 mt-6 px-3 font-mono text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40">Big Data Engine</p>
        <nav className="space-y-1">
          {bigdataNav.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-sidebar-primary" : "text-sidebar-foreground/60"}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground">HDFS + Spark + Hive</span>
          </div>
          <p className="mt-1.5 text-xs text-sidebar-foreground/60 leading-relaxed">Enterprise distributed data pipeline platform.</p>
          <Link href="/settings" className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-sidebar-primary hover:underline">
            View Connections <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </aside>
    </>
  );
};
