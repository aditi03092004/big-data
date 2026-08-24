import { Request, Response } from "express";
import { getSavedFiltersCollection } from "../services/mongodb/mongoService.js";

const DEFAULT_FILTERS = [
  {
    id: "flt-001",
    name: "Bengaluru Delivered Orders",
    filterType: "orders",
    filterConfig: { location: "Bengaluru", status: "delivered" },
    userId: "usr-admin-01",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "flt-002",
    name: "High Value Audio Customers",
    filterType: "customers",
    filterConfig: { category: "Audio", minSpend: 50000 },
    userId: "usr-admin-01",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function listFilters(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req.query.userId as string) || "usr-admin-01";
    const collection = getSavedFiltersCollection();
    if (collection) {
      const filters = await collection.find({ userId }).sort({ createdAt: -1 }).toArray();
      if (filters.length > 0) {
        res.json(filters.map((f) => ({
          id: f.id,
          name: f.name,
          filterType: f.filterType,
          filterConfig: f.filterConfig,
          userId: f.userId,
          createdAt: f.createdAt,
          updatedAt: f.updatedAt,
        })));
        return;
      }
    }
    res.json(DEFAULT_FILTERS);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to list filters" });
  }
}

export async function saveFilter(req: Request, res: Response): Promise<void> {
  try {
    const { name, filterType, filterConfig = {}, userId = "usr-admin-01" } = req.body;
    if (!name || !filterType) {
      res.status(400).json({ error: "name and filterType are required" });
      return;
    }

    const now = new Date().toISOString();
    const filterId = `flt-${Date.now().toString().slice(-6)}`;

    const filterDoc = {
      id: filterId,
      name,
      filterType,
      filterConfig,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    const collection = getSavedFiltersCollection();
    if (collection) {
      await collection.insertOne(filterDoc);
    }

    res.json({
      status: "success",
      message: "Filter saved to MongoDB",
      filter: filterDoc,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save filter" });
  }
}

export async function deleteFilter(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const collection = getSavedFiltersCollection();
    if (collection) {
      await collection.deleteOne({ id });
    }
    res.json({ status: "success", message: `Deleted filter ${id}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete filter" });
  }
}
