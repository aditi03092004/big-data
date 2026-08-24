import React, { useState, useEffect } from "react";
import { Database, HardDrive, Cpu, TerminalSquare, RefreshCw, CheckCircle, Folder } from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { LoadingState } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Dataset } from "../types";
import { fetchDatasets } from "../services/api";
import { formatNumber, formatDate } from "../utils/formatters";

export const DataExplorerPage: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDatasets = async () => {
    setLoading(true);
    try {
      const data = await fetchDatasets();
      setDatasets(data);
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatasets();
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">Data Plane Lineage</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Big Data Explorer</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Distributed dataset registry detailing HDFS storage paths, PySpark processing transformations, and Hive query engines.
          </p>
        </div>

        <Button variant="soft" onClick={loadDatasets}>
          <RefreshCw className="h-4 w-4" /> Refresh Datasets
        </Button>
      </div>

      {!datasets || datasets.length === 0 ? (
        <EmptyState title="No datasets registered" description="Failed to fetch dataset metadata from HDFS backend." icon="database" onRetry={loadDatasets} />
      ) : (
        <div className="grid gap-6">
          {datasets.map((d, i) => (
            <Card key={d.name} className="transition hover:border-primary/40">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-foreground">{d.name}</h3>
                      <Badge tone={d.status === "connected" ? "good" : "warn"}>{d.status}</Badge>
                    </div>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      HDFS Path: <code className="font-bold text-primary">{d.hdfsPath}</code> · {formatNumber(d.records)} Records · {d.fileSize}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">Layer {String(i + 1).padStart(2, "0")}</span>
                </div>
              </div>

              {/* Architecture Triad */}
              <div className="mt-5 grid gap-4 border-t border-border pt-4 text-xs sm:grid-cols-3">
                <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground font-mono uppercase tracking-wider text-[10px] font-bold">
                    <HardDrive className="h-3.5 w-3.5 text-primary" /> Storage Engine
                  </div>
                  <p className="mt-1.5 font-bold text-foreground text-sm">{d.storage}</p>
                </div>

                <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground font-mono uppercase tracking-wider text-[10px] font-bold">
                    <Cpu className="h-3.5 w-3.5 text-accent" /> Processing Framework
                  </div>
                  <p className="mt-1.5 font-bold text-foreground text-sm">{d.processing}</p>
                </div>

                <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground font-mono uppercase tracking-wider text-[10px] font-bold">
                    <TerminalSquare className="h-3.5 w-3.5 text-teal-600" /> Analytical Query Engine
                  </div>
                  <p className="mt-1.5 font-bold text-foreground text-sm">{d.query}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Last Processed: {formatDate(d.lastProcessed)}</span>
                <span className="font-mono text-xs font-semibold text-primary">Status: Healthy</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
