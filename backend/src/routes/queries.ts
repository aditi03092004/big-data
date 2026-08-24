import { Router } from "express";
import { listQueries, runQuery } from "../controllers/queryController.js";

const router = Router();

router.get("/queries", listQueries);
router.post("/queries/run", runQuery);

export default router;
