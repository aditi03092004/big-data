# Big Data Pipeline & Execution Flow

This document details how data moves through storage, processing, querying, and streaming layers in the E-Commerce Big Data Analytics Platform.

---

## 1. Batch Data Pipeline (HDFS → PySpark / Hive → API → React)

```text
Synthetic Generator (generate_data.py)
          │
          ▼
   Raw CSV Datasets (customers, products, orders, transactions, delivery)
          │
          ▼
HDFS Distributed Storage (/ecommerce/*)
          │
  ┌───────┴───────────────────────┐
  ▼                               ▼
PySpark Aggregation Jobs     Apache Hive SQL Engine
(Parquet output)             (External Table Queries)
  │                               │
  └───────┬───────────────────────┘
          ▼
    Node.js API Services (/api/bigdata/*)
          │
          ▼
    React Analytics Platform
```

### Steps:
1. **Raw Storage (HDFS)**: CSV datasets generated via `scripts/generate_data.py` are loaded into HDFS under `/ecommerce/customers`, `/ecommerce/products`, `/ecommerce/orders`, `/ecommerce/transactions`, and `/ecommerce/delivery`.
2. **Batch Transformation (Spark)**: PySpark batch jobs clean, join, and aggregate orders with customer and product data, outputting compressed Parquet files under `/ecommerce/analytics/*`.
3. **Analytical Querying (Hive)**: External Hive tables read directly from HDFS directories. Governed queries (`TOP_PRODUCTS`, `REVENUE_BY_CATEGORY`, `MONTHLY_REVENUE`, etc.) compute aggregations on demand.
4. **Backend Retrieval**: Node.js backend controllers fetch aggregated analytical summaries and expose structured JSON endpoints.

---

## 2. Real-Time Streaming Pipeline (Kafka → SSE → Live Dashboard)

```text
Event Producer (Kafka / UI Form)
          │
          ▼
Kafka Topic: ecommerce-orders
          │
          ▼
Kafka Consumer / Event Broadcaster
          │
          ▼
Server-Sent Events (SSE) Endpoint (/api/live/stream)
          │
          ▼
React Live Dashboard (/live)
```

### Steps:
1. **Order Event Creation**: New order events (`ORDER_CREATED` or `ORDER_UPDATED`) are published to Kafka topic `ecommerce-orders`.
2. **Event Consumption**: Node.js consumer listens to Kafka messages and emits them to an in-memory event stream buffer.
3. **Live UI Push**: Connected React clients receive instant event pushes via Server-Sent Events (SSE) without triggering manual HTTP refreshes.