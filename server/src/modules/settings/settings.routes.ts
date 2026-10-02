import { Router } from "express";
import { upload } from "../../middlewares/upload.middleware";
import {
  getSettingsCtrl,
  updateSettingsCtrl,
  uploadSettingsImageCtrl,
} from "./settings.controller";

const router = Router();

// Settings routes (admin)
router.get("/", getSettingsCtrl);
router.patch("/", updateSettingsCtrl);
router.post("/upload", upload.single("file"), uploadSettingsImageCtrl);

export default router;