import { Router, Request, Response } from "express";
import { authenticate, optionalAuth } from "../../middlewares/authentication.middleware";
import {
  getMe,
  updateMe,
  updatePassword,
  getAdminUsers,
  createAdminUser,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser,
} from "./user.controller";

const router = Router();

// Protected routes - require authentication
router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, updateMe);
router.patch("/me/password", authenticate, updatePassword);

// Admin routes
router.get("/admin/users", authenticate, optionalAuth, getAdminUsers);
router.post("/admin/users", authenticate, optionalAuth, createAdminUser);
router.get("/admin/users/:id", authenticate, optionalAuth, getAdminUserById);
router.patch("/admin/users/:id", authenticate, optionalAuth, updateAdminUser);
router.delete("/admin/users/:id", authenticate, optionalAuth, deleteAdminUser);

export default router;