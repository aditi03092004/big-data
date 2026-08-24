import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatNumber } from "../../utils/formatters";

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  setPage: (p: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, total, pageSize, setPage }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = Math.min((page - 1) * pageSize + 1, total);
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
      <span>
        Showing <strong className="text-foreground">{formatNumber(start)}</strong>–<strong className="text-foreground">{formatNumber(end)}</strong> of {formatNumber(total)} records
      </span>

      <div className="flex items-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="rounded-lg border border-border bg-card p-2 text-foreground transition hover:bg-muted disabled:opacity-40"
          data-testid="button-previous-page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-mono text-xs font-semibold text-foreground">
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="rounded-lg border border-border bg-card p-2 text-foreground transition hover:bg-muted disabled:opacity-40"
          data-testid="button-next-page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
