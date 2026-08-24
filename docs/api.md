# Backend API Documentation

The Node.js Express backend exposes clean REST APIs and Server-Sent Events (SSE) streaming endpoints.

---

## Base URL
```text
http://localhost:5000/api
```

---

## Endpoints Summary

### 1. Health & Platform Status
- `GET /api/health`
  - **Description**: Returns actual real-time connection status for HDFS, Spark, Hive, Kafka, and MongoDB.
  - **Response**:
    ```json
    {
      "application": "healthy",
      "mode": "demo",
      "hdfs": "disconnected",
      "spark": "disconnected",
      "hive": "disconnected",
      "kafka": "disconnected",
      "mongodb": "not_configured",
      "checkedAt": "2026-08-14T22:30:00.000Z"
    }
    ```

### 2. Dashboard Analytics
- `GET /api/dashboard/summary?range=30d`
  - **Description**: Returns top KPIs, revenue trend, category revenue, top products, location distribution, and order statuses.

### 3. Customer Analytics
- `GET /api/customers?search=Ananya&page=1&pageSize=10`
  - **Description**: Returns paginated customer list matching search filter.
- `GET /api/customers/:id`
  - **Description**: Returns customer profile and purchase history for a specific customer ID.

### 4. Product Analytics
- `GET /api/products?search=Headphones&category=Audio&page=1&pageSize=10`
  - **Description**: Returns paginated product catalog performance metrics.
- `GET /api/products/:id`
  - **Description**: Returns SKU details, sales velocity, and rating performance.

### 5. Order Analytics
- `GET /api/orders?status=delivered&location=Bengaluru&page=1&pageSize=10`
  - **Description**: Returns paginated order stream matching status and location filters.
- `GET /api/orders/:id`
  - **Description**: Returns order fulfillment metrics and delivery latency.

### 6. Revenue Analytics
- `GET /api/revenue/summary?range=thirty_days`
  - **Description**: Returns financial KPIs, daily/monthly/yearly revenue, profit margins, and discount analysis.

### 7. Live Streaming Analytics (Kafka)
- `GET /api/live/summary`
  - **Description**: Returns live streaming KPIs (orders/min, revenue/min) and recent order event buffer.
- `POST /api/live/publish`
  - **Description**: Emits a new order event (`ORDER_CREATED`) to Kafka topic `ecommerce-orders` and connected SSE clients.
  - **Body**:
    ```json
    {
      "product": "Pulse ANC Headphones",
      "amount": 12999,
      "location": "Bengaluru"
    }
    ```
- `GET /api/live/stream`
  - **Description**: Server-Sent Events (SSE) endpoint broadcasting live events to client dashboards.

### 8. Data Explorer & Big Data Registry
- `GET /api/datasets`
  - **Description**: Returns dataset registry items detailing HDFS paths, Spark processing engines, and Hive query engines.

### 9. Governed Query Analytics
- `GET /api/queries`
  - **Description**: Returns list of 7 predefined governed Hive/Spark query templates.
- `POST /api/queries/run`
  - **Description**: Executes a predefined query by query ID (`TOP_PRODUCTS`, `REVENUE_BY_CATEGORY`, `MONTHLY_REVENUE`, etc.) and returns formatted tabular results.

### 10. Reports
- `GET /api/reports`
  - **Description**: Returns report history.
- `POST /api/reports/generate`
  - **Description**: Generates an analytical report summary.
- `GET /api/reports/export?id=rpt-004&format=csv`
  - **Description**: Exports a report summary as CSV or PDF attachment.