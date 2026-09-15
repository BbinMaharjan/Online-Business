import mongoose, { Document, Schema, model } from "mongoose";

export interface IShippingMethod extends Document {
  name: string;
  description?: string;
  price: number;
  estimatedDays: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "FAILED" | "RETURNED";
  zones?: {
    name: string;
    code?: string;
    additionalPrice?: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const shippingMethodSchema = new Schema<IShippingMethod>(
  {
    name: {
      type: String,
      required: [true, "Shipping method name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Shipping price is required"],
      min: [0, "Shipping price must be greater than or equal to 0"],
    },
    estimatedDays: {
      type: Number,
      required: [true, "Estimated delivery days is required"],
      min: [1, "Estimated days must be at least 1"],
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "PROCESSING",
        "SHIPPED",
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "FAILED",
        "RETURNED",
      ],
      default: "PENDING",
    },
    zones: [
      {
        name: {
          type: String,
          trim: true,
        },
        code: {
          type: String,
          trim: true,
        },
        additionalPrice: {
          type: Number,
          min: [0, "Additional price must be greater than or equal to 0"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for status lookup
shippingMethodSchema.index({ status: 1 });

export default model<IShippingMethod>("ShippingMethod", shippingMethodSchema);