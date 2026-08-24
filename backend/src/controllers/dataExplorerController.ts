import { Request, Response } from "express";
import { getHdfsDatasets } from "../services/hdfs/hdfsService.js";

export async function listDatasets(_req: Request, res: Response): Promise<void> {
  try {
    const { datasets } = await getHdfsDatasets();
    res.json(datasets);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch datasets" });
  }
}
