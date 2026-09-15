import { Router, Request, Response } from "express";
import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product.controller";

const router = Router();

// Product routes
router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/slug/:slug", getProductBySlug);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;