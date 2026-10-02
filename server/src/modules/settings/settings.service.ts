import { Request, Response } from "express";
import Settings from "./settings.model";
import { localFileService } from "../../services/localFile.service";

export const getSettings = async (_req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        siteName: "My Store",
        siteDescription: "Welcome to my store",
        maintenanceMode: false,
        maintenanceMessage: "We are currently under maintenance. Please check back later.",
      });
    }

    return res.json({
      success: true,
      message: "Settings retrieved successfully",
      data: settings,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { siteName, siteDescription, storeLogo, favicon, maintenanceMode, maintenanceMessage } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        siteName: siteName || "My Store",
        siteDescription: siteDescription || "",
        storeLogo,
        favicon,
        maintenanceMode: maintenanceMode ?? false,
        maintenanceMessage,
      });
    } else {
      if (siteName !== undefined) settings.siteName = siteName;
      if (siteDescription !== undefined) settings.siteDescription = siteDescription;
      if (storeLogo !== undefined) settings.storeLogo = storeLogo;
      if (favicon !== undefined) settings.favicon = favicon;
      if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
      if (maintenanceMessage !== undefined) settings.maintenanceMessage = maintenanceMessage;

      await settings.save();
    }

    return res.json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const uploadSettingsImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
        error: { code: "NO_FILE_UPLOADED" },
      });
    }

    const { type } = req.body;

    if (!type || !["storeLogo", "favicon"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Must be 'storeLogo' or 'favicon'",
        error: { code: "INVALID_TYPE" },
      });
    }

    const { url, publicId } = await localFileService.uploadImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: { url },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};