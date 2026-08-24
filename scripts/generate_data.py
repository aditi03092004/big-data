#!/usr/bin/env python3
"""Generate related e-commerce CSV datasets without committing the output.

Examples:
  python3 scripts/generate_data.py --orders 1000000 --output ./data
  python3 scripts/generate_data.py --orders 10000 --customers 1000 --output ./data
"""

import argparse
import csv
import random
from datetime import datetime, timedelta, timezone
from pathlib import Path

LOCATIONS = ["Bengaluru", "Mumbai", "Delhi", "Kolkata", "Pune", "Kochi"]
CATEGORIES = ["Audio", "Wearables", "Computer", "Lifestyle", "Home"]


def write_rows(path: Path, columns: list[str], rows: list[list[object]]) -> None:
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(columns)
        writer.writerows(rows)


def generate(args: argparse.Namespace) -> None:
    random.seed(args.seed)
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)

    customers = [
        [f"CUS-{index:06d}", f"Customer {index:06d}", random.choice(LOCATIONS)]
        for index in range(1, args.customers + 1)
    ]
    products = [
        [f"PRD-{index:05d}", f"Product {index:05d}", random.choice(CATEGORIES), random.randint(499, 19999)]
        for index in range(1, args.products + 1)
    ]
    write_rows(output / "customers.csv", ["customer_id", "name", "location"], customers)
    write_rows(output / "products.csv", ["product_id", "name", "category", "price"], products)

    start = datetime.now(timezone.utc) - timedelta(days=180)
    orders: list[list[object]] = []
    transactions: list[list[object]] = []
    deliveries: list[list[object]] = []
    for index in range(1, args.orders + 1):
        customer = random.choice(customers)
        product = random.choice(products)
        created = start + timedelta(minutes=random.randint(0, 180 * 24 * 60))
        status = random.choices(["delivered", "processing", "pending", "cancelled"], [72, 12, 11, 5])[0]
        order_id = f"ORD-{index:08d}"
        amount = product[3]
        orders.append([order_id, customer[0], product[0], amount, customer[2], created.isoformat(), status])
        transactions.append([f"TXN-{index:08d}", order_id, amount, created.isoformat()])
        delivery_days = random.randint(1, 5) if status == "delivered" else ""
        deliveries.append([f"DLV-{index:08d}", order_id, delivery_days])

    write_rows(output / "orders.csv", ["order_id", "customer_id", "product_id", "amount", "location", "order_date", "status"], orders)
    write_rows(output / "transactions.csv", ["transaction_id", "order_id", "amount", "transaction_date"], transactions)
    write_rows(output / "delivery.csv", ["delivery_id", "order_id", "delivery_days"], deliveries)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--customers", type=int, default=100000)
    parser.add_argument("--products", type=int, default=10000)
    parser.add_argument("--orders", type=int, default=1000000)
    parser.add_argument("--output", default="./data")
    parser.add_argument("--seed", type=int, default=42)
    generate(parser.parse_args())