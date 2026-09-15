import { Request, Response } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "./cart.service";

export const getCartCtrl = async (req: Request, res: Response) => {
  await getCart(req, res);
};

export const addToCartCtrl = async (req: Request, res: Response) => {
  await addToCart(req, res);
};

export const updateCartItemCtrl = async (req: Request, res: Response) => {
  await updateCartItem(req, res);
};

export const removeFromCartCtrl = async (req: Request, res: Response) => {
  await removeFromCart(req, res);
};

export const clearCartCtrl = async (req: Request, res: Response) => {
  await clearCart(req, res);
};