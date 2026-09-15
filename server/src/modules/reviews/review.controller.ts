import { Request, Response } from "express";
import {
  getProductReviews,
  createReview,
  adminUpdateReviewStatus,
  deleteReview,
} from "./review.service";

export const getProductReviewsCtrl = async (req: Request, res: Response) => {
  await getProductReviews(req, res);
};

export const createReviewCtrl = async (req: Request, res: Response) => {
  await createReview(req, res);
};

export const adminUpdateReviewStatusCtrl = async (req: Request, res: Response) => {
  await adminUpdateReviewStatus(req, res);
};

export const deleteReviewCtrl = async (req: Request, res: Response) => {
  await deleteReview(req, res);
};