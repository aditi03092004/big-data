import React from "react";
import { useLocation, Link } from "wouter";
import { Menu, RefreshCw, Bell, Server } from "lucide-react";
import { HealthSummary } from "../../types";
import { Badge } from "../ui/Badge";
import { titleize } from "../../utils/formatters";

interface HeaderProps {
  onOpenSidebar: () => void;
  health?: HealthSummary;
  onRefreshHealth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar, health, onRefreshHealth }) => {
  const [location] = useLocation();

  const getPageTitle = () => {
    const segment = location.split("/")[1] || "dashboard";
    return titleize(segment);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-5 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onOpenSidebar} className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden" aria-label="Open sidebar">
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className="font-mono text-foreground">PLATFORM</span>
          <span>/</span>
          <span className="text-foreground">{getPageTitle()}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {health && (
          <div className="hidden lg:flex items-center gap-2">
            {(["hdfs", "spark", "hive", "kafka", "mongodb"] as const).map((key) => {
              const status = health[key];
              const isConnected = status === "connected";
              return (
                <div key={key} className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2.5 py-1 text-[11px] font-semibold">
                  <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500" : status === "not_configured" ? "bg-amber-500" : "bg-red-500"}`} />
                  <span className="font-mono uppercase text-foreground">{key}</span>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={onRefreshHealth}
          className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          title="Refresh Big Data Status"
        >
          <RefreshCw className="h-4 w-4" />
        </button>

        <Link href="/settings" className="flex items-center gap-2 rounded-lg border border-border/60 bg-card p-1.5 text-xs font-semibold hover:bg-muted">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xs">BD</div>
          <span className="hidden sm:block text-left">
            <span className="block text-xs font-bold text-foreground">Admin User</span>
            <span className="block text-[10px] font-mono text-muted-foreground">Big Data Ops</span>
          </span>
        </Link>
      </div>
    </header>
  );
};
