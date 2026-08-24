import React from "react";
import { DataMode } from "../../types";
import { Badge } from "../ui/Badge";

export const DataModeBadge: React.FC<{ mode: DataMode }> = ({ mode }) => {
  if (mode === "bigdata") {
    return (
      <Badge tone="teal" className="shadow-sm">
        <span className="h-2 w-2 animate-pulse rounded-full bg-teal-500" /> BIG DATA MODE
      </Badge>
    );
  }

  return (
    <Badge tone="warn" className="shadow-sm">
      <span className="h-2 w-2 rounded-full bg-amber-500" /> DEMO MODE
    </Badge>
  );
};
