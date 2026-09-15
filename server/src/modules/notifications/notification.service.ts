import { Request, Response } from "express";
import Notification from "./notification.model";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { read } = req.query;

    let filter: any = { userId };

    if (read !== undefined) {
      filter.read = read === "true";
    }

    const notifications = await Notification.find(filter).sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Notifications retrieved successfully",
      data: notifications,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
        error: { code: "NOTIFICATION_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await Notification.updateMany({ userId, read: false }, { read: true });

    return res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const createNotification = async (userId: string, type: string, title: string, message: string, data?: any) => {
  const notification = new Notification({
    userId,
    type,
    title,
    message,
    data,
    read: false,
  });

  await notification.save();

  return notification;
};