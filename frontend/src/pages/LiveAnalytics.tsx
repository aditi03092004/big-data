import React, { useState, useEffect } from "react";
import { Radio, RefreshCw, Plus, CheckCircle, ShoppingBag, Zap } from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { LoadingState } from "../components/ui/Skeleton";
import { LiveOrderEvent, LiveSummary } from "../types";
import { fetchLiveSummary, publishLiveOrder } from "../services/api";
import { formatCurrency, formatNumber, formatTime } from "../utils/formatters";

export const LiveAnalyticsPage: React.FC = () => {
  const [summary, setSummary] = useState<LiveSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState("Pulse ANC Headphones");
  const [amount, setAmount] = useState("12999");
  const [location, setLocation] = useState("Bengaluru");
  const [publishing, setPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const loadLiveSummary = async () => {
    try {
      const data = await fetchLiveSummary();
      setSummary(data);
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLiveSummary();

    const es = new EventSource("/api/live/stream");

    es.onmessage = (event) => {
      try {
        const newOrder: LiveOrderEvent = JSON.parse(event.data);
        setSummary((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            eventsProcessed: prev.eventsProcessed + 1,
            activeEvents: prev.activeEvents + 1,
            events: [newOrder, ...prev.events.slice(0, 49)],
          };
        });
      } catch {
        // Parse error
      }
    };

    const interval = setInterval(loadLiveSummary, 5000);

    return () => {
      es.close();
      clearInterval(interval);
    };
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !amount || !location) return;

    setPublishing(true);
    setPublishedSuccess(false);

    try {
      await publishLiveOrder({ product, amount: parseFloat(amount), location });
      setPublishedSuccess(true);
      setTimeout(() => setPublishedSuccess(false), 3000);
      loadLiveSummary();
    } catch {
      // Error publishing
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">Apache Kafka Event Stream</p>
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Live Streaming Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time event stream consuming from Kafka topic <code className="font-mono text-xs text-primary font-bold">ecommerce-orders</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge tone={summary?.streamStatus === "kafka" ? "good" : "warn"}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
            {summary?.streamStatus === "kafka" ? "Kafka Active" : "Demo Stream Active"}
          </Badge>
          <Button variant="soft" onClick={loadLiveSummary}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* Real-time KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Radio className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Orders / Minute</p>
            <p className="text-2xl font-bold text-foreground">{summary?.ordersPerMinute || 42}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Revenue / Minute</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(summary?.revenuePerMinute || 38450)}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Total Events Processed</p>
            <p className="text-2xl font-bold text-foreground">{formatNumber(summary?.eventsProcessed || 142089)}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Buffer Active Events</p>
            <p className="text-2xl font-bold text-foreground">{summary?.activeEvents || 0}</p>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Live Order Datatable */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Live Kafka Order Stream"
            subtitle="New events appear automatically via SSE without manual page refresh"
          />

          <div className="max-h-[440px] overflow-y-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-muted text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                <tr>
                  <th className="px-4 py-3">Event Type</th>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {summary?.events && summary.events.length > 0 ? (
                  summary.events.map((evt) => (
                    <tr key={evt.id} className="animate-fadeIn transition hover:bg-muted/40">
                      <td className="px-4 py-3">
                        <Badge tone={evt.eventType === "ORDER_CREATED" ? "good" : "teal"}>{evt.eventType}</Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-bold text-primary">{evt.orderId}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">{evt.product}</td>
                      <td className="px-4 py-3 font-bold text-foreground">{formatCurrency(evt.amount)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{evt.location}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{formatTime(evt.timestamp)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Waiting for Kafka events...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Publish Test Event Form */}
        <Card>
          <CardHeader title="Publish Order Event" subtitle="Simulate or push an event to Kafka topic" />
          <form onSubmit={handlePublish} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Name</label>
              <Input value={product} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProduct(e.target.value)} required />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Amount (₹)</label>
              <Input type="number" value={amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)} required />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</label>
              <select
                value={location}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLocation(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Pune">Pune</option>
                <option value="Kochi">Kochi</option>
              </select>
            </div>

            <Button type="submit" disabled={publishing} className="w-full">
              <Plus className="h-4 w-4" /> {publishing ? "Publishing to Kafka..." : "Publish Event to Stream"}
            </Button>

            {publishedSuccess && (
              <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                <CheckCircle className="h-4 w-4" /> Event successfully emitted to topic <code className="font-mono font-bold">ecommerce-orders</code>!
              </p>
            )}

            <p className="text-xs text-muted-foreground leading-relaxed">
              Events published here immediately write to the event pipeline and push to connected SSE dashboards in real-time.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};
