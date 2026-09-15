import { Router, Request, Response } from "express";
import {
  getCartCtrl,
  addToCartCtrl,
  updateCartItemCtrl,
  removeFromCartCtrl,
  clearCartCtrl,
} from "./cart.controller";

const router = Router();

// Cart routes
router.get("/:userId", getCartCtrl);
router.post("/:userId/items", addToCartCtrl);
router.patch("/:userId/items/:itemId", updateCartItemCtrl);
router.delete("/:userId/items", removeFromCartCtrl);
router.delete("/:userId", clearCartCtrl);

export default router;