import { Request, Response } from "express";
import Media from "./media.model";

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
        error: { code: "NO_FILE_UPLOADED" },
      });
    }

    const { type, referenceId, referenceType } = req.body;

    if (!type || !referenceId || !referenceType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: type, referenceId, referenceType",
        error: { code: "MISSING_REQUIRED_FIELDS" },
      });
    }

    const media = new Media({
      url: req.file.path,
      filename: req.file.filename,
      type: type as "PRODUCT_IMAGE" | "CATEGORY_IMAGE" | "AVATAR" | "GENERIC",
      referenceId,
      referenceType: referenceType as "PRODUCT" | "CATEGORY" | "USER",
      size: req.file.size,
      mimeType: req.file.mimeType,
    });

    await media.save();

    return res.status(201).json({
      success: true,
      message: "Media uploaded successfully",
      data: media,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const { mediaId } = req.params;

    const media = await Media.findByIdAndDelete(mediaId);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
        error: { code: "MEDIA_NOT_FOUND" },
      });
    }

    // TODO: Delete the actual file from storage (S3, Cloudinary, etc.)

    return res.json({
      success: true,
      message: "Media deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const getMediaById = async (req: Request, res: Response) => {
  try {
    const { mediaId } = req.params;

    const media = await Media.findById(mediaId);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
        error: { code: "MEDIA_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Media retrieved successfully",
      data: media,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const getMediaByReference = async (req: Request, res: Response) => {
  try {
    const { referenceId, referenceType } = req.params;

    const media = await Media.find({ referenceId, referenceType });

    return res.json({
      success: true,
      message: "Media retrieved successfully",
      data: media,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};