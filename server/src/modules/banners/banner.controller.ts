import { Request, Response } from "express";
import {
  createBanner,
  getBanners,
  getPublicBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from "./banner.service";

export const createBannerCtrl = async (req: Request, res: Response) => {
  await createBanner(req, res);
};

export const getBannersCtrl = async (req: Request, res: Response) => {
  await getBanners(req, res);
};

export const getPublicBannersCtrl = async (req: Request, res: Response) => {
  await getPublicBanners(req, res);
};

export const getBannerByIdCtrl = async (req: Request, res: Response) => {
  await getBannerById(req, res);
};

export const updateBannerCtrl = async (req: Request, res: Response) => {
  await updateBanner(req, res);
};

export const deleteBannerCtrl = async (req: Request, res: Response) => {
  await deleteBanner(req, res);
};