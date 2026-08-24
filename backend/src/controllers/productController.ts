import { Request, Response } from "express";
import { analyticsRepository } from "../repositories/analyticsRepository.js";

export async function getProductSummary(req: Request, res: Response): Promise<void> {
  try {
    const range = (req.query.range as string) || "30d";
    const result = await analyticsRepository.getProductSummary(range);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch product summary" });
  }
}

export async function listProducts(req: Request, res: Response): Promise<void> {
  try {
    const range = (req.query.range as string) || "30d";
    const search = req.query.search as string;
    const category = req.query.category as string;
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const result = await analyticsRepository.listProducts({ range, search, category, page, pageSize });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to list products" });
  }
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await analyticsRepository.getProductById(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch product" });
  }
}
