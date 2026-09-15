import { Request, Response } from "express";
import Address from "./address.model";

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const addresses = await Address.find({ userId });

    return res.json({
      success: true,
      message: "Addresses retrieved successfully",
      data: addresses,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const getAddressById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
        error: { code: "ADDRESS_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Address retrieved successfully",
      data: address,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const createAddress = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      isDefault,
      type,
    } = req.body;

    // If this is set as default, unset other default addresses for the same user and type
    if (isDefault) {
      await Address.updateMany(
        { userId: req.params.userId, type },
        { isDefault: false }
      );
    }

    const address = new Address({
      userId: req.params.userId,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      isDefault: isDefault || false,
      type: type || "SHIPPING",
    });

    await address.save();

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      isDefault,
      type,
    } = req.body;

    // If setting as default, unset other default addresses
    if (isDefault) {
      await Address.updateMany(
        { userId: req.user?.userId, type },
        { isDefault: false }
      );
    }

    const address = await Address.findByIdAndUpdate(
      id,
      {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        postalCode,
        isDefault: isDefault || undefined,
        type: type || undefined,
      },
      { new: true, runValidators: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
        error: { code: "ADDRESS_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const address = await Address.findByIdAndDelete(id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
        error: { code: "ADDRESS_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};