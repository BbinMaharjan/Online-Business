import { Router, Request, Response } from "express";
import {
  uploadMediaCtrl,
  deleteMediaCtrl,
  getMediaByIdCtrl,
  getMediaByReferenceCtrl,
} from "./media.controller";

const router = Router();

// Media routes
router.post("/upload", uploadMediaCtrl);
router.delete("/:mediaId", deleteMediaCtrl);
router.get("/:mediaId", getMediaByIdCtrl);
router.get("/reference/:referenceId/:referenceType", getMediaByReferenceCtrl);

export default router;