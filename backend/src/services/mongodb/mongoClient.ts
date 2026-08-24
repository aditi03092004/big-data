import { MongoClient, Db, MongoClientOptions } from "mongodb";
import { config } from "../../config/env.js";

let clientInstance: MongoClient | null = null;
let lastUri: string = "";

const defaultOptions: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 3000,
  connectTimeoutMS: 5000,
};

export function getMongoClient(): MongoClient | null {
  const uri = config.mongodbUri;
  if (!uri) {
    return null;
  }

  if (!clientInstance || lastUri !== uri) {
    if (clientInstance) {
      clientInstance.close().catch(() => {});
    }
    lastUri = uri;
    clientInstance = new MongoClient(uri, defaultOptions);
  }

  return clientInstance;
}

export function getMongoDb(): Db | null {
  const client = getMongoClient();
  if (!client) {
    return null;
  }
  return client.db(config.mongodbDbName);
}

export async function ensureMongoConnected(): Promise<MongoClient | null> {
  const client = getMongoClient();
  if (!client) {
    return null;
  }

  try {
    // Only connect if not already connected
    await client.connect();
    return client;
  } catch (err: any) {
    console.error("[MongoDB Client] Connection failed:", err?.message || err);
    throw err;
  }
}

export async function closeMongoClient(): Promise<void> {
  if (clientInstance) {
    try {
      await clientInstance.close();
      console.log("[MongoDB Client] Connection pool closed.");
    } catch (err: any) {
      console.error("[MongoDB Client] Error closing connection:", err?.message || err);
    } finally {
      clientInstance = null;
    }
  }
}
