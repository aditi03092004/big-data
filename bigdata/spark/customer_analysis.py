"""Predefined PySpark customer aggregation job.

The job reads customers/orders from HDFS when launched in Big Data Mode.
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import avg, count, sum

spark = SparkSession.builder.appName("ecommerce-customer-analysis").getOrCreate()
customers = spark.read.option("header", True).csv("hdfs:///ecommerce/customers")
orders = spark.read.option("header", True).csv("hdfs:///ecommerce/orders")
result = customers.join(orders, "customer_id").groupBy("customer_id").agg(
    count("order_id").alias("orders"),
    sum("amount").alias("spending"),
    avg("amount").alias("average_order_value"),
)
result.write.mode("overwrite").parquet("hdfs:///ecommerce/analytics/customers")
spark.stop()