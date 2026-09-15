import { Router, Request, Response } from "express";
import { authenticate, optionalAuth } from "../../middlewares/authentication.middleware";
import {
  getMe,
  updateMe,
  updatePassword,
} from "./user.controller";

const router = Router();

// Protected routes - require authentication
router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, updateMe);
router.patch("/me/password", authenticate, updatePassword);

// Admin routes
router.get("/admin/users", authenticate, optionalAuth, async (req: Request, res: Response) => {
  // Only admins can access this
  if (req.user?.role !== "ADMIN" && req.user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Forbidden - admin access required",
      error: { code: "FORBIDDEN" },
    });
  }
  // TODO: Implement admin user listing
  res.json({
    success: true,
    message: "Admin users listing",
    data: [],
  });
});

router.get("/admin/users/:id", authenticate, optionalAuth, async (req: Request, res: Response) => {
  if (req.user?.role !== "ADMIN" && req.user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Forbidden - admin access required",
      error: { code: "FORBIDDEN" },
    });
  }
  res.json({
    success: true,
    message: "Admin user detail",
  });
});

router.patch("/admin/users/:id", authenticate, optionalAuth, async (req: Request, res: Response) => {
  if (req.user?.role !== "ADMIN" && req.user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Forbidden - admin access required",
      error: { code: "FORBIDDEN" },
    });
  }
  res.json({
    success: true,
    message: "Admin user update",
  });
});

router.delete("/admin/users/:id", authenticate, optionalAuth, async (req: Request, res: Response) => {
  if (req.user?.role !== "ADMIN" && req.user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Forbidden - admin access required",
      error: { code: "FORBIDDEN" },
    });
  }
  res.json({
    success: true,
    message: "Admin user deleted",
  });
});

export default router;