import mongoose, { Document, Schema, model } from "mongoose";

export interface IVariant {
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: {
    [key: string]: string;
  };
  images?: string[];
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  brandId: string;
  images?: string[];
  price: number;
  compareAtPrice?: number;
  tax: number;
  variants?: IVariant[];
  attributes?: {
    [key: string]: string;
  }[];
  tags?: string[];
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  featured: boolean;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<IVariant>(
  {
    name: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    attributes: {
      type: Map,
      of: String,
    },
    images: [{
      type: String,
    }],
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
    },
    sku: {
      type: String,
      required: [true, "Product SKU is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    categoryId: {
      type: String,
      required: [true, "Category ID is required"],
    },
    brandId: {
      type: String,
      required: [true, "Brand ID is required"],
    },
    images: [{
      type: String,
    }],
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be greater than zero"],
    },
    compareAtPrice: {
      type: Number,
      min: [0, "Compare at price must be greater than zero"],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, "Tax must be greater than or equal to zero"],
    },
    variants: [variantSchema],
    attributes: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    tags: [String],
    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED"],
      default: "ACTIVE",
    },
    featured: {
      type: Boolean,
      default: false,
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
      keywords: [{
        type: String,
        default: [],
      }],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for frequent queries
productSchema.index({ categoryId: 1 });
productSchema.index({ brandId: 1 });
productSchema.index({ status: 1 });

export default model<IProduct>("Product", productSchema);