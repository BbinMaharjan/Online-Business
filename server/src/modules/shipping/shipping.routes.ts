import { Router, Request, Response } from "express";
import {
  getShippingMethodsCtrl,
  getShippingMethodByIdCtrl,
  calculateShippingCtrl,
} from "./shipping.controller";

const router = Router();

// Shipping routes
router.get("/", getShippingMethodsCtrl);
router.get("/:id", getShippingMethodByIdCtrl);
router.post("/calculate", calculateShippingCtrl);

export default router;