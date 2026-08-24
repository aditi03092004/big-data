import { spawn } from "node:child_process";
import path from "node:path";
import { config } from "../../config/env.js";
import { ServiceStatus } from "../../types/analyticsTypes.js";

const SPARK_JOBS = {
  "customer-analysis": "customer_analysis.py",
  "product-analysis": "product_analysis.py",
  "order-analysis": "order_analysis.py",
  "revenue-analysis": "revenue_analysis.py",
} as const;

export type SparkJobId = keyof typeof SPARK_JOBS;

export function isSparkConfigured(): boolean {
  return Boolean(config.sparkHome);
}

export async function checkSparkConnection(): Promise<ServiceStatus> {
  return isSparkConfigured() ? "connected" : "disconnected";
}

export function runSparkJob(jobId: SparkJobId): Promise<{ status: "completed" | "unavailable"; job: SparkJobId; output?: string }> {
  if (!isSparkConfigured()) {
    return Promise.resolve({ status: "unavailable", job: jobId, output: "Spark home is not set in environment." });
  }

  const scriptPath = path.resolve(process.cwd(), "..", "bigdata", "spark", SPARK_JOBS[jobId]);

  return new Promise((resolve) => {
    let stdout = "";
    const child = spawn("python3", [scriptPath], {
      env: { ...process.env },
      stdio: "pipe",
    });

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.once("close", (code) => {
      resolve({ status: code === 0 ? "completed" : "unavailable", job: jobId, output: stdout });
    });

    child.once("error", (err) => {
      resolve({ status: "unavailable", job: jobId, output: err.message });
    });
  });
}
