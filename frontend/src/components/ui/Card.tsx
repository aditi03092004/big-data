import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "", testId }) => {
  return (
    <div data-testid={testId} className={`rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-border/80 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <h3 className="text-base font-bold tracking-tight text-foreground">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
};
