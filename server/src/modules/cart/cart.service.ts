import { Request, Response } from "express";
import Cart from "./cart.model";
import Product from "../products/product.model";
import Inventory from "../inventory/inventory.model";

export const getCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate("items.productId", "name price slug images");

    if (!cart) {
      // Return empty cart if not found
      return res.json({
        success: true,
        message: "Cart not found, returning empty cart",
        data: {
          userId,
          items: [],
          subtotal: 0,
          discount: 0,
          tax: 0,
          shipping: 0,
          total: 0,
        },
      });
    }

    cart.calculateTotals();
    await cart.save();

    return res.json({
      success: true,
      message: "Cart retrieved successfully",
      data: cart,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { productId, variantId, quantity } = req.body;

    // Validate product exists and get price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        error: { code: "PRODUCT_NOT_FOUND" },
      });
    }

    // Check inventory availability
    let inventoryFilter: any = { productId };
    if (variantId) {
      inventoryFilter.variantId = variantId;
    }

    const inventory = await Inventory.findOne(inventoryFilter);
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found for this product",
        error: { code: "INVENTORY_NOT_FOUND" },
      });
    }

    const availableStock = inventory.getAvailableStock();
    if (availableStock < quantity) {
      return res.status(409).json({
        success: false,
        message: "Insufficient stock available",
        error: { code: "INSUFFICIENT_STOCK" },
        data: { availableStock, requested: quantity },
      });
    }

    // Check if item already in cart
    const cart = await Cart.findOne({ userId });
    const existingItemIndex = cart?.items.findIndex(
      (item) => item.productId === productId && item.variantId === variantId
    );

    if (cart && existingItemIndex >= 0) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      const newItem: any = {
        productId,
        variantId,
        quantity,
        price: product.price, // Backend-calculated price
        subtotal: product.price * quantity,
      };
      if (cart) {
        cart.items.push(newItem);
      } else {
        // Create new cart
        const newCart = new Cart({
          userId,
          items: [newItem],
        });
        await newCart.save();
        return res.status(201).json({
          success: true,
          message: "Product added to cart successfully",
          data: newCart,
        });
      }
    }

    await cart?.calculateTotals();
    await cart?.save();

    return res.json({
      success: true,
      message: "Product added to cart successfully",
      data: cart,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { itemId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
        error: { code: "CART_NOT_FOUND" },
      });
    }

    const item = cart.items.find((item) => item._id?.toString() === itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
        error: { code: "CART_ITEM_NOT_FOUND" },
      });
    }

    // Update quantity
    item.quantity = quantity;
    item.subtotal = item.price * quantity;

    await cart.calculateTotals();
    await cart.save();

    return res.json({
      success: true,
      message: "Cart item updated successfully",
      data: cart,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { itemId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
        error: { code: "CART_NOT_FOUND" },
      });
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      (item) => item._id?.toString() !== itemId
    );

    await cart.calculateTotals();
    await cart.save();

    return res.json({
      success: true,
      message: "Product removed from cart successfully",
      data: cart,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items: [], subtotal: 0, discount: 0, tax: 0, shipping: 0, total: 0 },
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};