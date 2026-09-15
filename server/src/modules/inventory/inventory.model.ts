import mongoose, { Document, Schema } from "mongoose";

export interface IInventory extends Document {
  productId: string;
  variantId?: string;
  quantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    productId: {
      type: String,
      required: [true, "Product ID is required"],
    },
    variantId: {
      type: String,
      default: null,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity must be greater than or equal to 0"],
    },
    reservedQuantity: {
      type: Number,
      default: 0,
      min: [0, "Reserved quantity must be greater than or equal to 0"],
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, "Low stock threshold must be greater than or equal to 0"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for frequent queries
inventorySchema.index({ productId: 1 });
inventorySchema.index({ variantId: 1 });

// Method to calculate available stock
inventorySchema.methods.getAvailableStock = function () {
  return this.quantity - this.reservedQuantity;
};

export default mongoose.model<IInventory>("Inventory", inventorySchema);