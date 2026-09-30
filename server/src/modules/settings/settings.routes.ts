import { Router } from "express";
import {
  getSettingsCtrl,
  updateSettingsCtrl,
} from "./settings.controller";

const router = Router();

// Settings routes (admin)
router.get("/", getSettingsCtrl);
router.patch("/", updateSettingsCtrl);

export default router;