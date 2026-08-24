import { Router } from "express";
import {
  getHdfsDatasetsApi,
  getHdfsStatus,
  getKafkaStatusApi,
  listHdfsFiles,
  publishKafkaOrder,
  runHiveQueryApi,
  triggerSparkJob,
} from "../controllers/bigdataController.js";

const router = Router();

// HDFS APIs
router.get("/bigdata/hdfs/status", getHdfsStatus);
router.get("/bigdata/hdfs/datasets", getHdfsDatasetsApi);
router.get("/bigdata/hdfs/files", listHdfsFiles);

// PySpark APIs
router.post("/bigdata/spark/:jobId", triggerSparkJob);

// Hive APIs
router.post("/bigdata/hive/query", runHiveQueryApi);

// Kafka APIs
router.get("/bigdata/kafka/status", getKafkaStatusApi);
router.post("/bigdata/kafka/publish-order", publishKafkaOrder);

export default router;
