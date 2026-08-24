#!/usr/bin/env bash
# HDFS Directory Initialization and Dataset Upload Script

echo "Initializing HDFS E-Commerce directory structure..."
hdfs dfs -mkdir -p /ecommerce/customers
hdfs dfs -mkdir -p /ecommerce/products
hdfs dfs -mkdir -p /ecommerce/orders
hdfs dfs -mkdir -p /ecommerce/transactions
hdfs dfs -mkdir -p /ecommerce/delivery
hdfs dfs -mkdir -p /ecommerce/analytics

echo "Uploading generated CSV datasets to HDFS..."
if [ -d "./data" ]; then
  hdfs dfs -put -f ./data/customers.csv /ecommerce/customers/
  hdfs dfs -put -f ./data/products.csv /ecommerce/products/
  hdfs dfs -put -f ./data/orders.csv /ecommerce/orders/
  hdfs dfs -put -f ./data/transactions.csv /ecommerce/transactions/
  hdfs dfs -put -f ./data/delivery.csv /ecommerce/delivery/
  echo "HDFS datasets uploaded successfully!"
else
  echo "Data directory ./data not found. Run python3 scripts/generate_data.py first."
fi
