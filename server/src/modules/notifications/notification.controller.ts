import { Request, Response } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "./notification.service";

export const getNotificationsCtrl = async (req: Request, res: Response) => {
  await getNotifications(req, res);
};

export const markAsReadCtrl = async (req: Request, res: Response) => {
  await markAsRead(req, res);
};

export const markAllAsReadCtrl = async (req: Request, res: Response) => {
  await markAllAsRead(req, res);
};