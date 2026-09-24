import { Router, Request, Response } from "express";
import { validate } from "../../middlewares/validate";
import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product.controller";
import { createProductSchema, updateProductSchema } from "./product.validation";

const router = Router();

// Product routes
router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/slug/:slug", getProductBySlug);
router.post("/", validate(createProductSchema), createProduct);
router.patch("/:id", validate(updateProductSchema), updateProduct);
router.delete("/:id", deleteProduct);

export default router;