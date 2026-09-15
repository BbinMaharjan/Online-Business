import { Router, Request, Response } from "express";
import {
  getCouponsCtrl,
  validateCouponCtrl,
  createCouponCtrl,
  updateCouponCtrl,
  deleteCouponCtrl,
} from "./coupon.controller";

const router = Router();

// Coupon routes
router.get("/", getCouponsCtrl);
router.post("/validate/:code", validateCouponCtrl);
router.post("/", createCouponCtrl);
router.patch("/:code", updateCouponCtrl);
router.delete("/:code", deleteCouponCtrl);

export default router;