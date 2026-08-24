import { Request, Response } from "express";
import { analyticsRepository } from "../repositories/analyticsRepository.js";

export async function getDashboardSummary(req: Request, res: Response): Promise<void> {
  try {
    const range = (req.query.range as string) || "30d";
    const summary = await analyticsRepository.getDashboardSummary(range);
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch dashboard summary" });
  }
}
