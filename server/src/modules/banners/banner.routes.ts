import { Router } from "express";
import {
  createBannerCtrl,
  getBannersCtrl,
  getPublicBannersCtrl,
  getBannerByIdCtrl,
  updateBannerCtrl,
  deleteBannerCtrl,
} from "./banner.controller";

const router = Router();

// Public route for client storefront
router.get("/public", getPublicBannersCtrl);

// Admin routes
router.post("/", createBannerCtrl);
router.get("/", getBannersCtrl);
router.get("/:bannerId", getBannerByIdCtrl);
router.patch("/:bannerId", updateBannerCtrl);
router.delete("/:bannerId", deleteBannerCtrl);

export default router;