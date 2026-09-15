import { Request, Response } from "express";
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} from "./address.service";

export const getAddressesCtrl = async (req: Request, res: Response) => {
  await getAddresses(req, res);
};

export const getAddressByIdCtrl = async (req: Request, res: Response) => {
  await getAddressById(req, res);
};

export const createAddressCtrl = async (req: Request, res: Response) => {
  await createAddress(req, res);
};

export const updateAddressCtrl = async (req: Request, res: Response) => {
  await updateAddress(req, res);
};

export const deleteAddressCtrl = async (req: Request, res: Response) => {
  await deleteAddress(req, res);
};