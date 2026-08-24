# Environment Setup & Running Guide

This guide explains how to set up, configure, and run the E-Commerce Big Data Analytics Platform in **`DEMO MODE`** (out-of-the-box mode) and **`BIG DATA MODE`** (with active Hadoop/Spark/Hive/Kafka infrastructure).

---

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**
- **Python 3**: 3.8+ (for synthetic data generation and PySpark scripts)
- *(Optional for Big Data Mode)*: Hadoop 3.x cluster, Apache Spark 3.x, Apache Hive 3.x, Apache Kafka 3.x

---

## Quick Start — Running in DEMO MODE

In **DEMO MODE**, the application runs smoothly out-of-the-box without requiring a running Hadoop cluster or Kafka brokers.

### 1. Install Dependencies

```bash
# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` in the root or `backend/.env`:

```env
NODE_ENV=development
DATA_MODE=demo
BACKEND_PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 3. Run Backend Server

```bash
cd backend
npm run dev
```

*The backend server will start on `http://localhost:5000`.*

### 4. Run Frontend Application

In a new terminal window:

```bash
cd frontend
npm run dev
```

*The React frontend will start on `http://localhost:5173`.*

Open your browser and navigate to `http://localhost:5173/dashboard`.

---

## Running in BIG DATA MODE

To connect to real Big Data cluster infrastructure:

1. Update `.env`:
   ```env
   DATA_MODE=bigdata
   HDFS_NAMENODE_HOST=your-namenode-host
   HDFS_NAMENODE_PORT=9870
   HDFS_USER=analytics
   KAFKA_BROKERS=your-kafka-broker:9092
   KAFKA_TOPIC=ecommerce-orders
   SPARK_HOME=/opt/spark
   HIVE_HOME=/opt/hive
   ```

2. Generate Datasets & Upload to HDFS:
   ```bash
   python3 scripts/generate_data.py --orders 1000000 --output ./data
   bash bigdata/hdfs/hdfs_init.sh
   ```

3. Initialize Hive Tables:
   ```bash
   hive -f bigdata/hive/schema/schema.sql
   ```

4. Restart the Node.js backend. The health status indicator on the top navigation bar will switch to **`BIG DATA MODE`** and confirm active connections to HDFS, Spark, Hive, Kafka, and MongoDB.