import net from "net";
import { config } from "../../config/env.js";
import { GovernedQuery, ServiceStatus } from "../../types/analyticsTypes.js";

export const GOVERNED_QUERIES: GovernedQuery[] = [
  {
    id: "TOP_PRODUCTS",
    name: "Top 10 Products by Revenue",
    description: "Ranks products by total sales revenue and quantity sold using Apache Hive SQL aggregation.",
    engine: "hive",
    duration: "1.8s",
    sql: "SELECT product_id, SUM(amount) AS revenue, COUNT(*) AS units FROM orders GROUP BY product_id ORDER BY revenue DESC LIMIT 10;",
  },
  {
    id: "REVENUE_BY_CATEGORY",
    name: "Revenue by Product Category",
    description: "Aggregates revenue and order counts across product categories (Audio, Wearables, Computer, Lifestyle, Home).",
    engine: "hive",
    duration: "2.4s",
    sql: "SELECT p.category, SUM(o.amount) AS revenue FROM orders o JOIN products p ON o.product_id = p.product_id GROUP BY p.category ORDER BY revenue DESC;",
  },
  {
    id: "MONTHLY_REVENUE",
    name: "Monthly Revenue & Growth Trend",
    description: "Summarizes monthly sales revenue, order volumes, and average basket sizes over time.",
    engine: "spark",
    duration: "3.1s",
    sql: "SELECT YEAR(order_date) AS year, MONTH(order_date) AS month, SUM(amount) AS revenue FROM orders GROUP BY YEAR(order_date), MONTH(order_date) ORDER BY year, month;",
  },
  {
    id: "TOP_CUSTOMERS",
    name: "Top Customers by Lifetime Spend",
    description: "Identifies top high-value customer accounts and total orders completed.",
    engine: "hive",
    duration: "2.0s",
    sql: "SELECT customer_id, SUM(amount) AS spending, COUNT(*) AS orders FROM orders GROUP BY customer_id ORDER BY spending DESC LIMIT 10;",
  },
  {
    id: "ORDERS_BY_LOCATION",
    name: "Order Distribution by Metropolitan Region",
    description: "Groups order activity by customer location (Bengaluru, Mumbai, Delhi, Kolkata, Pune, Kochi).",
    engine: "hive",
    duration: "1.5s",
    sql: "SELECT location, COUNT(*) AS orders FROM orders GROUP BY location ORDER BY orders DESC;",
  },
  {
    id: "AVERAGE_DELIVERY_TIME",
    name: "Average Regional Delivery Time",
    description: "Calculates average fulfillment duration in days for delivered orders per geographic area.",
    engine: "spark",
    duration: "2.7s",
    sql: "SELECT o.location, AVG(d.delivery_days) AS avg_delivery_days FROM orders o JOIN delivery d ON o.order_id = d.order_id WHERE o.status = 'delivered' GROUP BY o.location;",
  },
  {
    id: "CANCELLED_ORDERS",
    name: "Order Cancellation Rate Analysis",
    description: "Tracks daily order cancellation count and loss value for operational review.",
    engine: "hive",
    duration: "1.4s",
    sql: "SELECT DATE(order_date) AS day, COUNT(*) AS cancelled FROM orders WHERE status = 'cancelled' GROUP BY DATE(order_date) ORDER BY day;",
  },
];

let cachedHiveStatus: ServiceStatus = "disconnected";

export function isHiveConfigured(): boolean {
  return Boolean(config.hiveHome);
}

export async function checkHiveConnection(): Promise<ServiceStatus> {
  if (!isHiveConfigured()) {
    cachedHiveStatus = "disconnected";
    return "disconnected";
  }

  return new Promise<ServiceStatus>((resolve) => {
    const socket = new net.Socket();
    const port = parseInt(process.env.HIVE_SERVER2_PORT || "10000", 10);
    const host = process.env.HIVE_SERVER2_HOST || "localhost";

    socket.setTimeout(2000);

    socket.on("connect", () => {
      socket.destroy();
      cachedHiveStatus = "connected";
      resolve("connected");
    });

    socket.on("timeout", () => {
      socket.destroy();
      cachedHiveStatus = "disconnected";
      resolve("disconnected");
    });

    socket.on("error", () => {
      socket.destroy();
      cachedHiveStatus = "disconnected";
      resolve("disconnected");
    });

    socket.connect(port, host);
  });
}

export function hiveStatus(): ServiceStatus {
  return cachedHiveStatus;
}

export function getGovernedQueries(): GovernedQuery[] {
  return GOVERNED_QUERIES;
}

export function getGovernedQueryById(queryId: string): GovernedQuery | undefined {
  return GOVERNED_QUERIES.find((q) => q.id === queryId);
}
