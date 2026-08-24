import dotenv from "dotenv";

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.BACKEND_PORT || "5000", 10),
  get dataMode(): "demo" | "bigdata" {
    dotenv.config({ override: true });
    return process.env.DATA_MODE === "bigdata" ? "bigdata" : "demo";
  },
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

  // MongoDB
  get mongodbUri(): string {
    dotenv.config({ override: true });
    return (process.env.MONGODB_URI || "").trim();
  },
  get mongodbDbName(): string {
    dotenv.config({ override: true });
    return (process.env.MONGODB_DB_NAME || "ecommerce_analytics").trim();
  },

  // HDFS
  hdfsNamenodeHost: process.env.HDFS_NAMENODE_HOST || "localhost",
  hdfsNamenodePort: process.env.HDFS_NAMENODE_PORT || "9870",
  hdfsUser: process.env.HDFS_USER || "arihant",

  // Kafka
  kafkaBrokers: process.env.KAFKA_BROKERS || "",
  kafkaTopic: process.env.KAFKA_TOPIC || "ecommerce-orders",

  // Spark & Hive
  sparkHome: process.env.SPARK_HOME || "",
  hiveHome: process.env.HIVE_HOME || "",
};
