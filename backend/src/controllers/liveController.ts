import { Request, Response } from "express";
import { analyticsRepository } from "../repositories/analyticsRepository.js";
import { liveEventEmitter, publishLiveOrderEvent } from "../services/kafka/kafkaService.js";

export async function getLiveSummary(_req: Request, res: Response): Promise<void> {
  try {
    const summary = await analyticsRepository.getLiveSummary();
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch live summary" });
  }
}

export async function publishLiveOrder(req: Request, res: Response): Promise<void> {
  try {
    const { product, amount, location } = req.body;
    if (!product || !amount || !location) {
      res.status(400).json({ error: "product, amount, and location are required" });
      return;
    }

    const result = await publishLiveOrderEvent({
      product,
      amount: Number(amount),
      location,
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to publish live order" });
  }
}

export function subscribeLiveStream(_req: Request, res: Response): void {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const listener = (event: any) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  liveEventEmitter.on("live-event", listener);

  _req.on("close", () => {
    liveEventEmitter.off("live-event", listener);
  });
}
