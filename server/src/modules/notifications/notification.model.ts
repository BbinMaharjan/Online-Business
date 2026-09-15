import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: string;
  type: "ACCOUNT_CREATED" | "EMAIL_VERIFIED" | "PASSWORD_CHANGED" | "ORDER_CREATED" | "PAYMENT_SUCCESSFUL" | "PAYMENT_FAILED" | "ORDER_SHIPPED" | "ORDER_DELIVERED" | "ORDER_CANCELLED" | "REFUND_PROCESSED" | string;
  title: string;
  message: string;
  data?: {
    [key: string]: any;
  };
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
    },
    type: {
      type: String,
      enum: [
        "ACCOUNT_CREATED",
        "EMAIL_VERIFIED",
        "PASSWORD_CHANGED",
        "ORDER_CREATED",
        "PAYMENT_SUCCESSFUL",
        "PAYMENT_FAILED",
        "ORDER_SHIPPED",
        "ORDER_DELIVERED",
        "ORDER_CANCELLED",
        "REFUND_PROCESSED",
      ],
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for user lookup
notificationSchema.index({ userId: 1 });
notificationSchema.index({ read: 1 });

export default mongoose.model<INotification>("Notification", notificationSchema);