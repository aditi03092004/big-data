import { Router } from "express";
import { getOrderById, getOrderSummary, listOrders } from "../controllers/orderController.js";

const router = Router();

router.get("/orders/summary", getOrderSummary);
router.get("/orders", listOrders);
router.get("/orders/:id", getOrderById);

export default router;
