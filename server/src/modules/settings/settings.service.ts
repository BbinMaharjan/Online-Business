import { Request, Response } from "express";
import Settings from "./settings.model";

export const getSettings = async (_req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        siteName: "My Store",
        siteDescription: "Welcome to my store",
        taxEnabled: false,
        taxRate: 0,
        shippingEnabled: false,
        freeShippingThreshold: 0,
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
    const { siteName, siteDescription, storeLogo, taxEnabled, taxRate, shippingEnabled, freeShippingThreshold, maintenanceMode, maintenanceMessage } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        siteName: siteName || "My Store",
        siteDescription: siteDescription || "",
        storeLogo,
        taxEnabled: taxEnabled ?? false,
        taxRate: taxRate ?? 0,
        shippingEnabled: shippingEnabled ?? false,
        freeShippingThreshold: freeShippingThreshold ?? 0,
        maintenanceMode: maintenanceMode ?? false,
        maintenanceMessage,
      });
    } else {
      if (siteName !== undefined) settings.siteName = siteName;
      if (siteDescription !== undefined) settings.siteDescription = siteDescription;
      if (storeLogo !== undefined) settings.storeLogo = storeLogo;
      if (taxEnabled !== undefined) settings.taxEnabled = taxEnabled;
      if (taxRate !== undefined) settings.taxRate = taxRate;
      if (shippingEnabled !== undefined) settings.shippingEnabled = shippingEnabled;
      if (freeShippingThreshold !== undefined) settings.freeShippingThreshold = freeShippingThreshold;
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