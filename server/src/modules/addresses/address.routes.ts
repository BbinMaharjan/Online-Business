import { Router, Request, Response } from "express";
import {
  getAddressesCtrl,
  getAddressByIdCtrl,
  createAddressCtrl,
  updateAddressCtrl,
  deleteAddressCtrl,
} from "./address.controller";

const router = Router();

// Address routes
router.get("/:userId", getAddressesCtrl);
router.get("/:userId/:id", getAddressByIdCtrl);
router.post("/:userId", createAddressCtrl);
router.patch("/:userId/:id", updateAddressCtrl);
router.delete("/:userId/:id", deleteAddressCtrl);

export default router;