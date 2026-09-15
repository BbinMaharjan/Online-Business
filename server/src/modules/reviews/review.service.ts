import { Request, Response } from "express";
import Review from "./review.model";
import Product from "../products/product.model";
import User from "../users/user.model";

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    let filter: any = { productId };

    // Filter by status if provided
    if (status) {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("userId", "firstName lastName avatar"),
      Review.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      message: "Product reviews retrieved successfully",
      data: {
        reviews,
        meta: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
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

export const createReview = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
        error: { code: "AUTHENTICATION_REQUIRED" },
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        error: { code: "PRODUCT_NOT_FOUND" },
      });
    }

    // Verify purchase (customer must have ordered the product)
    if (req.user?.role !== "ADMIN") {
      const hasPurchased = await verifyPurchase(userId, productId);
      if (!hasPurchased) {
        return res.status(403).json({
          success: false,
          message: "Only customers who purchased the product can review it",
          error: { code: "NOT_PURCHASED" },
        });
      }
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product",
        error: { code: "REVIEW_EXISTS" },
      });
    }

    const review = new Review({
      productId,
      userId,
      rating,
      title,
      comment,
      images: images || [],
      status: "PENDING", // New reviews need admin approval
    });

    await review.save();

    // Update product rating average
    await updateProductRating(productId);

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const adminUpdateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be APPROVED or REJECTED",
        error: { code: "INVALID_STATUS" },
      });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status },
      { new: true, runValidators: true },
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
        error: { code: "REVIEW_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Review status updated successfully",
      data: review,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
        error: { code: "REVIEW_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

function verifyPurchase(userId: string, productId: string): Promise<boolean> {
  // TODO: Implement verified purchase check
  // This would check if the user has an order containing this product
  // For now, return false to simulate not purchased
  return Promise.resolve(false);
}

function updateProductRating(productId: string): Promise<void> {
  // TODO: Update product's average rating
  return Promise.resolve();
}
