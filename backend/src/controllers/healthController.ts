import { Request, Response } from "express";
import { config } from "../config/env.js";
import { HealthResponse } from "../types/analyticsTypes.js";
import { checkHdfsConnection } from "../services/hdfs/hdfsService.js";
import { checkSparkConnection } from "../services/spark/sparkService.js";
import { checkHiveConnection } from "../services/hive/hiveService.js";
import { checkKafkaConnection } from "../services/kafka/kafkaService.js";
import { checkMongoConnection } from "../services/mongodb/mongoService.js";

export async function getHealthStatus(_req: Request, res: Response): Promise<void> {
  const [hdfs, spark, hive, kafka, mongodb] = await Promise.all([
    checkHdfsConnection(),
    checkSparkConnection(),
    checkHiveConnection(),
    checkKafkaConnection(),
    checkMongoConnection(),
  ]);

  const response: HealthResponse = {
    application: "healthy",
    mode: config.dataMode,
    hdfs,
    spark,
    hive,
    kafka,
    mongodb,
    checkedAt: new Date().toISOString(),
  };

  res.json(response);
}
