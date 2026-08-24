# E-Commerce Big Data Analytics Platform

An enterprise-grade internal analytics command center for e-commerce companies designed to demonstrate four core Big Data technologies: **Apache Hadoop HDFS**, **Apache Spark / PySpark**, **Apache Hive**, and **Apache Kafka**.

---

## Workspace Architecture

The workspace is organized into 5 clean top-level directories:

```text
Data-Asset-Hub/
├── frontend/             # Complete React 18 + Vite + TypeScript + Tailwind CSS application
├── backend/              # Complete Node.js + Express + TypeScript API server
├── bigdata/              # Hadoop HDFS, PySpark scripts, Hive SQL DDL & queries, Kafka stream
│   ├── hdfs/             # HDFS cluster initialization shell scripts & paths
│   ├── spark/            # customer_analysis.py, product_analysis.py, order_analysis.py, revenue_analysis.py
│   ├── hive/             # schema.sql and 7 governed Hive SQL analytical queries
│   └── kafka/            # Producer, consumer, and JSON event schemas
├── scripts/              # Data generator script (generate_data.py)
├── docs/                 # Architecture diagrams, Big Data flows, Setup guide, API docs
├── .env.example          # Environment variables template
└── README.md
```

---

## Four Big Data Technologies Integrated

1. **Apache Hadoop HDFS**: Distributed block storage for large e-commerce datasets (`/ecommerce/customers`, `/ecommerce/products`, `/ecommerce/orders`, `/ecommerce/transactions`, `/ecommerce/delivery`).
2. **Apache Spark / PySpark**: Large-scale distributed processing engine performing batch cleaning, join transformations, and PySpark analytics jobs (`customer_analysis.py`, `product_analysis.py`, `order_analysis.py`, `revenue_analysis.py`).
3. **Apache Hive**: Distributed SQL query engine executing 7 governed analytical queries (`TOP_PRODUCTS`, `REVENUE_BY_CATEGORY`, `MONTHLY_REVENUE`, `TOP_CUSTOMERS`, `ORDERS_BY_LOCATION`, `AVERAGE_DELIVERY_TIME`, `CANCELLED_ORDERS`).
4. **Apache Kafka**: Real-time event streaming pipeline producing and consuming live order lifecycle events on topic `ecommerce-orders`.

---

## 10 Analytics Modules

- **Dashboard** (`/dashboard`): Master executive KPI cockpit, revenue trend, and Big Data health status pills.
- **Customer Analytics** (`/customers` & `/customers/:id`): Demographic distribution, spending velocity, and paginated customer directory.
- **Product & Sales Analytics** (`/products` & `/products/:id`): SKU velocity, unit revenue, and product rating analytics.
- **Order & Delivery Analytics** (`/orders`): Order lifecycle status distribution, location filters, and delivery time latency.
- **Revenue Analytics** (`/revenue`): Financial KPIs, daily/monthly/yearly revenue, profit margins, and discount analysis.
- **Live Analytics** (`/live`): Kafka real-time event streaming visualization with Server-Sent Events (SSE) live updates.
- **Data Explorer** (`/data-explorer`): Dataset storage, processing framework, and query lineage registry.
- **Query Analytics** (`/queries`): Predefined Hive & Spark governed SQL query execution catalog.
- **Reports** (`/reports`): Executive report compiler supporting CSV and PDF exports.
- **Settings** (`/settings`): Profile preferences, operating mode status, and Big Data connection checks.

---

## Operating Modes

- **`DEMO MODE`**: Works out-of-the-box using high-fidelity generated datasets without requiring a running Hadoop cluster or Kafka brokers.
- **`BIG DATA MODE`**: Connects directly to HDFS Namenode WebHDFS, PySpark job launcher, Hive SQL engine, and Kafka cluster brokers.

---

## Quick Start

### 1. Install & Run Backend
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`.*

### 2. Install & Run Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## Documentation

- [Architecture Diagram & Design](file:///e:/downloads/Data-Asset-Hub/docs/architecture.md)
- [Big Data Pipeline & Execution Flow](file:///e:/downloads/Data-Asset-Hub/docs/big-data-flow.md)
- [Setup & Environment Guide](file:///e:/downloads/Data-Asset-Hub/docs/setup.md)
- [API Reference Manual](file:///e:/downloads/Data-Asset-Hub/docs/api.md)
