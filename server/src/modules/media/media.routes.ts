import { Router } from "express";
import { upload } from "../../middlewares/upload.middleware";
import {
  uploadMediaCtrl,
  deleteMediaCtrl,
  getMediaByIdCtrl,
  getMediaByReferenceCtrl,
} from "./media.controller";

const router = Router();

// Media routes
router.post("/upload", upload.single("file"), uploadMediaCtrl);
router.delete("/:mediaId", deleteMediaCtrl);
router.get("/:mediaId", getMediaByIdCtrl);
router.get("/reference/:referenceId/:referenceType", getMediaByReferenceCtrl);

export default router;