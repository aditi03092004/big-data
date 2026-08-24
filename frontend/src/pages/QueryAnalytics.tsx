import React, { useState, useEffect } from "react";
import { Play, Sparkles, Table2, TerminalSquare, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { LoadingState } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { GovernedQuery, QueryResult } from "../types";
import { fetchQueries, runQuery } from "../services/api";

export const QueryAnalyticsPage: React.FC = () => {
  const [queries, setQueries] = useState<GovernedQuery[]>([]);
  const [selectedResult, setSelectedResult] = useState<QueryResult | null>(null);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueries()
      .then(setQueries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRunQuery = async (queryId: string) => {
    setRunningId(queryId);
    try {
      const result = await runQuery(queryId);
      setSelectedResult(result);
    } catch {
      // Error
    } finally {
      setRunningId(null);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">Governed Big Data Queries</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Apache Hive & Spark Query Catalog</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pre-compiled analytical query templates executing against HDFS tables in Hive & Spark.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        {/* Available Predefined Queries List */}
        <Card className="xl:col-span-2 space-y-3">
          <CardHeader title="Predefined Query Catalog" subtitle="Click 'Run Query' to execute Hive/Spark batch job" />
          <div className="space-y-3">
            {queries.map((q) => (
              <div key={q.id} className="rounded-xl border border-border bg-card p-4 transition hover:border-primary/50 hover:bg-muted/30">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{q.name}</span>
                      <Badge tone={q.engine === "spark" ? "teal" : "neutral"}>{q.engine}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{q.description}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted-foreground">ID: {q.id} · Avg {q.duration}</span>
                  <Button
                    size="sm"
                    variant="soft"
                    disabled={runningId === q.id}
                    onClick={() => handleRunQuery(q.id)}
                    testId={`button-run-query-${q.id}`}
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    {runningId === q.id ? "Running Hive..." : "Run Query"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Query Result Window */}
        <Card className="xl:col-span-3">
          <CardHeader
            title="Query Result Window"
            subtitle={selectedResult ? `Execution Output — Query ID: ${selectedResult.queryId}` : "Select a governed query on the left to execute."}
          />

          {selectedResult ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Status: {selectedResult.status}</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">Execution Latency: {selectedResult.executionTime}</span>
                </div>
                <p className="mt-2 text-xs text-foreground font-medium leading-relaxed">{selectedResult.summary}</p>
              </div>

              {/* Output Datatable */}
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted text-foreground font-bold uppercase tracking-wider">
                    <tr>
                      {selectedResult.columns.map((col) => (
                        <th key={col} className="px-4 py-3 border-b border-border">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {selectedResult.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/40">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-3 font-mono text-foreground">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState title="No query executed yet" description="Select a query from the catalog and click 'Run Query' to view execution results." icon="database" />
          )}
        </Card>
      </div>
    </div>
  );
};
