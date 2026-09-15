import { Router, Request, Response } from "express";
import {
  getWishlistCtrl,
  addToWishlistCtrl,
  removeFromWishlistCtrl,
  checkWishlistCtrl,
} from "./wishlist.controller";

const router = Router();

// Wishlist routes
router.get("/:userId", getWishlistCtrl);
router.post("/:userId/:productId", addToWishlistCtrl);
router.delete("/:userId/:productId", removeFromWishlistCtrl);
router.get("/:userId/check/:productId", checkWishlistCtrl);

export default router;