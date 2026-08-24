#!/usr/bin/env python3
"""Kafka Consumer for E-Commerce Live Order Stream.

Reads real-time order events from Kafka topic: ecommerce-orders
"""

import json
import os

TOPIC = os.getenv("KAFKA_TOPIC", "ecommerce-orders")
BROKERS = os.getenv("KAFKA_BROKERS", "localhost:9092")


def main():
    print(f"Subscribing Kafka consumer to topic: {TOPIC} on {BROKERS}")
    # Integration boundary for Kafka consumer client


if __name__ == "__main__":
    main()
