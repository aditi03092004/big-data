import { config } from "../../config/env.js";
import { ServiceStatus } from "../../types/analyticsTypes.js";

const fileCache = new Map<string, { text: string; cachedAt: number }>();
const CACHE_TTL_MS = 60000; // 1 minute in-memory cache

export function getHdfsUrl(path: string, op: string = "GETFILESTATUS"): string | null {
  if (!config.hdfsNamenodeHost) return null;
  return `http://${config.hdfsNamenodeHost}:${config.hdfsNamenodePort}/webhdfs/v1${path}?op=${op}&user.name=${encodeURIComponent(config.hdfsUser)}`;
}

export async function checkHdfsConnection(): Promise<ServiceStatus> {
  const url = getHdfsUrl("/ecommerce");
  if (!url) return "disconnected";
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    return res.ok ? "connected" : "disconnected";
  } catch {
    return "disconnected";
  }
}

export async function listHdfsDirectory(path: string = "/ecommerce") {
  const url = getHdfsUrl(path, "LISTSTATUS");
  if (!url) return { status: "disconnected" as const, files: [] };
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return { status: "disconnected" as const, files: [] };
    const data = (await res.json()) as any;
    return {
      status: "connected" as const,
      files: data?.FileStatuses?.FileStatus || [],
    };
  } catch {
    return { status: "disconnected" as const, files: [] };
  }
}

export async function readHdfsFileText(path: string): Promise<string | null> {
  const cached = fileCache.get(path);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.text;
  }

  const url = getHdfsUrl(path, "OPEN");
  if (!url) return null;

  try {
    const res1 = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(5000) });
    let datanodeUrl = res1.headers.get("location");
    if (!datanodeUrl) {
      if (res1.ok) {
        const text = await res1.text();
        fileCache.set(path, { text, cachedAt: Date.now() });
        return text;
      }
      return null;
    }

    // Replace datanode hostname with config.hdfsNamenodeHost if resolution requires it
    datanodeUrl = datanodeUrl.replace(/http:\/\/[^:]+:/, `http://${config.hdfsNamenodeHost}:`);
    const res2 = await fetch(datanodeUrl, { signal: AbortSignal.timeout(10000) });
    if (!res2.ok) return null;

    const text = await res2.text();
    fileCache.set(path, { text, cachedAt: Date.now() });
    return text;
  } catch {
    return null;
  }
}

export async function getHdfsDatasets() {
  const isConnected = (await checkHdfsConnection()) === "connected";
  const datasets = [
    {
      name: "Customers Dataset",
      hdfsPath: "/ecommerce/customers",
      records: 10000,
      fileSize: "0.35 MB",
      storage: "Hadoop HDFS (Distributed)",
      processing: "Apache Spark Batch Engine",
      query: "Apache Hive SQL",
      lastProcessed: new Date().toISOString(),
      status: isConnected ? ("connected" as const) : ("disconnected" as const),
    },
    {
      name: "Products Catalog",
      hdfsPath: "/ecommerce/products",
      records: 5000,
      fileSize: "0.19 MB",
      storage: "Hadoop HDFS (Distributed)",
      processing: "Apache Spark Aggregation",
      query: "Apache Hive SQL",
      lastProcessed: new Date().toISOString(),
      status: isConnected ? ("connected" as const) : ("disconnected" as const),
    },
    {
      name: "Orders Log",
      hdfsPath: "/ecommerce/orders",
      records: 100000,
      fileSize: "9.04 MB",
      storage: "Hadoop HDFS (Distributed)",
      processing: "Apache Spark Streaming/Batch",
      query: "Apache Hive Analytical Engine",
      lastProcessed: new Date().toISOString(),
      status: isConnected ? ("connected" as const) : ("disconnected" as const),
    },
    {
      name: "Financial Transactions",
      hdfsPath: "/ecommerce/transactions",
      records: 100000,
      fileSize: "6.55 MB",
      storage: "Hadoop HDFS (Distributed)",
      processing: "Apache Spark ETL",
      query: "Apache Hive SQL",
      lastProcessed: new Date().toISOString(),
      status: isConnected ? ("connected" as const) : ("disconnected" as const),
    },
    {
      name: "Delivery Logs",
      hdfsPath: "/ecommerce/delivery",
      records: 100000,
      fileSize: "2.87 MB",
      storage: "Hadoop HDFS (Distributed)",
      processing: "Apache Spark PySpark Pipeline",
      query: "Apache Hive SQL",
      lastProcessed: new Date().toISOString(),
      status: isConnected ? ("connected" as const) : ("disconnected" as const),
    },
  ];
  return { isConnected, datasets };
}
