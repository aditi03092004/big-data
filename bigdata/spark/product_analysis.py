"""Predefined PySpark product aggregation job."""

from pyspark.sql import SparkSession
from pyspark.sql.functions import count, sum

spark = SparkSession.builder.appName("ecommerce-product-analysis").getOrCreate()
products = spark.read.option("header", True).csv("hdfs:///ecommerce/products")
orders = spark.read.option("header", True).csv("hdfs:///ecommerce/orders")
result = products.join(orders, "product_id").groupBy("product_id", "name", "category").agg(
    count("order_id").alias("quantity_sold"),
    sum("amount").alias("revenue"),
)
result.write.mode("overwrite").parquet("hdfs:///ecommerce/analytics/products")
spark.stop()