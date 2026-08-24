import React, { useState, useEffect } from "react";
import { FileBarChart, Download, Plus, FileText, CheckCircle, RefreshCw } from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { LoadingState } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ReportItem } from "../types";
import { fetchReports, generateReport } from "../services/api";
import { formatDate, titleize } from "../utils/formatters";

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [type, setType] = useState<ReportItem["type"]>("sales");
  const [period, setPeriod] = useState("Last 30 Days");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await fetchReports();
      setReports(data);
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateReport(type, period);
      loadReports();
    } catch {
      // Error
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = (reportId: string, format: "csv" | "pdf") => {
    window.open(`/api/reports/export?id=${reportId}&format=${format}`, "_blank");
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">Executive Handoffs</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Analytical Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">Generate and export operational summaries for leadership and audit reviews.</p>
        </div>

        <Button variant="soft" onClick={loadReports}>
          <RefreshCw className="h-4 w-4" /> Refresh History
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report Generation Form */}
        <Card>
          <CardHeader title="Generate Analytical Report" subtitle="Compile report summary from data pipeline" />
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Report Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ReportItem["type"])}
                className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="sales">Sales Analytical Report</option>
                <option value="customer">Customer Retention Report</option>
                <option value="product">Product Performance Report</option>
                <option value="order">Order Fulfillment Report</option>
                <option value="revenue">Revenue Pulse Report</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Reporting Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Q2 2026">Q2 2026</option>
                <option value="This Year">This Year</option>
              </select>
            </div>

            <Button onClick={handleGenerate} disabled={generating} className="w-full">
              <Plus className="h-4 w-4" /> {generating ? "Compiling Report..." : "Generate New Report"}
            </Button>
          </div>
        </Card>

        {/* Report History */}
        <Card className="lg:col-span-2">
          <CardHeader title="Generated Reports History" subtitle="Export CSV or PDF summaries" />
          {reports.length === 0 ? (
            <EmptyState title="No reports generated yet" description="Generate your first report using the form." icon="database" />
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-card p-4 transition sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileBarChart className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{r.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {titleize(r.type)} Report · {r.period} · Created {formatDate(r.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleExport(r.id, "csv")}>
                      <Download className="h-3.5 w-3.5" /> CSV
                    </Button>
                    <Button size="sm" variant="soft" onClick={() => handleExport(r.id, "pdf")}>
                      <Download className="h-3.5 w-3.5" /> PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
