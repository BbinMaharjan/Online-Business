import mongoose, { Document, Schema } from "mongoose";

export interface IWishlist extends Document {
  userId: string;
  productId: string;
  createdAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
    },
    productId: {
      type: String,
      required: [true, "Product ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IWishlist>("Wishlist", wishlistSchema);