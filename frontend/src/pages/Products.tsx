import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, Package, ShoppingCart, DollarSign, Award, Star, RefreshCw } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Pagination } from "../components/ui/Pagination";
import { LoadingState } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Product, ProductSummary, PaginatedResult } from "../types";
import { fetchProducts } from "../services/api";
import { formatCurrency, formatNumber } from "../utils/formatters";

export const ProductsPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [range, setRange] = useState("30d");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<(PaginatedResult<Product> & { mode?: string; summary?: ProductSummary }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchProducts({ range, search, category, page, pageSize: 10 });
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Unable to load product analytics from HDFS");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [range, search, category, page]);

  const summary = data?.summary;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">Merchandising Intelligence</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Product & Sales Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Catalog velocity, revenue yield per SKU, inventory turnover, and rating scores.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => {
              setRange(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none focus:border-primary"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="6m">Last 6 Months</option>
            <option value="all">All Time</option>
          </select>

          <Button variant="soft" onClick={loadProducts}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* Summary KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Total SKUs</p>
            <p className="text-xl font-bold text-foreground">
              {summary ? formatNumber(summary.totalSkus) : "—"}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Quantity Sold</p>
            <p className="text-xl font-bold text-foreground">
              {summary ? `${formatNumber(summary.totalQuantitySold)} units` : "—"}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Catalog Revenue</p>
            <p className="text-xl font-bold text-foreground">
              {summary ? formatCurrency(summary.catalogRevenue) : "—"}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Top Category</p>
            <p className="text-xl font-bold text-foreground">
              {summary ? summary.topCategory : "—"}
            </p>
          </div>
        </Card>
      </div>

      {/* Datatable */}
      <Card>
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Product Performance Catalog</h3>
            <p className="text-xs text-muted-foreground">Filter by SKU category, name, or search query.</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              value={category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setCategory(e.target.value); setPage(1); }}
              className="h-10 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none focus:border-primary"
            >
              <option value="all">All Categories</option>
              <option value="Audio">Audio</option>
              <option value="Wearables">Wearables</option>
              <option value="Computer">Computer</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Home">Home</option>
            </select>

            <div className="w-full sm:w-64">
              <Input icon={<Search className="h-4 w-4" />} placeholder="Search products..." value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(1); }} />
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <EmptyState title="Unable to load product analytics from HDFS" description={error} icon="error" onRetry={loadProducts} />
        ) : !data || data.items.length === 0 ? (
          <EmptyState title="No products found" description="Try selecting a different category or search term." icon="search" />
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/70 text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                  <tr>
                    <th className="px-4 py-3">Product ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Quantity Sold</th>
                    <th className="px-4 py-3">Total Revenue</th>
                    <th className="px-4 py-3">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.items.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setLocation(`/products/${p.id}`)}
                      className="group cursor-pointer transition hover:bg-muted/50"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-primary group-hover:underline">{p.id}</td>
                      <td className="px-4 py-3 font-bold text-foreground">{p.name}</td>
                      <td className="px-4 py-3"><Badge tone="neutral">{p.category}</Badge></td>
                      <td className="px-4 py-3 font-mono">{formatCurrency(p.price)}</td>
                      <td className="px-4 py-3 font-mono">{formatNumber(p.quantitySold)}</td>
                      <td className="px-4 py-3 font-bold text-foreground">{formatCurrency(p.revenue)}</td>
                      <td className="px-4 py-3 font-semibold text-amber-600 flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {p.rating}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Pagination page={data.page} total={data.total} pageSize={data.pageSize} setPage={setPage} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
