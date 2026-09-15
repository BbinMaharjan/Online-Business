import { Request, Response } from "express";
import {
  getCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "./coupon.service";

export const getCouponsCtrl = async (req: Request, res: Response) => {
  await getCoupons(req, res);
};

export const validateCouponCtrl = async (req: Request, res: Response) => {
  await validateCoupon(req, res);
};

export const createCouponCtrl = async (req: Request, res: Response) => {
  await createCoupon(req, res);
};

export const updateCouponCtrl = async (req: Request, res: Response) => {
  await updateCoupon(req, res);
};

export const deleteCouponCtrl = async (req: Request, res: Response) => {
  await deleteCoupon(req, res);
};