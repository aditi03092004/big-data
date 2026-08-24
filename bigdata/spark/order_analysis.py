"""Predefined PySpark order status and delivery aggregation job."""

from pyspark.sql import SparkSession
from pyspark.sql.functions import count

spark = SparkSession.builder.appName("ecommerce-order-analysis").getOrCreate()
orders = spark.read.option("header", True).csv("hdfs:///ecommerce/orders")
result = orders.groupBy("location", "status").agg(count("order_id").alias("orders"))
result.write.mode("overwrite").parquet("hdfs:///ecommerce/analytics/orders")
spark.stop()