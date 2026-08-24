import { Request, Response } from "express";
import { analyticsRepository } from "../repositories/analyticsRepository.js";
import { getGovernedQueries } from "../services/hive/hiveService.js";

export async function listQueries(_req: Request, res: Response): Promise<void> {
  try {
    const queries = getGovernedQueries();
    res.json(queries);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch queries" });
  }
}

export async function runQuery(req: Request, res: Response): Promise<void> {
  try {
    const { queryId } = req.body;
    if (!queryId) {
      res.status(400).json({ error: "queryId is required" });
      return;
    }

    const result = await analyticsRepository.runGovernedQuery(queryId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to execute query" });
  }
}
