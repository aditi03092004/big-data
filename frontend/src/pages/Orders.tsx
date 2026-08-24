import React, { useState, useEffect } from "react";
import { Search, ShoppingBag, CheckCircle, Clock, AlertTriangle, XCircle, Truck, RefreshCw } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Pagination } from "../components/ui/Pagination";
import { LoadingState } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Order, OrderSummary, PaginatedResult } from "../types";
import { fetchOrders } from "../services/api";
import { formatCurrency, formatDate, formatNumber, titleize } from "../utils/formatters";

export const OrdersPage: React.FC = () => {
  const [range, setRange] = useState("30d");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [location, setLocation] = useState("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<(PaginatedResult<Order> & { mode?: string; summary?: OrderSummary }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchOrders({ range, search, status, location, page, pageSize: 10 });
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Unable to load order analytics from HDFS");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [range, search, status, location, page]);

  const summary = data?.summary;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">Fulfillment Operations</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Order & Delivery Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Order lifecycle status tracking, delivery latency metrics, and cancellation rates.</p>
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

          <Button variant="soft" onClick={loadOrders}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Card className="flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Orders</span>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {summary ? formatNumber(summary.totalOrders) : "—"}
          </p>
        </Card>

        <Card className="flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Delivered</span>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-emerald-600">
            {summary ? formatNumber(summary.delivered) : "—"}
          </p>
        </Card>

        <Card className="flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Processing</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-amber-600">
            {summary ? formatNumber(summary.processing) : "—"}
          </p>
        </Card>

        <Card className="flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending</span>
            <Truck className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-blue-600">
            {summary ? formatNumber(summary.pending) : "—"}
          </p>
        </Card>

        <Card className="flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cancelled</span>
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-red-600">
            {summary ? formatNumber(summary.cancelled) : "—"}
          </p>
        </Card>

        <Card className="flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Delayed</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-amber-600">
            {summary ? formatNumber(summary.delayed) : "—"}
          </p>
        </Card>
      </div>

      {/* Table Card */}
      <Card>
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Order & Delivery Stream</h3>
            <p className="text-xs text-muted-foreground">Filter orders by status, location, or search query.</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              value={status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setStatus(e.target.value); setPage(1); }}
              className="h-10 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none focus:border-primary"
            >
              <option value="all">All Statuses</option>
              <option value="delivered">Delivered</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="delayed">Delayed</option>
            </select>

            <select
              value={location}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setLocation(e.target.value); setPage(1); }}
              className="h-10 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none focus:border-primary"
            >
              <option value="all">All Locations</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Pune">Pune</option>
              <option value="Kochi">Kochi</option>
            </select>

            <div className="w-full sm:w-60">
              <Input icon={<Search className="h-4 w-4" />} placeholder="Search order ID..." value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(1); }} />
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <EmptyState title="Unable to load order analytics from HDFS" description={error} icon="error" onRetry={loadOrders} />
        ) : !data || data.items.length === 0 ? (
          <EmptyState title="No orders match your filter" description="Try clearing filters or changing your search criteria." icon="search" />
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/70 text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Order Date</th>
                    <th className="px-4 py-3">Delivery Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.items.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/40">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-primary">{o.id}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">{o.customer}</td>
                      <td className="px-4 py-3 text-muted-foreground">{o.product}</td>
                      <td className="px-4 py-3 font-bold">{formatCurrency(o.amount)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{o.location}</td>
                      <td className="px-4 py-3">
                        <Badge tone={o.status === "delivered" ? "good" : o.status === "cancelled" ? "bad" : "warn"}>{titleize(o.status)}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(o.orderDate)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{o.deliveryTime ? `${o.deliveryTime} Days` : "In Transit"}</td>
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
