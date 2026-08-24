-- Apache Hive Schema Definition DDL for E-Commerce Big Data Platform
CREATE DATABASE IF NOT EXISTS ecommerce_analytics;
USE ecommerce_analytics;

CREATE EXTERNAL TABLE IF NOT EXISTS customers (
  customer_id STRING,
  name STRING,
  location STRING
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION 'hdfs:///ecommerce/customers';

CREATE EXTERNAL TABLE IF NOT EXISTS products (
  product_id STRING,
  name STRING,
  category STRING,
  price DOUBLE
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION 'hdfs:///ecommerce/products';

CREATE EXTERNAL TABLE IF NOT EXISTS orders (
  order_id STRING,
  customer_id STRING,
  product_id STRING,
  amount DOUBLE,
  location STRING,
  order_date TIMESTAMP,
  status STRING
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION 'hdfs:///ecommerce/orders';

CREATE EXTERNAL TABLE IF NOT EXISTS transactions (
  transaction_id STRING,
  order_id STRING,
  amount DOUBLE,
  transaction_date TIMESTAMP
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION 'hdfs:///ecommerce/transactions';

CREATE EXTERNAL TABLE IF NOT EXISTS delivery (
  delivery_id STRING,
  order_id STRING,
  delivery_days INT
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION 'hdfs:///ecommerce/delivery';
