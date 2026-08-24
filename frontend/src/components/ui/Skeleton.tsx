import React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return <div className={`animate-pulse rounded-lg bg-muted/80 ${className}`} />;
};

export const LoadingState: React.FC = () => {
  return (
    <div className="space-y-4 p-2">
      <Skeleton className="h-28 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
};
