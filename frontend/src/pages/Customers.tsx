import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, Users, UserCheck, UserPlus, DollarSign, RefreshCw } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Pagination } from "../components/ui/Pagination";
import { LoadingState } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Customer, CustomerSummary, PaginatedResult } from "../types";
import { fetchCustomers } from "../services/api";
import { formatCurrency, formatNumber, formatDate, titleize } from "../utils/formatters";

export const CustomersPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [range, setRange] = useState("30d");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<(PaginatedResult<Customer> & { mode?: string; summary?: CustomerSummary }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCustomers({ range, search, page, pageSize: 10 });
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Unable to load customer analytics from HDFS");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [range, search, page]);

  if (loading && !data) return <LoadingState />;

  if (error && !data) {
    return (
      <EmptyState
        title="Unable to load customer analytics from HDFS"
        description="Verify HDFS connection and ensure /ecommerce/customers dataset is available."
        icon="error"
        onRetry={loadCustomers}
      />
    );
  }

  const summary = data?.summary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">Audience Intelligence</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Customer Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Demographic distribution, purchasing behavior, and customer lifetime value metrics.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => {
              setRange(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none focus:border-primary"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="6m">Last 6 Months</option>
            <option value="all">All Time</option>
          </select>

          <Button variant="soft" onClick={loadCustomers}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* Summary KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Total Customers</p>
            <p className="text-xl font-bold text-foreground">
              {summary ? formatNumber(summary.totalCustomers) : "—"}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Active Customers</p>
            <p className="text-xl font-bold text-foreground">
              {summary ? formatNumber(summary.activeCustomers) : "—"}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">New Customers</p>
            <p className="text-xl font-bold text-foreground">
              {summary ? formatNumber(summary.newCustomers) : "—"}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Average Spending</p>
            <p className="text-xl font-bold text-foreground">
              {summary ? formatCurrency(summary.averageSpending) : "—"}
            </p>
          </div>
        </Card>
      </div>

      {/* Customer Datatable Card */}
      <Card>
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Customer Directory</h3>
            <p className="text-xs text-muted-foreground">Search by customer name, location, or customer ID.</p>
          </div>

          <div className="w-full md:w-80">
            <Input
              icon={<Search className="h-4 w-4" />}
              placeholder="Search customers..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <EmptyState title="Unable to load customer analytics from HDFS" description={error} icon="error" onRetry={loadCustomers} />
        ) : !data || data.items.length === 0 ? (
          <EmptyState title="No customers found" description="Try adjusting your search filter." icon="search" />
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/70 text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                  <tr>
                    <th className="px-4 py-3">Customer ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Orders</th>
                    <th className="px-4 py-3">Total Spending</th>
                    <th className="px-4 py-3">Avg Order</th>
                    <th className="px-4 py-3">Last Purchase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.items.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setLocation(`/customers/${c.id}`)}
                      className="group cursor-pointer transition hover:bg-muted/50"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-primary group-hover:underline">{c.id}</td>
                      <td className="px-4 py-3 font-bold text-foreground">{c.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.location}</td>
                      <td className="px-4 py-3">
                        <Badge tone={c.type === "high_value" ? "teal" : c.type === "new" ? "warn" : "neutral"}>{titleize(c.type)}</Badge>
                      </td>
                      <td className="px-4 py-3 font-mono">{formatNumber(c.orders)}</td>
                      <td className="px-4 py-3 font-bold text-foreground">{formatCurrency(c.spending)}</td>
                      <td className="px-4 py-3 font-mono">{formatCurrency(c.averageOrderValue)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.lastPurchase ? formatDate(c.lastPurchase) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Pagination page={data.page} total={data.total} pageSize={data.pageSize} setPage={setPage} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
