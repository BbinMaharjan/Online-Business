import { Router, Request, Response } from "express";
import { authenticate } from "../../middlewares/authentication.middleware";
import {
  registerCtrl,
  loginCtrl,
  logoutCtrl,
  refreshTokenCtrl,
  forgotPasswordCtrl,
  resetPasswordCtrl,
  getMeCtrl,
} from "./auth.controller";

const router = Router();

// Authentication routes
router.post("/register", registerCtrl);
router.post("/login", loginCtrl);
router.post("/logout", logoutCtrl);
router.post("/refresh", refreshTokenCtrl);
router.post("/forgot-password", forgotPasswordCtrl);
router.post("/reset-password/:token", resetPasswordCtrl);
router.get("/me", authenticate, getMeCtrl);

export default router;