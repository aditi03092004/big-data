-- Run these safe, predefined queries after registering the HDFS-backed tables.
CREATE DATABASE IF NOT EXISTS ecommerce_analytics;

USE ecommerce_analytics;

CREATE EXTERNAL TABLE IF NOT EXISTS customers (
  customer_id STRING, name STRING, location STRING
) STORED AS TEXTFILE LOCATION 'hdfs:///ecommerce/customers';

CREATE EXTERNAL TABLE IF NOT EXISTS products (
  product_id STRING, name STRING, category STRING, price DOUBLE
) STORED AS TEXTFILE LOCATION 'hdfs:///ecommerce/products';

CREATE EXTERNAL TABLE IF NOT EXISTS orders (
  order_id STRING, customer_id STRING, product_id STRING, amount DOUBLE,
  location STRING, order_date TIMESTAMP, status STRING
) STORED AS TEXTFILE LOCATION 'hdfs:///ecommerce/orders';

-- TOP_PRODUCTS
SELECT product_id, SUM(amount) AS revenue, COUNT(*) AS units
FROM orders GROUP BY product_id ORDER BY revenue DESC LIMIT 10;

-- REVENUE_BY_CATEGORY
SELECT p.category, SUM(o.amount) AS revenue
FROM orders o JOIN products p ON o.product_id = p.product_id
GROUP BY p.category ORDER BY revenue DESC;

-- MONTHLY_REVENUE
SELECT YEAR(order_date) AS year, MONTH(order_date) AS month, SUM(amount) AS revenue
FROM orders GROUP BY YEAR(order_date), MONTH(order_date)
ORDER BY year, month;

-- TOP_CUSTOMERS
SELECT customer_id, SUM(amount) AS spending, COUNT(*) AS orders
FROM orders GROUP BY customer_id ORDER BY spending DESC LIMIT 10;

-- ORDERS_BY_LOCATION
SELECT location, COUNT(*) AS orders FROM orders GROUP BY location ORDER BY orders DESC;

-- CANCELLED_ORDERS
SELECT DATE(order_date) AS day, COUNT(*) AS cancelled
FROM orders WHERE status = 'cancelled' GROUP BY DATE(order_date) ORDER BY day;