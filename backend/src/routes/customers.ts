import { Router } from "express";
import { getCustomerById, getCustomerSummary, listCustomers } from "../controllers/customerController.js";

const router = Router();

router.get("/customers/summary", getCustomerSummary);
router.get("/customers", listCustomers);
router.get("/customers/:id", getCustomerById);

export default router;
