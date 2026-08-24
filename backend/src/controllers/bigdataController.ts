import { Request, Response } from "express";
import { checkHdfsConnection, getHdfsDatasets, listHdfsDirectory } from "../services/hdfs/hdfsService.js";
import { runSparkJob, SparkJobId } from "../services/spark/sparkService.js";
import { getGovernedQueryById, hiveStatus } from "../services/hive/hiveService.js";
import { checkKafkaConnection, publishLiveOrderEvent } from "../services/kafka/kafkaService.js";

export async function getHdfsStatus(_req: Request, res: Response): Promise<void> {
  const status = await checkHdfsConnection();
  res.json({ status });
}

export async function getHdfsDatasetsApi(_req: Request, res: Response): Promise<void> {
  const data = await getHdfsDatasets();
  res.json(data);
}

export async function listHdfsFiles(req: Request, res: Response): Promise<void> {
  const path = (req.query.path as string) || "/ecommerce";
  const data = await listHdfsDirectory(path);
  res.json(data);
}

export async function triggerSparkJob(req: Request, res: Response): Promise<void> {
  const jobId = req.params.jobId as SparkJobId;
  const result = await runSparkJob(jobId);
  res.json(result);
}

export async function runHiveQueryApi(req: Request, res: Response): Promise<void> {
  const { queryId } = req.body;
  if (!queryId) {
    res.status(400).json({ error: "queryId is required" });
    return;
  }

  const query = getGovernedQueryById(queryId);
  if (!query) {
    res.status(400).json({ error: "Invalid predefined query ID" });
    return;
  }

  res.json({
    status: "executed",
    queryId,
    engine: "hive",
    hiveStatus: hiveStatus(),
    query,
  });
}

export async function getKafkaStatusApi(_req: Request, res: Response): Promise<void> {
  const status = await checkKafkaConnection();
  res.json({ status, topic: "ecommerce-orders" });
}

export async function publishKafkaOrder(req: Request, res: Response): Promise<void> {
  const { product, amount, location } = req.body;
  if (!product || !amount || !location) {
    res.status(400).json({ error: "product, amount, location are required" });
    return;
  }

  const result = await publishLiveOrderEvent({ product, amount: Number(amount), location });
  res.json(result);
}
