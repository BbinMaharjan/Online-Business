import { Router, Request, Response } from "express";
import {
  getDashboardSummaryCtrl,
  getBestSellingProductsCtrl,
  getBestPerformingCategoriesCtrl,
  getRecentOrdersCtrl,
  getLowStockProductsCtrl,
} from "./dashboard.controller";

const router = Router();

// Admin Dashboard routes
router.get("/summary", getDashboardSummaryCtrl);
router.get("/best-selling-products", getBestSellingProductsCtrl);
router.get("/best-performing-categories", getBestPerformingCategoriesCtrl);
router.get("/recent-orders", getRecentOrdersCtrl);
router.get("/low-stock-products", getLowStockProductsCtrl);

export default router;