import { Router, Request, Response } from "express";
import {
  getNotificationsCtrl,
  markAsReadCtrl,
  markAllAsReadCtrl,
} from "./notification.controller";

const router = Router();

// Notification routes
router.get("/:userId", getNotificationsCtrl);
router.patch("/:userId/:notificationId/read", markAsReadCtrl);
router.patch("/:userId/read-all", markAllAsReadCtrl);

export default router;