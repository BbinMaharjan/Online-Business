import { Request, Response } from "express";
import ShippingMethod from "./shipping.model";

export const getShippingMethods = async (req: Request, res: Response) => {
  try {
    const methods = await ShippingMethod.find({ status: "ACTIVE" });

    return res.json({
      success: true,
      message: "Shipping methods retrieved successfully",
      data: methods,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const getShippingMethodById = async (req: Request, res: Response) => {
  try {
    const method = await ShippingMethod.findById(req.params.id);

    if (!method) {
      return res.status(404).json({
        success: false,
        message: "Shipping method not found",
        error: { code: "SHIPPING_METHOD_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Shipping method retrieved successfully",
      data: method,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const calculateShipping = async (req: Request, res: Response) => {
  try {
    const { subtotal, shippingAddress } = req.body;

    if (!subtotal) {
      return res.status(400).json({
        success: false,
        message: "Subtotal is required",
        error: { code: "SUBTOTAL_REQUIRED" },
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
        error: { code: "SHIPPING_ADDRESS_REQUIRED" },
      });
    }

    // Find applicable shipping methods
    const methods = await ShippingMethod.find({ status: "ACTIVE" });

    const calculatedMethods = methods.map((method) => {
      let price = method.price;

      // Add additional price for specific zones if applicable
      if (method.zones && shippingAddress.country) {
        const zone = method.zones.find(
          (z) => z.name === shippingAddress.country || z.code === shippingAddress.country
        );
        if (zone && zone.additionalPrice) {
          price += zone.additionalPrice;
        }
      }

      return {
        methodId: method._id,
        methodName: method.name,
        price,
        estimatedDays: method.estimatedDays,
        status: method.status,
      };
    });

    return res.json({
      success: true,
      message: "Shipping calculated successfully",
      data: calculatedMethods,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};