import mongoose, { Document, Schema, model } from "mongoose";

export interface IBrand extends Document {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  status: "ACTIVE" | "INACTIVE";
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      maxlength: [100, "Brand name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Brand slug is required"],
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    seo: {
      title: {
        type: String,
        default: "",
      },
      description: {
        type: String,
        default: "",
      },
      keywords: {
        type: [],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

export default model<IBrand>("Brand", brandSchema);