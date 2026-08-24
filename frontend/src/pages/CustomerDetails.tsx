import React, { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, User, ShoppingBag, MapPin, Calendar, CreditCard } from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { LoadingState } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Customer } from "../types";
import { fetchCustomerById } from "../services/api";
import { formatCurrency, formatDate, titleize } from "../utils/formatters";

export const CustomerDetailsPage: React.FC = () => {
  const { id = "" } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCustomerById(id)
        .then(setCustomer)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <LoadingState />;
  if (!customer) return <EmptyState title="Customer not found" description={`Could not locate record for ID ${id}`} icon="error" />;

  return (
    <div className="space-y-6">
      <Link href="/customers" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Customers Directory
      </Link>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">{customer.name}</h1>
            <Badge tone={customer.type === "high_value" ? "teal" : "neutral"}>{titleize(customer.type)}</Badge>
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">Customer ID: {customer.id} · Location: {customer.location}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-4">
          <CardHeader title="Customer Profile" subtitle="Account summary details" />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border/60 pb-2">
              <span className="text-muted-foreground">Total Orders</span>
              <span className="font-bold text-foreground">{customer.orders}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-2">
              <span className="text-muted-foreground">Lifetime Spending</span>
              <span className="font-bold text-primary">{formatCurrency(customer.spending)}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-2">
              <span className="text-muted-foreground">Average Basket Value</span>
              <span className="font-bold text-foreground">{formatCurrency(customer.averageOrderValue)}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-2">
              <span className="text-muted-foreground">Last Purchase Date</span>
              <span className="font-semibold text-foreground">{formatDate(customer.lastPurchase)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Preferred Category</span>
              <span className="font-semibold text-foreground">{customer.favoriteCategory || "Audio"}</span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Purchase History" subtitle="Order events registered for this account" />
          {customer.purchaseHistory && customer.purchaseHistory.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/70 text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {customer.purchaseHistory.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/40">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-primary">{o.id}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">{o.product}</td>
                      <td className="px-4 py-3 font-bold">{formatCurrency(o.amount)}</td>
                      <td className="px-4 py-3">
                        <Badge tone={o.status === "delivered" ? "good" : o.status === "cancelled" ? "bad" : "warn"}>{titleize(o.status)}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(o.orderDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No orders history" description="This customer has no completed orders recorded." />
          )}
        </Card>
      </div>
    </div>
  );
};
