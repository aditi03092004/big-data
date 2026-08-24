export type DataMode = "demo" | "bigdata";

export type ServiceStatus = "connected" | "disconnected" | "checking" | "not_configured";

export interface HealthResponse {
  application: string;
  mode: DataMode;
  hdfs: ServiceStatus;
  spark: ServiceStatus;
  hive: ServiceStatus;
  kafka: ServiceStatus;
  mongodb: ServiceStatus;
  checkedAt: string;
}

export interface KPI {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

export interface DashboardSummary {
  kpis: KPI[];
  revenueTrend: Array<{ label: string; revenue: number; orders: number }>;
  ordersTrend: Array<{ label: string; orders: number }>;
  categoryRevenue: Array<{ label: string; value: number }>;
  topProducts: Array<{ id: string; label: string; category: string; value: number }>;
  ordersByLocation: Array<{ label: string; value: number }>;
  orderStatuses: Array<{ label: string; value: number }>;
  customerTypes: Array<{ label: string; value: number }>;
}

export interface CustomerSummary {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  averageSpending: number;
}

export interface CustomerRecord {
  id: string;
  name: string;
  location: string;
  orders: number;
  spending: number;
  averageOrderValue: number;
  lastPurchase: string;
  type: "high_value" | "returning" | "new" | "inactive";
  favoriteCategory?: string;
  purchaseHistory?: Array<{
    id: string;
    product: string;
    amount: number;
    status: string;
    orderDate: string;
  }>;
}

export interface ProductSummary {
  totalSkus: number;
  catalogRevenue: number;
  totalQuantitySold: number;
  topCategory: string;
}

export interface OrderSummary {
  totalOrders: number;
  delivered: number;
  processing: number;
  pending: number;
  cancelled: number;
  delayed: number;
}

export interface ProductRecord {
  id: string;
  name: string;
  category: string;
  price: number;
  quantitySold: number;
  revenue: number;
  rating: number;
}

export interface OrderRecord {
  id: string;
  customerId: string;
  customer: string;
  productId: string;
  product: string;
  amount: number;
  location: string;
  status: "delivered" | "processing" | "pending" | "cancelled" | "delayed";
  orderDate: string;
  deliveryDate?: string;
  deliveryTime?: number;
}

export interface RevenueSummary {
  kpis: KPI[];
  daily: Array<{ label: string; value: number }>;
  monthly: Array<{ label: string; value: number }>;
  yearly: Array<{ label: string; value: number }>;
  category: Array<{ label: string; value: number }>;
  location: Array<{ label: string; value: number }>;
  profitVsRevenue?: Array<{ month: string; revenue: number; profit: number; discount: number }>;
}

export interface LiveOrderEvent {
  id: string;
  orderId: string;
  customerId: string;
  productId: string;
  product: string;
  amount: number;
  location: string;
  timestamp: string;
  eventType: "ORDER_CREATED" | "ORDER_UPDATED";
}

export interface LiveSummary {
  streamStatus: "kafka" | "demo_stream" | "disconnected";
  ordersPerMinute: number;
  revenuePerMinute: number;
  eventsProcessed: number;
  activeEvents: number;
  events: LiveOrderEvent[];
}

export interface DatasetInfo {
  name: string;
  records: number;
  fileSize: string;
  storage: string;
  processing: string;
  query: string;
  lastProcessed: string;
  status: "connected" | "disconnected" | "processing";
  hdfsPath: string;
}

export interface GovernedQuery {
  id: string;
  name: string;
  description: string;
  engine: "hive" | "spark";
  duration: string;
  sql: string;
}

export interface QueryResult {
  queryId: string;
  status: "completed" | "failed";
  executionTime: string;
  rowsCount: number;
  columns: string[];
  rows: Array<Array<string | number>>;
  summary: string;
}

export interface ReportItem {
  id: string;
  type: "sales" | "customer" | "product" | "order" | "revenue";
  title: string;
  period: string;
  createdAt: string;
  status: "ready" | "generating" | "failed";
  downloadUrl?: string;
}
