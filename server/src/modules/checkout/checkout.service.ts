import { Request, Response } from "express";
import Cart from "../cart/cart.model";
import Product from "../products/product.model";
import Inventory from "../inventory/inventory.model";
import Coupon from "../coupons/coupon.model";
import Address from "../addresses/address.model";
import { ROLES, ORDER_STATUS } from "../../constants/roles";

export const checkout = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const {
      shippingAddressId,
      billingAddressId,
      couponCode,
    } = req.body;

    // 1. Validate user authentication (middleware should have attached req.user)
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
        error: { code: "AUTHENTICATION_REQUIRED" },
      });
    }

    // 2. Get cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
        error: { code: "CART_EMPTY" },
      });
    }

    // 3. Validate products (availability, status, price)
    const productValidationErrors: Array<{ productId: string; message: string }> = [];

    const validatedItems = cart.items.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product) {
        productValidationErrors.push({
          productId: item.productId,
          message: "Product not found",
        });
        return null;
      }

      // Check product status
      if (product.status !== "ACTIVE") {
        productValidationErrors.push({
          productId: item.productId,
          message: `Product is not available (status: ${product.status})`,
        });
        return null;
      }

      // Check inventory availability
      let inventoryFilter: any = { productId: item.productId };
      if (item.variantId) {
        inventoryFilter.variantId = item.variantId;
      }

      const inventory = await Inventory.findOne(inventoryFilter);
      if (!inventory) {
        productValidationErrors.push({
          productId: item.productId,
          message: "Inventory not found for this product",
        });
        return null;
      }

      const availableStock = inventory.getAvailableStock();
      if (availableStock < item.quantity) {
        productValidationErrors.push({
          productId: item.productId,
          message: `Insufficient stock. Available: ${availableStock}`,
        });
        return null;
      }

      // Use the backend-calculated price (never trust client)
      return {
        product,
        price: product.price, // Backend price
        variant: item.variantId ? await getVariantDetails(item.variantId, product) : undefined,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      };
    });

    const resolvedItems = await Promise.all(validatedItems);

    // Check for validation errors
    if (productValidationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Product validation failed",
        error: { code: "PRODUCT_VALIDATION_FAILED", details: productValidationErrors },
      });
    }

    // 4. Calculate prices server-side
    let subtotal = 0;
    resolvedItems.forEach((item) => {
      if (item) subtotal += item.subtotal;
    });

    // 5. Apply coupon validation
    let discount = 0;
    let coupon: any = null;

    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon) {
        const validationResult = await coupon.validateCoupon(subtotal, userId);
        if (!validationResult.valid) {
          return res.status(400).json({
            success: false,
            message: validationResult.message,
            error: { code: "COUPON_INVALID" },
            data: { discount: 0 },
          });
        }
        discount = validationResult.discount;
      }
    }

    // 6. Calculate tax (backend calculated - 10% as example, would be based on location)
    const taxRate = 0.1; // 10% tax
    const tax = subtotal * taxRate;

    // 7. Calculate shipping
    let shipping = 0;
    if (shippingAddressId) {
      const shippingAddress = await Address.findById(shippingAddressId);
      if (shippingAddress) {
        // Shipping cost would be based on zones and method
        // For now, use a default or based on order total
        shipping = calculateShippingCost(subtotal);
      }
    }

    // 8. Calculate final total
    const total = subtotal - discount + tax + shipping;

    return res.json({
      success: true,
      message: "Checkout validation successful",
      data: {
        subtotal,
        discount,
        tax,
        shipping,
        total,
        coupon: coupon ? {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        } : null,
        items: resolvedItems.filter((item): item is NonNullable<typeof item> => item !== null),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

function getVariantDetails(variantId: string, product: any) {
  // Helper to get variant details from product
  return product.variants?.find((v: any) => v._id?.toString() === variantId);
}

function calculateShippingCost(subtotal: number): number {
  // Simple shipping calculation based on order total
  if (subtotal > 100) return 0; // Free shipping over $100
  if (subtotal > 50) return 5; // $5 shipping
  return 10; // $10 shipping
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const {
      shippingAddressId,
      billingAddressId,
      couponCode,
      paymentMethod,
    } = req.body;

    // Get cart and validate
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
        error: { code: "CART_EMPTY" },
      });
    }

    // Get shipping and billing addresses
    const shippingAddress = shippingAddressId
      ? await Address.findById(shippingAddressId)
      : null;
    const billingAddress = billingAddressId
      ? await Address.findById(billingAddressId)
      : null;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
        error: { code: "SHIPPING_ADDRESS_REQUIRED" },
      });
    }

    // Run checkout validation to calculate prices
    // Note: In a real implementation, this would be a separate validation step
    // Here we reuse the logic inline

    // Get products and validate
    const validatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) return null;

        let inventoryFilter: any = { productId: item.productId };
        if (item.variantId) {
          inventoryFilter.variantId = item.variantId;
        }

        const inventory = await Inventory.findOne(inventoryFilter);
        if (!inventory) return null;

        const availableStock = inventory.getAvailableStock();
        if (availableStock < item.quantity) return null;

        return {
          product,
          price: product.price,
          quantity: item.quantity,
          subtotal: product.price * item.quantity,
        };
      })
    );

    // Filter out null items
    const validItems = validatedItems.filter(
      (item): item is NonNullable<typeof item> => item !== null
    );

    if (validItems.length !== cart.items.length) {
      return res.status(400).json({
        success: false,
        message: "Some products are no longer available",
        error: { code: "PRODUCTS_UNAVAILABLE" },
      });
    }

    // Calculate totals
    let subtotal = 0;
    validItems.forEach((item) => (subtotal += item.subtotal));

    // Apply coupon if provided
    let discount = 0;
    let couponApplied = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon) {
        const validationResult = await coupon.validateCoupon(subtotal, userId);
        if (validationResult.valid) {
          discount = validationResult.discount;
          couponApplied = coupon.code;
        }
      }
    }

    // Calculate tax and shipping
    const tax = subtotal * 0.1; // 10% tax
    const shipping = calculateShippingCost(subtotal);
    const total = subtotal - discount + tax + shipping;

    // Create order with product snapshots
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = new (await import("../../orders/order.model")).default({
      orderNumber,
      userId,
      items: validItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        productName: item.product.name,
        sku: item.product.sku,
        variant: item.variantId ? `Variant ${item.variantId}` : undefined,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
        tax: item.product.tax || 0,
        discount: 0,
      })),
      shippingAddress,
      billingAddress,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      coupon: couponApplied,
      paymentStatus: "PENDING",
      orderStatus: "PENDING",
      paymentMethod,
    });

    await order.save();

    // Reserve inventory for all items
    for (const item of validItems) {
      let inventoryFilter: any = { productId: item.productId };
      if (item.variantId) {
        inventoryFilter.variantId = item.variantId;
      }

      const inventory = await Inventory.findOne(inventoryFilter);
      if (inventory) {
        inventory.reservedQuantity += item.quantity;
        await inventory.save();
      }
    }

    // Clear the cart
    await Cart.findOneAndUpdate({ userId }, { items: [], subtotal: 0, discount: 0, tax: 0, shipping: 0, total: 0 });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order,
        paymentUrl: "", // Would be generated based on payment provider
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};