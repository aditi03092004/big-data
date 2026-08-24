import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { HealthSummary } from "../../types";
import { fetchHealth } from "../../services/api";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [health, setHealth] = useState<HealthSummary | undefined>(undefined);

  const loadHealth = async () => {
    try {
      const data = await fetchHealth();
      setHealth(data);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    loadHealth();
    const interval = setInterval(loadHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} mode={health?.mode || "demo"} />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Header onOpenSidebar={() => setSidebarOpen(true)} health={health} onRefreshHealth={loadHealth} />
        <main className="grid-paper flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
};
