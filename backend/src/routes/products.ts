import { Router } from "express";
import { getProductById, getProductSummary, listProducts } from "../controllers/productController.js";

const router = Router();

router.get("/products/summary", getProductSummary);
router.get("/products", listProducts);
router.get("/products/:id", getProductById);

export default router;
