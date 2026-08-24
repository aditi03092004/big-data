import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  tone?: "good" | "warn" | "bad" | "neutral" | "teal";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, tone = "neutral", className = "" }) => {
  const styles = {
    good: "bg-emerald-100 text-emerald-800 border-emerald-200",
    warn: "bg-amber-100 text-amber-800 border-amber-200",
    bad: "bg-red-100 text-red-800 border-red-200",
    teal: "bg-teal-100 text-teal-800 border-teal-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${styles[tone]} ${className}`}>
      {children}
    </span>
  );
};
