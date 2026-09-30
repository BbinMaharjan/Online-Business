import { Request, Response } from "express";
import {
  getSettings,
  updateSettings,
} from "./settings.service";

export const getSettingsCtrl = async (req: Request, res: Response) => {
  await getSettings(req, res);
};

export const updateSettingsCtrl = async (req: Request, res: Response) => {
  await updateSettings(req, res);
};