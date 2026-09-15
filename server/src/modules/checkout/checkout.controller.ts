import { Request, Response } from "express";
import { checkout, createOrder } from "./checkout.service";

export const checkoutCtrl = async (req: Request, res: Response) => {
  await checkout(req, res);
};

export const createOrderCtrl = async (req: Request, res: Response) => {
  await createOrder(req, res);
};