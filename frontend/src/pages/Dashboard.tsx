import React, { useState, useEffect } from "react";
import { RefreshCw, LockKeyhole, ArrowUpRight } from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { KPICard } from "../components/ui/KPICard";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { LoadingState } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ServiceStatusBadge } from "../components/status/ServiceStatusBadge";
import { RevenueTrendChart } from "../components/charts/RevenueTrendChart";
import { CategoryRevenueChart } from "../components/charts/CategoryRevenueChart";
import { TopProductsChart } from "../components/charts/TopProductsChart";
import { DashboardSummary, HealthSummary } from "../types";
import { fetchDashboardSummary, fetchHealth } from "../services/api";
import { formatCurrency, formatNumber } from "../utils/formatters";

export const DashboardPage: React.FC = () => {
  const [range, setRange] = useState("30d");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [health, setHealth] = useState<HealthSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [sumRes, healthRes] = await Promise.all([fetchDashboardSummary(range), fetchHealth()]);
      setSummary(sumRes);
      setHealth(healthRes);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [range]);

  if (loading) return <LoadingState />;
  if (error || !summary) return <EmptyState title="Failed to load dashboard analytics" description="Ensure the backend Node.js server is running." icon="error" onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">Executive Cockpit</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">E-Commerce Big Data Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time analytical insights derived from distributed storage & aggregation pipelines.</p>
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
            <option value="1y">This Year</option>
          </select>

          <Button variant="soft" onClick={loadData}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {summary.kpis.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Main Analytical Section */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Gross Revenue Trend" subtitle="Daily & monthly aggregated revenue stream" />
          <RevenueTrendChart data={summary.revenueTrend} />
        </Card>

        {/* Big Data Service Health Status Card */}
        <Card>
          <CardHeader title="Big Data Platform Health" subtitle="Live backend connection check" />
          <div className="space-y-2.5">
            {health && (
              <>
                <ServiceStatusBadge serviceName="Apache HDFS" status={health.hdfs} />
                <ServiceStatusBadge serviceName="Apache Spark" status={health.spark} />
                <ServiceStatusBadge serviceName="Apache Hive" status={health.hive} />
                <ServiceStatusBadge serviceName="Apache Kafka" status={health.kafka} />
                <ServiceStatusBadge serviceName="MongoDB" status={health.mongodb} />
              </>
            )}
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <LockKeyhole className="h-3.5 w-3.5" /> Connections are checked via backend health API endpoints.
          </p>
        </Card>
      </div>

      {/* Category & Top Products */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Revenue by Product Category" subtitle="Distribution across catalog categories" />
          <CategoryRevenueChart data={summary.categoryRevenue} />
        </Card>

        <Card>
          <CardHeader title="Top 5 Products by Revenue" subtitle="Highest grossing merchandise" />
          <TopProductsChart data={summary.topProducts.slice(0, 5)} />
        </Card>
      </div>

      {/* Locations & Statuses */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Orders by Regional Location" subtitle="Metropolitan volume breakdown" />
          <div className="space-y-3">
            {summary.ordersByLocation.map((loc) => (
              <div key={loc.label} className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                <span className="text-sm font-semibold text-foreground">{loc.label}</span>
                <span className="font-mono text-sm font-bold text-primary">{formatNumber(loc.value)} orders</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Order Status Distribution" subtitle="Operational fulfillment state" />
          <div className="grid grid-cols-2 gap-3">
            {summary.orderStatuses.map((st, i) => (
              <div key={st.label} className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="text-xs font-semibold text-muted-foreground">{st.label}</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{formatNumber(st.value)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
