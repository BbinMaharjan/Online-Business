import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  orderNumber: string;
  userId: string;
  items: {
    productId: string;
    variantId?: string;
    productName: string;
    sku: string;
    variant?: string;
    price: number;
    quantity: number;
    subtotal: number;
    tax: number;
    discount: number;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    type: "SHIPPING" | "BILLING";
  };
  billingAddress?: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    type: "SHIPPING" | "BILLING";
  };
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  coupon?: string;
  paymentStatus: "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  orderStatus: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  paymentMethod?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: [true, "Order number is required"],
      unique: true,
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
    },
    items: [
      {
        productId: {
          type: String,
          required: true,
        },
        variantId: {
          type: String,
          default: null,
        },
        productName: {
          type: String,
          required: true,
        },
        sku: {
          type: String,
          required: true,
        },
        variant: {
          type: String,
          default: "",
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price must be greater than or equal to 0"],
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        subtotal: {
          type: Number,
          required: true,
          min: [0, "Subtotal must be greater than or equal to 0"],
        },
        tax: {
          type: Number,
          default: 0,
          min: [0, "Tax must be greater than or equal to 0"],
        },
        discount: {
          type: Number,
          default: 0,
          min: [0, "Discount must be greater than or equal to 0"],
        },
      },
    ],
    shippingAddress: {
      type: {
        type: String,
        enum: ["SHIPPING", "BILLING"],
        required: true,
      },
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      addressLine1: {
        type: String,
        required: true,
      },
      addressLine2: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
    billingAddress: {
      type: {
        type: String,
        enum: ["SHIPPING", "BILLING"],
      },
      fullName: {
        type: String,
      },
      phone: {
        type: String,
      },
      addressLine1: {
        type: String,
      },
      addressLine2: {
        type: String,
        default: "",
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      postalCode: {
        type: String,
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal must be greater than or equal to 0"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount must be greater than or equal to 0"],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, "Tax must be greater than or equal to 0"],
    },
    shippingFee: {
      type: Number,
      required: true,
      min: [0, "Shipping fee must be greater than or equal to 0"],
    },
    total: {
      type: Number,
      required: true,
      min: [0, "Total must be greater than or equal to 0"],
    },
    coupon: {
      type: String,
      default: "",
    },
    paymentStatus: {
      type: String,
      enum: [
        "PENDING",
        "PROCESSING",
        "PAID",
        "FAILED",
        "REFUNDED",
        "PARTIALLY_REFUNDED",
      ],
      default: "PENDING",
    },
    orderStatus: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "REFUNDED",
      ],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for user lookup
orderSchema.index({ userId: 1 });

export default mongoose.model<IOrder>("Order", orderSchema);