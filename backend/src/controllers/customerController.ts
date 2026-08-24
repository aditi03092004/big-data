import { Request, Response } from "express";
import { analyticsRepository } from "../repositories/analyticsRepository.js";

export async function getCustomerSummary(req: Request, res: Response): Promise<void> {
  try {
    const range = (req.query.range as string) || "30d";
    const result = await analyticsRepository.getCustomerSummary(range);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch customer summary" });
  }
}

export async function listCustomers(req: Request, res: Response): Promise<void> {
  try {
    const range = (req.query.range as string) || "30d";
    const search = req.query.search as string;
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const result = await analyticsRepository.listCustomers({ range, search, page, pageSize });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to list customers" });
  }
}

export async function getCustomerById(req: Request, res: Response): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const customer = await analyticsRepository.getCustomerById(id);
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    res.json(customer);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch customer" });
  }
}
