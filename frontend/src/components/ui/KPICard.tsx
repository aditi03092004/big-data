import React from "react";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { KPI } from "../../types";
import { Card } from "./Card";

export const KPICard: React.FC<{ kpi: KPI; index?: number }> = ({ kpi, index = 0 }) => {
  const isUp = kpi.trend === "up";
  const isDown = kpi.trend === "down";

  return (
    <Card testId={`kpi-${kpi.label.toLowerCase().replace(/\s+/g, "-")}`} className={`rise stagger-${(index % 4) + 1}`}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{kpi.label}</span>
        <span className={`rounded-md p-1.5 ${isUp ? "bg-emerald-100 text-emerald-700" : isDown ? "bg-red-100 text-red-700" : "bg-muted text-muted-foreground"}`}>
          {isUp ? <ArrowUpRight className="h-4 w-4" /> : isDown ? <ArrowDownRight className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-foreground">{kpi.value}</p>
      <p className={`mt-2 text-xs font-semibold ${isDown ? "text-red-700" : "text-emerald-700"}`}>
        {kpi.change} <span className="font-normal text-muted-foreground">vs prior period</span>
      </p>
    </Card>
  );
};
