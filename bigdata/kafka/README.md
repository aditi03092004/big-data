# Kafka streaming boundary

The live dashboard uses the `ecommerce-orders` topic. In Big Data Mode, the
Node service publishes order events to that topic and consumes them before
forwarding them to browser clients through the live summary stream.

```json
{
  "eventType": "ORDER_CREATED",
  "orderId": "ORD10001",
  "customerId": "CUS1001",
  "productId": "PROD500",
  "amount": 54999,
  "location": "Bengaluru",
  "timestamp": "2026-08-14T15:30:00Z"
}
```

Demo Mode intentionally uses a bounded in-memory stream and labels it
`DEMO STREAM`; it never claims Kafka is connected.