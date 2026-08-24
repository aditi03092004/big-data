import { Request, Response } from "express";
import { getDashboardPreferencesCollection } from "../services/mongodb/mongoService.js";

const DEFAULT_PREFERENCES = {
  id: "pref-001",
  userId: "usr-admin-01",
  theme: "system" as const,
  defaultDateRange: "30d",
  layoutConfig: {
    showRevenueTrend: true,
    showCategoryDistribution: true,
    showTopProducts: true,
    showPlatformHealth: true,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function getPreferences(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req.query.userId as string) || "usr-admin-01";
    const collection = getDashboardPreferencesCollection();
    if (collection) {
      const pref = await collection.findOne({ userId });
      if (pref) {
        res.json({
          id: pref.id,
          userId: pref.userId,
          theme: pref.theme,
          defaultDateRange: pref.defaultDateRange,
          layoutConfig: pref.layoutConfig,
          createdAt: pref.createdAt,
          updatedAt: pref.updatedAt,
        });
        return;
      }
    }
    res.json(DEFAULT_PREFERENCES);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load preferences" });
  }
}

export async function savePreferences(req: Request, res: Response): Promise<void> {
  try {
    const { userId = "usr-admin-01", theme = "system", defaultDateRange = "30d", layoutConfig = {} } = req.body;
    const now = new Date().toISOString();

    const collection = getDashboardPreferencesCollection();
    if (collection) {
      await collection.updateOne(
        { userId },
        {
          $set: {
            theme,
            defaultDateRange,
            layoutConfig,
            updatedAt: now,
          },
          $setOnInsert: {
            id: `pref-${Date.now().toString().slice(-6)}`,
            userId,
            createdAt: now,
          },
        },
        { upsert: true }
      );
    }

    res.json({
      status: "success",
      message: "Preferences saved to MongoDB",
      preferences: { userId, theme, defaultDateRange, layoutConfig, updatedAt: now },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save preferences" });
  }
}
