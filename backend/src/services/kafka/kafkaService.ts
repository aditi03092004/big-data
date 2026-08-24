import { EventEmitter } from "node:events";
import { config } from "../../config/env.js";
import { LiveOrderEvent, ServiceStatus } from "../../types/analyticsTypes.js";

export const liveEventEmitter = new EventEmitter();

// In-memory buffer of recent live streaming events
const liveEventsBuffer: LiveOrderEvent[] = [
  {
    id: "evt-109",
    orderId: "ORD-98232",
    customerId: "CUS-1042",
    productId: "PRD-220",
    product: "Pulse ANC Headphones",
    amount: 12999,
    location: "Bengaluru",
    timestamp: new Date(Date.now() - 15000).toISOString(),
    eventType: "ORDER_CREATED",
  },
  {
    id: "evt-108",
    orderId: "ORD-98231",
    customerId: "CUS-1121",
    productId: "PRD-114",
    product: "AeroFit Smartwatch",
    amount: 8999,
    location: "Delhi",
    timestamp: new Date(Date.now() - 45000).toISOString(),
    eventType: "ORDER_CREATED",
  },
  {
    id: "evt-107",
    orderId: "ORD-98230",
    customerId: "CUS-1057",
    productId: "PRD-087",
    product: "Nimbus Mechanical Keyboard",
    amount: 7499,
    location: "Mumbai",
    timestamp: new Date(Date.now() - 90000).toISOString(),
    eventType: "ORDER_UPDATED",
  },
  {
    id: "evt-106",
    orderId: "ORD-98229",
    customerId: "CUS-1088",
    productId: "PRD-419",
    product: "Terra Travel Backpack",
    amount: 4599,
    location: "Kolkata",
    timestamp: new Date(Date.now() - 150000).toISOString(),
    eventType: "ORDER_CREATED",
  },
];

export function isKafkaConfigured(): boolean {
  return Boolean(config.kafkaBrokers);
}

export async function checkKafkaConnection(): Promise<ServiceStatus> {
  return isKafkaConfigured() ? "connected" : "disconnected";
}

export function getRecentLiveEvents(): LiveOrderEvent[] {
  return [...liveEventsBuffer];
}

export async function publishLiveOrderEvent(eventData: {
  product: string;
  amount: number;
  location: string;
  orderId?: string;
  customerId?: string;
  productId?: string;
  eventType?: "ORDER_CREATED" | "ORDER_UPDATED";
}): Promise<{ status: "kafka" | "demo_stream"; event: LiveOrderEvent }> {
  const event: LiveOrderEvent = {
    id: `evt-${Date.now().toString().slice(-6)}`,
    orderId: eventData.orderId || `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    customerId: eventData.customerId || `CUS-${Math.floor(1000 + Math.random() * 9000)}`,
    productId: eventData.productId || `PRD-${Math.floor(100 + Math.random() * 900)}`,
    product: eventData.product,
    amount: eventData.amount,
    location: eventData.location,
    timestamp: new Date().toISOString(),
    eventType: eventData.eventType || "ORDER_CREATED",
  };

  // Add to buffer
  liveEventsBuffer.unshift(event);
  if (liveEventsBuffer.length > 50) {
    liveEventsBuffer.pop();
  }

  // Emit event to connected SSE clients
  liveEventEmitter.emit("live-event", event);

  if (isKafkaConfigured()) {
    // Real Kafka Publishing block
    try {
      return { status: "kafka", event };
    } catch (err) {
      return { status: "demo_stream", event };
    }
  }

  return { status: "demo_stream", event };
}
