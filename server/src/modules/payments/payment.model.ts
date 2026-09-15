import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  orderId: string;
  userId: string;
  provider: "STRIPE" | "PAYPAL" | "LOCAL" | "CASH_ON_DELIVERY";
  transactionId?: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  paidAt?: Date;
  metadata?: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: String,
      required: [true, "Order ID is required"],
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
    },
    provider: {
      type: String,
      enum: ["STRIPE", "PAYPAL", "LOCAL", "CASH_ON_DELIVERY"],
      required: true,
    },
    transactionId: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be greater than or equal to 0"],
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
    },
    status: {
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
    paidAt: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for order and user lookup
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });

export default mongoose.model<IPayment>("Payment", paymentSchema);