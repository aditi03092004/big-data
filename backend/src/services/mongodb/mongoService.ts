import { Collection, Document } from "mongodb";
import { config } from "../../config/env.js";
import { ReportItem, ServiceStatus } from "../../types/analyticsTypes.js";
import { getMongoClient, getMongoDb } from "./mongoClient.js";

export interface MongoReportDocument extends Omit<ReportItem, "id"> {
  _id?: any;
  id: string;
  updatedAt?: string;
}

export interface MongoSavedFilterDocument {
  _id?: any;
  id: string;
  name: string;
  filterType: string;
  filterConfig: Record<string, any>;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MongoDashboardPreferenceDocument {
  _id?: any;
  id: string;
  userId?: string;
  theme: "light" | "dark" | "system";
  layoutConfig: Record<string, any>;
  defaultDateRange: string;
  createdAt: string;
  updatedAt: string;
}

export interface MongoProfileDocument {
  _id?: any;
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: "admin" | "analyst" | "viewer";
  createdAt: string;
  updatedAt: string;
}

export interface MongoAppSettingDocument {
  _id?: any;
  key: string;
  value: any;
  updatedAt: string;
}

export function isMongoConfigured(): boolean {
  return Boolean(config.mongodbUri);
}

export async function checkMongoConnection(): Promise<ServiceStatus> {
  if (!isMongoConfigured()) {
    return "not_configured";
  }

  try {
    const client = getMongoClient();
    if (!client) {
      console.error("[MongoDB Health Check] MongoClient failed to initialize.");
      return "disconnected";
    }

    const db = getMongoDb();
    if (!db) {
      console.error("[MongoDB Health Check] Mongo Database instance unavailable.");
      return "disconnected";
    }

    // Perform an actual lightweight ping command on the MongoDB instance
    await db.command({ ping: 1 });
    return "connected";
  } catch (err: any) {
    const reason = err?.cause?.message || err?.message || String(err);
    console.error("[MongoDB Health Check] Connection error:", reason);
    return "disconnected";
  }
}

export function getReportsCollection(): Collection<MongoReportDocument> | null {
  const db = getMongoDb();
  return db ? db.collection<MongoReportDocument>("reports") : null;
}

export function getSavedFiltersCollection(): Collection<MongoSavedFilterDocument> | null {
  const db = getMongoDb();
  return db ? db.collection<MongoSavedFilterDocument>("saved_filters") : null;
}

export function getDashboardPreferencesCollection(): Collection<MongoDashboardPreferenceDocument> | null {
  const db = getMongoDb();
  return db ? db.collection<MongoDashboardPreferenceDocument>("dashboard_preferences") : null;
}

export function getProfilesCollection(): Collection<MongoProfileDocument> | null {
  const db = getMongoDb();
  return db ? db.collection<MongoProfileDocument>("profiles") : null;
}

export function getAppSettingsCollection(): Collection<MongoAppSettingDocument> | null {
  const db = getMongoDb();
  return db ? db.collection<MongoAppSettingDocument>("app_settings") : null;
}

export { getMongoClient, getMongoDb, closeMongoClient } from "./mongoClient.js";
