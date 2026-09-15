import mongoose, { Document, Schema } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscount?: number;
  usageLimit?: number; // Total usage limit across all users
  usagePerUser?: number; // Usage limit per user
  startDate: Date;
  endDate: Date;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  usedBy?: [userId: string]; // Track users who have used this coupon
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FIXED_AMOUNT"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: [0, "Discount value must be greater than or equal to 0"],
    },
    minimumOrderAmount: {
      type: Number,
      required: true,
      min: [0, "Minimum order amount must be greater than or equal to 0"],
    },
    maximumDiscount: {
      type: Number,
      min: [0, "Maximum discount must be greater than or equal to 0"],
    },
    usageLimit: {
      type: Number,
      min: [1, "Usage limit must be greater than 0"],
    },
    usagePerUser: {
      type: Number,
      min: [1, "Usage per user must be greater than 0"],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "EXPIRED"],
      default: "ACTIVE",
    },
    usedBy: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for coupon code lookup
couponSchema.index({ startDate: 1 });
couponSchema.index({ endDate: 1 });
couponSchema.index({ status: 1 });

// Method to validate coupon
couponSchema.methods.validateCoupon = async function (
  orderAmount: number,
  userId: string
): Promise<{ valid: boolean; message: string; discount: number }> {
  // Check if coupon is active
  if (this.status !== "ACTIVE") {
    return {
      valid: false,
      message: "Coupon is not active",
      discount: 0,
    };
  }

  // Check if coupon is within validity period
  const now = new Date();
  if (now < this.startDate) {
    return {
      valid: false,
      message: "Coupon has not started yet",
      discount: 0,
    };
  }
  if (now > this.endDate) {
    return {
      valid: false,
      message: "Coupon has expired",
      discount: 0,
    };
  }

  // Check minimum order amount
  if (orderAmount < this.minimumOrderAmount) {
    return {
      valid: false,
      message: `Order amount must be at least ${
        this.minimumOrderAmount
      } to use this coupon`,
      discount: 0,
    };
  }

  // Check usage limit (total)
  if (this.usageLimit && this.usedBy.length >= this.usageLimit) {
    return {
      valid: false,
      message: "Coupon usage limit reached",
      discount: 0,
    };
  }

  // Check usage per user
  if (this.usagePerUser && this.usedBy.includes(userId)) {
    return {
      valid: false,
      message: "You have already used this coupon",
      discount: 0,
    };
  }

  // Calculate discount
  let discount = 0;
  if (this.discountType === "PERCENTAGE") {
    discount = (orderAmount * this.discountValue) / 100;
    // Apply maximum discount if set
    if (this.maximumDiscount && discount > this.maximumDiscount) {
      discount = this.maximumDiscount;
    }
  } else if (this.discountType === "FIXED_AMOUNT") {
    discount = this.discountValue;
    if (this.maximumDiscount && discount > this.maximumDiscount) {
      discount = this.maximumDiscount;
    }
  }

  return {
    valid: true,
    message: "Coupon is valid",
    discount,
  };
};

export default mongoose.model<ICoupon>("Coupon", couponSchema);