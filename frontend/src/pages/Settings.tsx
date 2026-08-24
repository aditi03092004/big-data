import React, { useState, useEffect } from "react";
import { Server, User, RefreshCw, Lock, CheckCircle, Database } from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { LoadingState } from "../components/ui/Skeleton";
import { ServiceStatusBadge } from "../components/status/ServiceStatusBadge";
import { HealthSummary } from "../types";
import { fetchHealth, fetchProfile, saveProfile } from "../services/api";

export const SettingsPage: React.FC = () => {
  const [health, setHealth] = useState<HealthSummary | null>(null);
  const [name, setName] = useState("Big Data Admin");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [healthData, profileData] = await Promise.all([
        fetchHealth(),
        fetchProfile().catch(() => null),
      ]);
      setHealth(healthData);
      if (profileData?.fullName) {
        setName(profileData.fullName);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      await saveProfile({ email: "admin@ecommerce-analytics.io", fullName: name, role: "admin" });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">System & Environment</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Platform Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Infrastructure connectivity configurations, user profile, and execution mode details.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <Card className="space-y-4">
          <CardHeader title="User Profile" subtitle="Account preferences for this session" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary font-bold text-lg text-primary-foreground">
                BD
              </div>
              <div>
                <p className="font-bold text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground">Big Data Software Engineer & Architect</p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Display Name</label>
              <Input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4 border border-border">
              <div>
                <p className="text-sm font-bold text-foreground">Current Operating Mode</p>
                <p className="text-xs text-muted-foreground">Defined via environment variable DATA_MODE</p>
              </div>
              <Badge tone={health?.mode === "bigdata" ? "teal" : "warn"}>
                {health?.mode === "bigdata" ? "BIG DATA MODE" : "DEMO MODE"}
              </Badge>
            </div>

            <Button onClick={handleSave} className="w-full">
              {saved ? <CheckCircle className="h-4 w-4" /> : null}
              {saved ? "Preferences Saved" : "Save Profile"}
            </Button>
          </div>
        </Card>

        {/* Big Data Connections Status */}
        <Card className="space-y-4">
          <CardHeader
            title="Big Data Infrastructure Connections"
            subtitle="Actual real-time driver integration checks"
            action={
              <Button size="sm" variant="soft" onClick={loadData}>
                <RefreshCw className="h-3.5 w-3.5" /> Re-check Connections
              </Button>
            }
          />

          <div className="space-y-3">
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

          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 text-xs leading-relaxed text-amber-900">
            <p className="font-bold mb-1">Architecture Integration Note:</p>
            When <code className="font-mono font-bold text-amber-950">DATA_MODE=bigdata</code> is enabled in environment settings, APIs interact directly with HDFS Namenode WebHDFS, PySpark job executors, Hive JDBC engine, and Kafka cluster brokers.
          </div>
        </Card>
      </div>
    </div>
  );
};
