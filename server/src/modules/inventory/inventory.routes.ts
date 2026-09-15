import { Router, Request, Response } from "express";
import {
  getInventoryCtrl,
  getInventoryByProductCtrl,
  reserveStockCtrl,
  releaseStockCtrl,
  adjustStockCtrl,
} from "./inventory.controller";

const router = Router();

// Inventory routes
router.get("/", getInventoryCtrl);
router.get("/product/:productId", getInventoryByProductCtrl);
router.post("/reserve", reserveStockCtrl);
router.post("/release", releaseStockCtrl);
router.post("/adjust", adjustStockCtrl);

export default router;