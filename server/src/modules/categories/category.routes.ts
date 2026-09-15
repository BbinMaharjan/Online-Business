import { Router, Request, Response } from "express";
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./category.controller";

const router = Router();

// Category routes
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.get("/slug/:slug", getCategoryBySlug);
router.post("/", createCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;