import { Request, Response } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} from "./wishlist.service";

export const getWishlistCtrl = async (req: Request, res: Response) => {
  await getWishlist(req, res);
};

export const addToWishlistCtrl = async (req: Request, res: Response) => {
  await addToWishlist(req, res);
};

export const removeFromWishlistCtrl = async (req: Request, res: Response) => {
  await removeFromWishlist(req, res);
};

export const checkWishlistCtrl = async (req: Request, res: Response) => {
  await checkWishlist(req, res);
};