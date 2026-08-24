import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Percent, BarChart3, RefreshCw } from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { KPICard } from "../components/ui/KPICard";
import { LoadingState } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { RevenueSummary } from "../types";
import { fetchRevenueSummary } from "../services/api";
import { formatCurrency } from "../utils/formatters";

export const RevenuePage: React.FC = () => {
  const [range, setRange] = useState("30d");
  const [data, setData] = useState<RevenueSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchRevenueSummary(range);
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Unable to load revenue analytics from HDFS");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [range]);

  if (loading && !data) return <LoadingState />;
  if (error && !data) return <EmptyState title="Unable to load revenue analytics from HDFS" description={error} icon="error" onRetry={loadData} />;
  if (!data) return <EmptyState title="Failed to load revenue analytics" description="Check backend server status." icon="error" onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">Financial Performance</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Revenue Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Commercial performance, net profitability, discount absorption, and location yield.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none focus:border-primary"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="6m">Last 6 Months</option>
            <option value="all">All Time</option>
          </select>
          <Button variant="soft" onClick={loadData}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {data.kpis.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Monthly & Location breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Monthly Revenue Trajectory" subtitle="Aggregated monthly gross sales" />
          <div className="space-y-3">
            {data.monthly.map((m) => (
              <div key={m.label} className="flex items-center justify-between rounded-lg bg-muted/40 p-3.5 border border-border/50">
                <span className="text-sm font-semibold text-foreground">{m.label}</span>
                <span className="font-mono text-base font-bold text-primary">{formatCurrency(m.value)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Regional Revenue Yield" subtitle="Location sales breakdown" />
          <div className="space-y-3">
            {data.location.map((loc) => (
              <div key={loc.label} className="flex items-center justify-between rounded-lg bg-muted/40 p-3.5 border border-border/50">
                <span className="text-sm font-semibold text-foreground">{loc.label}</span>
                <span className="font-mono text-base font-bold text-foreground">{formatCurrency(loc.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Profit vs Revenue Breakdown */}
      {data.profitVsRevenue ? (
        <Card>
          <CardHeader title="Profitability vs Discount Analysis" subtitle="Monthly gross revenue, net profit, and discount write-offs" />
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/70 text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                <tr>
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">Gross Revenue</th>
                  <th className="px-4 py-3">Net Profit</th>
                  <th className="px-4 py-3">Discounts Absorbed</th>
                  <th className="px-4 py-3">Profit Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.profitVsRevenue.map((row) => {
                  const margin = ((row.profit / row.revenue) * 100).toFixed(1);
                  return (
                    <tr key={row.month} className="hover:bg-muted/40">
                      <td className="px-4 py-3 font-bold text-foreground">{row.month}</td>
                      <td className="px-4 py-3 font-mono font-bold text-primary">{formatCurrency(row.revenue)}</td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-600">{formatCurrency(row.profit)}</td>
                      <td className="px-4 py-3 font-mono text-amber-700">{formatCurrency(row.discount)}</td>
                      <td className="px-4 py-3 font-mono font-bold text-foreground">{margin}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card>
          <CardHeader title="Profitability & Discount Audit" subtitle="Source dataset status" />
          <div className="p-4 rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground font-mono">
            N/A — Cost & profit margin data unavailable in raw source dataset (/ecommerce/orders/orders.csv).
          </div>
        </Card>
      )}
    </div>
  );
};
