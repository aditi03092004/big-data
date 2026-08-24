import React from "react";
import { Link } from "wouter";
import { Gauge, LayoutDashboard } from "lucide-react";
import { Button } from "../components/ui/Button";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
      <div className="rounded-2xl bg-primary/10 p-5 text-primary mb-4">
        <Gauge className="h-10 w-10" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">404 — Page Not Found</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        The requested analytics module or route does not exist in this application.
      </p>
      <Link href="/dashboard" className="mt-6">
        <Button>
          <LayoutDashboard className="h-4 w-4" /> Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
