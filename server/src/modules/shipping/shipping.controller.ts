import { Request, Response } from "express";
import {
  getShippingMethods,
  getShippingMethodById,
  calculateShipping,
} from "./shipping.service";

export const getShippingMethodsCtrl = async (req: Request, res: Response) => {
  await getShippingMethods(req, res);
};

export const getShippingMethodByIdCtrl = async (req: Request, res: Response) => {
  await getShippingMethodById(req, res);
};

export const calculateShippingCtrl = async (req: Request, res: Response) => {
  await calculateShipping(req, res);
};