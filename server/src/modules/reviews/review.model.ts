import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  productId: string;
  userId: string;
  orderId?: string;
  rating: number; // 1-5
  title?: string;
  comment?: string;
  images?: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    productId: {
      type: String,
      required: [true, "Product ID is required"],
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
    },
    orderId: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    comment: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

// Index for product and user lookup
reviewSchema.index({ productId: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ orderId: 1 });
reviewSchema.index({ status: 1 });

export default mongoose.model<IReview>("Review", reviewSchema);