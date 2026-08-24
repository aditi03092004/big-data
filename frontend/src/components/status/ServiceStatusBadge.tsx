import React from "react";
import { ServiceStatus } from "../../types";
import { Badge } from "../ui/Badge";
import { titleize } from "../../utils/formatters";

export const ServiceStatusBadge: React.FC<{ serviceName: string; status: ServiceStatus }> = ({ serviceName, status }) => {
  const toneMap = {
    connected: "good" as const,
    disconnected: "bad" as const,
    checking: "warn" as const,
    not_configured: "warn" as const,
  };

  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3.5 py-3 border border-border/60">
      <div className="flex items-center gap-2.5">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            status === "connected" ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : status === "not_configured" ? "bg-amber-500" : "bg-red-500"
          }`}
        />
        <span className="text-xs font-bold uppercase tracking-wider text-foreground">{serviceName}</span>
      </div>
      <Badge tone={toneMap[status]}>{titleize(status)}</Badge>
    </div>
  );
};
