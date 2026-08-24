import React from "react";
import { Route, Switch, Redirect } from "wouter";
import { AppLayout } from "../components/layout/AppLayout";
import { LoginPage } from "../pages/Login";
import { DashboardPage } from "../pages/Dashboard";
import { CustomersPage } from "../pages/Customers";
import { CustomerDetailsPage } from "../pages/CustomerDetails";
import { ProductsPage } from "../pages/Products";
import { ProductDetailsPage } from "../pages/ProductDetails";
import { OrdersPage } from "../pages/Orders";
import { RevenuePage } from "../pages/Revenue";
import { LiveAnalyticsPage } from "../pages/LiveAnalytics";
import { DataExplorerPage } from "../pages/DataExplorer";
import { QueryAnalyticsPage } from "../pages/QueryAnalytics";
import { ReportsPage } from "../pages/Reports";
import { SettingsPage } from "../pages/Settings";
import { NotFoundPage } from "../pages/NotFound";

export const AppRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route>
        <AppLayout>
          <Switch>
            <Route path="/" component={() => <Redirect to="/dashboard" />} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/customers" component={CustomersPage} />
            <Route path="/customers/:id" component={CustomerDetailsPage} />
            <Route path="/products" component={ProductsPage} />
            <Route path="/products/:id" component={ProductDetailsPage} />
            <Route path="/orders" component={OrdersPage} />
            <Route path="/revenue" component={RevenuePage} />
            <Route path="/live" component={LiveAnalyticsPage} />
            <Route path="/data-explorer" component={DataExplorerPage} />
            <Route path="/queries" component={QueryAnalyticsPage} />
            <Route path="/reports" component={ReportsPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </AppLayout>
      </Route>
    </Switch>
  );
};
