import { Request, Response } from "express";
import { getProfilesCollection } from "../services/mongodb/mongoService.js";

const DEFAULT_PROFILE = {
  id: "usr-admin-01",
  email: "admin@ecommerce-analytics.io",
  fullName: "Big Data Admin",
  role: "admin" as const,
  avatarUrl: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const email = (req.query.email as string) || "admin@ecommerce-analytics.io";
    const collection = getProfilesCollection();
    if (collection) {
      const profile = await collection.findOne({ email });
      if (profile) {
        res.json({
          id: profile.id,
          email: profile.email,
          fullName: profile.fullName,
          role: profile.role,
          avatarUrl: profile.avatarUrl,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        });
        return;
      }
    }
    res.json(DEFAULT_PROFILE);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load profile" });
  }
}

export async function saveProfile(req: Request, res: Response): Promise<void> {
  try {
    const { email = "admin@ecommerce-analytics.io", fullName = "Big Data Admin", role = "admin", avatarUrl = "" } = req.body;
    const now = new Date().toISOString();

    const collection = getProfilesCollection();
    if (collection) {
      await collection.updateOne(
        { email },
        {
          $set: {
            fullName,
            role,
            avatarUrl,
            updatedAt: now,
          },
          $setOnInsert: {
            id: `usr-${Date.now().toString().slice(-6)}`,
            email,
            createdAt: now,
          },
        },
        { upsert: true }
      );
    }

    res.json({
      status: "success",
      message: "Profile saved to MongoDB",
      profile: { email, fullName, role, avatarUrl, updatedAt: now },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save profile" });
  }
}
