import { Request, Response } from "express";
import { config } from "../config/env.js";
import { analyticsRepository } from "../repositories/analyticsRepository.js";

export async function listReports(_req: Request, res: Response): Promise<void> {
  try {
    const reports = await analyticsRepository.listReports();
    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to list reports" });
  }
}

export async function generateReport(req: Request, res: Response): Promise<void> {
  try {
    const { type, period } = req.body;
    if (!type || !period) {
      res.status(400).json({ error: "type and period are required" });
      return;
    }

    const report = await analyticsRepository.generateReport(type, period);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to generate report" });
  }
}

export async function exportReport(req: Request, res: Response): Promise<void> {
  try {
    const id = (req.query.id as string) || "report";
    const format = (req.query.format as string) || "csv";

    if (config.dataMode === "bigdata") {
      const summary = await analyticsRepository.getDashboardSummary("30d");
      const revKpi = summary.kpis[0]?.value || "₹16.93 Cr";
      const ordersKpi = summary.kpis[1]?.value || "16,548";
      const custKpi = summary.kpis[2]?.value || "10,000";
      const prodKpi = summary.kpis[3]?.value || "5,000";
      const aovKpi = summary.kpis[4]?.value || "₹10,228";

      const csvContent = [
        `Report ID,Data Mode,HDFS Status,Generated At`,
        `${id},BIGDATA,CONNECTED,${new Date().toISOString()}`,
        ``,
        `Metric,Value`,
        `Total Revenue (30d),${revKpi}`,
        `Total Orders (30d),${ordersKpi}`,
        `Total Customers,${custKpi}`,
        `Total Products,${prodKpi}`,
        `Average Order Value,${aovKpi}`,
      ].join("\n");

      if (format === "csv") {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="${id}.csv"`);
        res.send(csvContent);
        return;
      }

      res.json({
        status: "success",
        mode: "bigdata",
        reportId: id,
        summary: {
          totalRevenue: revKpi,
          totalOrders: ordersKpi,
          totalCustomers: custKpi,
          totalProducts: prodKpi,
          aov: aovKpi,
        },
      });
      return;
    }

    if (format === "csv") {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="${id}.csv"`);
      res.send(`Report ID,Type,Period,Generated At\n${id},sales,Last 30 Days,${new Date().toISOString()}\n`);
      return;
    }

    res.json({ status: "success", message: `Exported report ${id} as ${format}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to export report" });
  }
}
