import { Router } from "express";
import { getLiveSummary, publishLiveOrder, subscribeLiveStream } from "../controllers/liveController.js";

const router = Router();

router.get("/live/summary", getLiveSummary);
router.post("/live/publish", publishLiveOrder);
router.get("/live/stream", subscribeLiveStream);

export default router;
