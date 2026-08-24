#!/usr/bin/env python3
"""Kafka Producer for E-Commerce Live Order Stream.

Emits live order events to Kafka topic: ecommerce-orders
"""

import json
import random
import time
from datetime import datetime, timezone
import os

TOPIC = os.getenv("KAFKA_TOPIC", "ecommerce-orders")
BROKERS = os.getenv("KAFKA_BROKERS", "localhost:9092")

PRODUCTS = [
    ("PRD-00220", "Pulse ANC Headphones", 12999),
    ("PRD-00114", "AeroFit Smartwatch", 8999),
    ("PRD-00087", "Nimbus Mechanical Keyboard", 7499),
    ("PRD-00301", "Orbit USB-C Hub", 3299),
    ("PRD-00419", "Terra Travel Backpack", 4599),
]

LOCATIONS = ["Bengaluru", "Mumbai", "Delhi", "Kolkata", "Pune", "Kochi"]


def generate_event(index: int) -> dict:
    product = random.choice(PRODUCTS)
    location = random.choice(LOCATIONS)
    return {
        "eventType": "ORDER_CREATED",
        "orderId": f"ORD-{10000 + index}",
        "customerId": f"CUS-{random.randint(1000, 9999)}",
        "productId": product[0],
        "product": product[1],
        "amount": product[2],
        "location": location,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


def main():
    print(f"Starting Kafka producer on brokers: {BROKERS}, topic: {TOPIC}")
    index = 1
    while True:
        event = generate_event(index)
        print(f"[PRODUCER] Emitting event: {json.dumps(event)}")
        index += 1
        time.sleep(2)


if __name__ == "__main__":
    main()
