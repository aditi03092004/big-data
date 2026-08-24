import { Request, Response } from "express";
import { analyticsRepository } from "../repositories/analyticsRepository.js";

export async function getOrderSummary(req: Request, res: Response): Promise<void> {
  try {
    const range = (req.query.range as string) || "30d";
    const result = await analyticsRepository.getOrderSummary(range);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch order summary" });
  }
}

export async function listOrders(req: Request, res: Response): Promise<void> {
  try {
    const range = (req.query.range as string) || "30d";
    const search = req.query.search as string;
    const status = req.query.status as string;
    const location = req.query.location as string;
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const result = await analyticsRepository.listOrders({ range, search, status, location, page, pageSize });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to list orders" });
  }
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const order = await analyticsRepository.getOrderById(id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch order" });
  }
}
