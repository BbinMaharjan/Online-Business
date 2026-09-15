import { Request, Response } from "express";
import Wishlist from "./wishlist.model";
import Product from "../products/product.model";

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.find({ userId }).populate("productId", "name slug price images");

    return res.json({
      success: true,
      message: "Wishlist retrieved successfully",
      data: wishlist,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        error: { code: "PRODUCT_NOT_FOUND" },
      });
    }

    // Check if product already in wishlist
    const existing = await Wishlist.findOne({ userId, productId });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Product is already in your wishlist",
        error: { code: "PRODUCT_EXISTS_IN_WISHLIST" },
      });
    }

    // Add to wishlist
    const wishlistItem = new Wishlist({
      userId,
      productId,
    });

    await wishlistItem.save();

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist successfully",
      data: wishlistItem,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.params;

    const wishlistItem = await Wishlist.findOneAndDelete({ userId, productId });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
        error: { code: "PRODUCT_NOT_IN_WISHLIST" },
      });
    }

    return res.json({
      success: true,
      message: "Product removed from wishlist successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const checkWishlist = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.params;

    const wishlistItem = await Wishlist.findOne({ userId, productId });

    return res.json({
      success: true,
      message: "Wishlist check completed",
      data: {
        isInWishlist: !!wishlistItem,
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