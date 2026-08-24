import { Router } from "express";
import { getRevenueMonthly, getRevenueRegional, getRevenueSummary } from "../controllers/revenueController.js";

const router = Router();

router.get("/revenue/summary", getRevenueSummary);
router.get("/revenue/monthly", getRevenueMonthly);
router.get("/revenue/regional", getRevenueRegional);

export default router;
