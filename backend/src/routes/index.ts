import { Router } from "express";
import healthRouter from "./health.js";
import dashboardRouter from "./dashboard.js";
import customerRouter from "./customers.js";
import productRouter from "./products.js";
import orderRouter from "./orders.js";
import revenueRouter from "./revenue.js";
import liveRouter from "./live.js";
import dataExplorerRouter from "./dataExplorer.js";
import queryRouter from "./queries.js";
import reportRouter from "./reports.js";
import bigdataRouter from "./bigdata.js";
import preferencesRouter from "./preferences.js";
import profileRouter from "./profile.js";
import filterRouter from "./filters.js";

const router = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(customerRouter);
router.use(productRouter);
router.use(orderRouter);
router.use(revenueRouter);
router.use(liveRouter);
router.use(dataExplorerRouter);
router.use(queryRouter);
router.use(reportRouter);
router.use(bigdataRouter);
router.use(preferencesRouter);
router.use(profileRouter);
router.use(filterRouter);

export default router;
