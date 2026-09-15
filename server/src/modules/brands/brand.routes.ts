import { Router, Request, Response } from "express";
import {
  getBrands,
  getBrandById,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
} from "./brand.controller";

const router = Router();

// Brand routes
router.get("/", getBrands);
router.get("/:id", getBrandById);
router.get("/slug/:slug", getBrandBySlug);
router.post("/", createBrand);
router.patch("/:id", updateBrand);
router.delete("/:id", deleteBrand);

export default router;