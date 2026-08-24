import { Router } from "express";
import { exportReport, generateReport, listReports } from "../controllers/reportController.js";

const router = Router();

router.get("/reports", listReports);
router.post("/reports/generate", generateReport);
router.get("/reports/export", exportReport);

export default router;
