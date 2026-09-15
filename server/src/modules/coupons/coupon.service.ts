import { Request, Response } from "express";
import Coupon from "./coupon.model";

export const getCoupons = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    let filter: any = {};

    if (status) {
      filter.status = status;
    }

    const coupons = await Coupon.find(filter);

    return res.json({
      success: true,
      message: "Coupons retrieved successfully",
      data: coupons,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const { orderAmount } = req.body;
    const { userId } = req.user;

    if (!orderAmount) {
      return res.status(400).json({
        success: false,
        message: "Order amount is required for coupon validation",
        error: { code: "ORDER_AMOUNT_REQUIRED" },
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
        error: { code: "COUPON_NOT_FOUND" },
      });
    }

    // Validate the coupon
    const validationResult = await coupon.validateCoupon(orderAmount, userId);

    return res.json({
      success: validationResult.valid,
      message: validationResult.message,
      data: {
        discount: validationResult.discount,
        couponCode: coupon.code,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscount,
      usageLimit,
      usagePerUser,
      startDate,
      endDate,
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message: "Coupon with this code already exists",
        error: { code: "COUPON_EXISTS" },
      });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscount,
      usageLimit,
      usagePerUser,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: "ACTIVE",
    });

    await coupon.save();

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const {
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscount,
      usageLimit,
      usagePerUser,
      startDate,
      endDate,
      status,
    } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
        error: { code: "COUPON_NOT_FOUND" },
      });
    }

    // Update coupon fields
    if (description !== undefined) coupon.description = description;
    if (discountType !== undefined) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (minimumOrderAmount !== undefined) coupon.minimumOrderAmount = minimumOrderAmount;
    if (maximumDiscount !== undefined) coupon.maximumDiscount = maximumDiscount;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (usagePerUser !== undefined) coupon.usagePerUser = usagePerUser;
    if (startDate !== undefined) coupon.startDate = new Date(startDate);
    if (endDate !== undefined) coupon.endDate = new Date(endDate);
    if (status !== undefined) coupon.status = status;

    await coupon.save();

    return res.json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const coupon = await Coupon.findOneAndDelete({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
        error: { code: "COUPON_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};