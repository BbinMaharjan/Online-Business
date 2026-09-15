import { Router, Request, Response } from "express";
import {
  getProductReviewsCtrl,
  createReviewCtrl,
  adminUpdateReviewStatusCtrl,
  deleteReviewCtrl,
} from "./review.controller";

const router = Router();

// Reviews routes
router.get("/product/:productId", getProductReviewsCtrl);
router.post("/product/:productId", createReviewCtrl);
router.patch("/admin/:reviewId/status", adminUpdateReviewStatusCtrl);
router.delete("/admin/:reviewId", deleteReviewCtrl);

export default router;