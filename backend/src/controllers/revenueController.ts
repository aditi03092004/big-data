import { Request, Response } from "express";
import { analyticsRepository } from "../repositories/analyticsRepository.js";

export async function getRevenueSummary(req: Request, res: Response): Promise<void> {
  try {
    const range = (req.query.range as string) || "30d";
    const result = await analyticsRepository.getRevenueSummary(range);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch revenue summary" });
  }
}

export async function getRevenueMonthly(req: Request, res: Response): Promise<void> {
  try {
    const range = (req.query.range as string) || "30d";
    const result = await analyticsRepository.getRevenueSummary(range);
    res.json(result.monthly);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch monthly revenue" });
  }
}

export async function getRevenueRegional(req: Request, res: Response): Promise<void> {
  try {
    const range = (req.query.range as string) || "30d";
    const result = await analyticsRepository.getRevenueSummary(range);
    res.json(result.location);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch regional revenue" });
  }
}
