import { Router } from "express";
import { listDatasets } from "../controllers/dataExplorerController.js";

const router = Router();

router.get("/datasets", listDatasets);

export default router;
