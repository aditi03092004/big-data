import React, { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, Package, Star, ShoppingCart, DollarSign, Tag } from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { LoadingState } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Product } from "../types";
import { fetchProductById } from "../services/api";
import { formatCurrency, formatNumber } from "../utils/formatters";

export const ProductDetailsPage: React.FC = () => {
  const { id = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProductById(id)
        .then(setProduct)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <LoadingState />;
  if (!product) return <EmptyState title="Product not found" description={`Could not locate SKU for ID ${id}`} icon="error" />;

  return (
    <div className="space-y-6">
      <Link href="/products" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Products Catalog
      </Link>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">{product.name}</h1>
            <Badge tone="teal">{product.category}</Badge>
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">SKU ID: {product.id} · Price: {formatCurrency(product.price)}</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Unit Selling Price</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(product.price)}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Total Units Sold</p>
            <p className="text-xl font-bold text-foreground">{formatNumber(product.quantitySold)}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Gross Revenue</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(product.revenue)}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
            <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Rating Score</p>
            <p className="text-xl font-bold text-foreground">{product.rating} / 5.0</p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Analytical Insights" subtitle="Product performance summary" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          {product.name} ({product.id}) has generated <strong>{formatCurrency(product.revenue)}</strong> across <strong>{formatNumber(product.quantitySold)} units</strong>. It maintains a top customer satisfaction rating of <strong>{product.rating} / 5.0</strong>.
        </p>
      </Card>
    </div>
  );
};
