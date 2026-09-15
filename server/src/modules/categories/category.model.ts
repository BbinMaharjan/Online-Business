import mongoose, { Document, Schema, model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  status: "ACTIVE" | "INACTIVE";
  sortOrder: number;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    parentId: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: "",
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

// Index for hierarchical queries
categorySchema.index({ parentId: 1 });

export default model<ICategory>("Category", categorySchema);