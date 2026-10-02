import { Request, Response } from "express";
import {
  getSettings,
  updateSettings,
  uploadSettingsImage,
} from "./settings.service";

export const getSettingsCtrl = async (req: Request, res: Response) => {
  await getSettings(req, res);
};

export const updateSettingsCtrl = async (req: Request, res: Response) => {
  await updateSettings(req, res);
};

export const uploadSettingsImageCtrl = async (req: Request, res: Response) => {
  await uploadSettingsImage(req, res);
};