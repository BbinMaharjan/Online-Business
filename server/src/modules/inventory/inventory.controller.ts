import { Request, Response } from "express";
import {
  getInventory,
  getInventoryByProduct,
  reserveStock,
  releaseStock,
  adjustStock,
} from "./inventory.service";

export const getInventoryCtrl = async (req: Request, res: Response) => {
  await getInventory(req, res);
};

export const getInventoryByProductCtrl = async (req: Request, res: Response) => {
  await getInventoryByProduct(req, res);
};

export const reserveStockCtrl = async (req: Request, res: Response) => {
  await reserveStock(req, res);
};

export const releaseStockCtrl = async (req: Request, res: Response) => {
  await releaseStock(req, res);
};

export const adjustStockCtrl = async (req: Request, res: Response) => {
  await adjustStock(req, res);
};