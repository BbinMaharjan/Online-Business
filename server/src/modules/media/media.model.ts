import mongoose, { Document, Schema } from "mongoose";

export interface IMedia extends Document {
  url: string;
  filename: string;
  type: "PRODUCT_IMAGE" | "CATEGORY_IMAGE" | "AVATAR" | "GENERIC";
  referenceId: string; // ID of the product, category, etc.
  referenceType: "PRODUCT" | "CATEGORY" | "USER";
  size?: number;
  width?: number;
  height?: number;
  mimeType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    url: {
      type: String,
      required: [true, "Media URL is required"],
    },
    filename: {
      type: String,
      required: [true, "Media filename is required"],
    },
    type: {
      type: String,
      enum: ["PRODUCT_IMAGE", "CATEGORY_IMAGE", "AVATAR", "GENERIC"],
      required: true,
    },
    referenceId: {
      type: String,
      required: [true, "Reference ID is required"],
    },
    referenceType: {
      type: String,
      enum: ["PRODUCT", "CATEGORY", "USER"],
      required: true,
    },
    size: {
      type: Number,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    mimeType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for reference lookup
mediaSchema.index({ referenceId: 1, referenceType: 1 });

export default mongoose.model<IMedia>("Media", mediaSchema);