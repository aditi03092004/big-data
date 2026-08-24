import React from "react";
import { Database, SearchX, AlertTriangle } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "database" | "search" | "error";
  onRetry?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon = "database", onRetry }) => {
  const icons = {
    database: <Database className="h-10 w-10 text-muted-foreground" />,
    search: <SearchX className="h-10 w-10 text-muted-foreground" />,
    error: <AlertTriangle className="h-10 w-10 text-destructive" />,
  };

  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-8 text-center">
      <div className="mb-3 rounded-full bg-muted/60 p-4">{icons[icon]}</div>
      <h4 className="text-base font-bold text-foreground">{title}</h4>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button variant="soft" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
};
