import mongoose, { Document, Schema } from "mongoose";

export interface ISettings extends Document {
  siteName: string;
  siteDescription: string;
  storeLogo?: string;
  taxEnabled: boolean;
  taxRate: number;
  shippingEnabled: boolean;
  freeShippingThreshold?: number;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    siteName: {
      type: String,
      required: [true, "Site name is required"],
      trim: true,
      maxlength: [100, "Site name cannot exceed 100 characters"],
    },
    siteDescription: {
      type: String,
      trim: true,
      maxlength: [500, "Site description cannot exceed 500 characters"],
    },
    storeLogo: {
      type: String,
      trim: true,
    },
    taxEnabled: {
      type: Boolean,
      default: false,
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    shippingEnabled: {
      type: Boolean,
      default: false,
    },
    freeShippingThreshold: {
      type: Number,
      default: 0,
      min: 0,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    maintenanceMessage: {
      type: String,
      trim: true,
      maxlength: [500, "Maintenance message cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISettings>("Settings", settingsSchema);