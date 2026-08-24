import { Router } from "express";
import { getPreferences, savePreferences } from "../controllers/preferencesController.js";

const router = Router();

router.get("/preferences", getPreferences);
router.post("/preferences", savePreferences);

export default router;
