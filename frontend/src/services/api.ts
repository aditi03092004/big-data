import axios from "axios";
import {
  Customer,
  CustomerSummary,
  DashboardSummary,
  Dataset,
  GovernedQuery,
  HealthSummary,
  LiveOrderEvent,
  LiveSummary,
  Order,
  OrderSummary,
  PaginatedResult,
  Product,
  ProductSummary,
  QueryResult,
  ReportItem,
  RevenueSummary,
} from "../types";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchHealth = async (): Promise<HealthSummary> => {
  const res = await api.get<HealthSummary>("/health");
  return res.data;
};

export const fetchDashboardSummary = async (range: string = "30d"): Promise<DashboardSummary> => {
  const res = await api.get<DashboardSummary>("/dashboard/summary", { params: { range } });
  return res.data;
};

export const fetchCustomerSummary = async (range: string = "30d"): Promise<{ mode: string; summary: CustomerSummary }> => {
  const res = await api.get<{ mode: string; summary: CustomerSummary }>("/customers/summary", { params: { range } });
  return res.data;
};

export const fetchCustomers = async (params: { range?: string; search?: string; page?: number; pageSize?: number }): Promise<PaginatedResult<Customer> & { mode?: string; summary?: CustomerSummary }> => {
  const res = await api.get<PaginatedResult<Customer> & { mode?: string; summary?: CustomerSummary }>("/customers", { params });
  return res.data;
};

export const fetchCustomerById = async (id: string): Promise<Customer> => {
  const res = await api.get<Customer>(`/customers/${id}`);
  return res.data;
};

export const fetchProductSummary = async (range: string = "30d"): Promise<{ mode: string; summary: ProductSummary }> => {
  const res = await api.get<{ mode: string; summary: ProductSummary }>("/products/summary", { params: { range } });
  return res.data;
};

export const fetchProducts = async (params: { range?: string; search?: string; category?: string; page?: number; pageSize?: number }): Promise<PaginatedResult<Product> & { mode?: string; summary?: ProductSummary }> => {
  const res = await api.get<PaginatedResult<Product> & { mode?: string; summary?: ProductSummary }>("/products", { params });
  return res.data;
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const res = await api.get<Product>(`/products/${id}`);
  return res.data;
};

export const fetchOrderSummary = async (range: string = "30d"): Promise<{ mode: string; summary: OrderSummary }> => {
  const res = await api.get<{ mode: string; summary: OrderSummary }>("/orders/summary", { params: { range } });
  return res.data;
};

export const fetchOrders = async (params: { range?: string; search?: string; status?: string; location?: string; page?: number; pageSize?: number }): Promise<PaginatedResult<Order> & { mode?: string; summary?: OrderSummary }> => {
  const res = await api.get<PaginatedResult<Order> & { mode?: string; summary?: OrderSummary }>("/orders", { params });
  return res.data;
};

export const fetchOrderById = async (id: string): Promise<Order> => {
  const res = await api.get<Order>(`/orders/${id}`);
  return res.data;
};

export const fetchRevenueSummary = async (range: string = "30d"): Promise<RevenueSummary & { mode?: string }> => {
  const res = await api.get<RevenueSummary & { mode?: string }>("/revenue/summary", { params: { range } });
  return res.data;
};

export const fetchLiveSummary = async (): Promise<LiveSummary> => {
  const res = await api.get<LiveSummary>("/live/summary");
  return res.data;
};

export const publishLiveOrder = async (data: { product: string; amount: number; location: string }): Promise<{ status: string; event: LiveOrderEvent }> => {
  const res = await api.post<{ status: string; event: LiveOrderEvent }>("/live/publish", data);
  return res.data;
};

export const fetchDatasets = async (): Promise<Dataset[]> => {
  const res = await api.get<Dataset[]>("/datasets");
  return res.data;
};

export const fetchQueries = async (): Promise<GovernedQuery[]> => {
  const res = await api.get<GovernedQuery[]>("/queries");
  return res.data;
};

export const runQuery = async (queryId: string): Promise<QueryResult> => {
  const res = await api.post<QueryResult>("/queries/run", { queryId });
  return res.data;
};

export const fetchReports = async (): Promise<ReportItem[]> => {
  const res = await api.get<ReportItem[]>("/reports");
  return res.data;
};

export const generateReport = async (type: string, period: string): Promise<ReportItem> => {
  const res = await api.post<ReportItem>("/reports/generate", { type, period });
  return res.data;
};

export const fetchPreferences = async (userId: string = "usr-admin-01"): Promise<any> => {
  const res = await api.get("/preferences", { params: { userId } });
  return res.data;
};

export const savePreferences = async (data: any): Promise<any> => {
  const res = await api.post("/preferences", data);
  return res.data;
};

export const fetchProfile = async (email: string = "admin@ecommerce-analytics.io"): Promise<any> => {
  const res = await api.get("/profile", { params: { email } });
  return res.data;
};

export const saveProfile = async (data: any): Promise<any> => {
  const res = await api.post("/profile", data);
  return res.data;
};

export const fetchFilters = async (userId: string = "usr-admin-01"): Promise<any[]> => {
  const res = await api.get("/filters", { params: { userId } });
  return res.data;
};

export const saveFilter = async (data: any): Promise<any> => {
  const res = await api.post("/filters", data);
  return res.data;
};

export const deleteFilter = async (id: string): Promise<any> => {
  const res = await api.delete(`/filters/${id}`);
  return res.data;
};

export const triggerSparkJob = async (jobId: string): Promise<{ status: string; job: string; output?: string }> => {
  const res = await api.post<{ status: string; job: string; output?: string }>(`/bigdata/spark/${jobId}`);
  return res.data;
};

export default api;
