import mongoose, { Document, Schema } from "mongoose";

export interface IBanner extends Document {
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  image: string;
  status: "ACTIVE" | "INACTIVE";
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    buttonText: {
      type: String,
      trim: true,
      maxlength: [50, "Button text cannot exceed 50 characters"],
    },
    buttonLink: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Banner image is required"],
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for sorting
bannerSchema.index({ sortOrder: 1, createdAt: -1 });
bannerSchema.index({ status: 1 });

export default mongoose.model<IBanner>("Banner", bannerSchema);