import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number; // Price at time of adding to cart (backend calculated)
  subtotal: number; // price * quantity
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
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
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be greater than or equal to 0"],
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      default: 0,
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
    shipping: {
      type: Number,
      default: 0,
      min: [0, "Shipping must be greater than or equal to 0"],
    },
    total: {
      type: Number,
      default: 0,
      min: [0, "Total must be greater than or equal to 0"],
    },
    couponCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Method to calculate cart totals
cartSchema.methods.calculateTotals = function () {
  let subtotal = 0;

  this.items.forEach((item) => {
    subtotal += item.subtotal;
  });

  // Calculate discount (would need coupon validation)
  const discount = this.discount;
  
  // Calculate tax (based on subtotal and tax rate)
  const tax = subtotal * 0.1; // 10% tax as example
  
  // Shipping (would be based on shipping method and address)
  const shipping = this.shipping;

  this.subtotal = subtotal;
  this.discount = discount;
  this.tax = tax;
  this.total = subtotal - discount + tax + shipping;
};

export default mongoose.model<ICart>("Cart", cartSchema);