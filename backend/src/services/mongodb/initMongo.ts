import { getMongoDb, ensureMongoConnected, closeMongoClient } from "./mongoClient.js";
import { config } from "../../config/env.js";

export async function initMongoDatabase(): Promise<{ success: boolean; message: string }> {
  if (!config.mongodbUri) {
    return { success: false, message: "MONGODB_URI is not configured in environment variables." };
  }

  try {
    await ensureMongoConnected();
    const db = getMongoDb();
    if (!db) {
      return { success: false, message: "Could not access MongoDB database instance." };
    }

    console.log(`[MongoDB Init] Initializing database: ${config.mongodbDbName}`);

    // Create collections and indexes for application data
    const reports = db.collection("reports");
    await reports.createIndex({ id: 1 }, { unique: true });
    await reports.createIndex({ createdAt: -1 });
    await reports.createIndex({ type: 1 });

    const savedFilters = db.collection("saved_filters");
    await savedFilters.createIndex({ id: 1 }, { unique: true });
    await savedFilters.createIndex({ userId: 1 });

    const preferences = db.collection("dashboard_preferences");
    await preferences.createIndex({ userId: 1 }, { unique: true });

    const profiles = db.collection("profiles");
    await profiles.createIndex({ email: 1 }, { unique: true });
    await profiles.createIndex({ id: 1 }, { unique: true });

    const appSettings = db.collection("app_settings");
    await appSettings.createIndex({ key: 1 }, { unique: true });

    console.log("[MongoDB Init] Successfully initialized collections and indexes.");
    return { success: true, message: `Initialized collections (reports, saved_filters, dashboard_preferences, profiles, app_settings) in ${config.mongodbDbName}` };
  } catch (err: any) {
    console.error("[MongoDB Init] Error initializing database:", err);
    return { success: false, message: `Failed to initialize MongoDB: ${err.message || err}` };
  }
}

if (process.argv[1] && process.argv[1].endsWith("initMongo.ts")) {
  initMongoDatabase()
    .then(async (res) => {
      console.log("[MongoDB Setup]", res.message);
      await closeMongoClient();
      process.exit(res.success ? 0 : 1);
    })
    .catch(async (err) => {
      console.error("[MongoDB Setup Fatal]", err);
      await closeMongoClient();
      process.exit(1);
    });
}
