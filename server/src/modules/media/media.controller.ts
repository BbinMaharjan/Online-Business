import { Request, Response } from "express";
import {
  uploadMedia,
  deleteMedia,
  getMediaById,
  getMediaByReference,
} from "./media.service";

export const uploadMediaCtrl = async (req: Request, res: Response) => {
  await uploadMedia(req, res);
};

export const deleteMediaCtrl = async (req: Request, res: Response) => {
  await deleteMedia(req, res);
};

export const getMediaByIdCtrl = async (req: Request, res: Response) => {
  await getMediaById(req, res);
};

export const getMediaByReferenceCtrl = async (req: Request, res: Response) => {
  await getMediaByReference(req, res);
};