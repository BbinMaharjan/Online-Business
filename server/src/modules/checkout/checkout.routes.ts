import { Router, Request, Response } from "express";
import { checkoutCtrl, createOrderCtrl } from "./checkout.controller";

const router = Router();

// Checkout routes
router.post("/:userId", checkoutCtrl);
router.post("/:userId/order", createOrderCtrl);

export default router;