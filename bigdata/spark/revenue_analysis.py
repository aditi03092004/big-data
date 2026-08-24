"""Predefined PySpark revenue aggregation job."""

from pyspark.sql import SparkSession
from pyspark.sql.functions import month, sum, to_date

spark = SparkSession.builder.appName("ecommerce-revenue-analysis").getOrCreate()
orders = spark.read.option("header", True).csv("hdfs:///ecommerce/orders")
result = orders.withColumn("order_day", to_date("order_date")).groupBy(
    month("order_day").alias("month")
).agg(sum("amount").alias("revenue"))
result.write.mode("overwrite").parquet("hdfs:///ecommerce/analytics/revenue")
spark.stop()