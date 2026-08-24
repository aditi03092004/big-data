import { Router } from "express";
import { listFilters, saveFilter, deleteFilter } from "../controllers/filtersController.js";

const router = Router();

router.get("/filters", listFilters);
router.post("/filters", saveFilter);
router.delete("/filters/:id", deleteFilter);

export default router;
