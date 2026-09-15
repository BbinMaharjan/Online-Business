import { Request, Response } from "express";
import {
  getDashboardSummary,
  getBestSellingProducts,
  getBestPerformingCategories,
  getRecentOrders,
  getLowStockProducts,
} from "./dashboard.service";

export const getDashboardSummaryCtrl = async (req: Request, res: Response) => {
  await getDashboardSummary(req, res);
};

export const getBestSellingProductsCtrl = async (req: Request, res: Response) => {
  await getBestSellingProducts(req, res);
};

export const getBestPerformingCategoriesCtrl = async (req: Request, res: Response) => {
  await getBestPerformingCategories(req, res);
};

export const getRecentOrdersCtrl = async (req: Request, res: Response) => {
  await getRecentOrders(req, res);
};

export const getLowStockProductsCtrl = async (req: Request, res: Response) => {
  await getLowStockProducts(req, res);
};