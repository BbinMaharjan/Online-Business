import { Request, Response } from "express";
import Inventory from "./inventory.model";

export const getInventory = async (req: Request, res: Response) => {
  try {
    const { productId, variantId, search, lowStock, page = 1, limit = 20 } = req.query;

    let filter: any = {};

    if (productId) {
      filter.productId = productId;
    }

    if (variantId) {
      filter.variantId = variantId;
    }

    if (search) {
      filter.$or = [
        { "product.name": { $regex: search, $options: "i" } },
        { "product.sku": { $regex: search, $options: "i" } },
      ];
    }

    if (lowStock === "true") {
      filter.$expr = { $lt: ["$quantity", "$lowStockThreshold"] };
    }

    const pageNum = Number(page);
    const limitNum = Math.min(Number(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    const [inventory, total] = await Promise.all([
      Inventory.find(filter)
        .populate("productId", "name sku")
        .populate("variantId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Inventory.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      message: "Inventory retrieved successfully",
      data: inventory,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
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

export const getInventoryByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const inventory = await Inventory.findOne({ productId });

    if (!inventory) {
      // Return default inventory if not found
      return res.json({
        success: true,
        message: "Inventory not found, returning default",
        data: {
          productId,
          quantity: 0,
          reservedQuantity: 0,
          lowStockThreshold: 10,
          availableStock: 0,
        },
      });
    }

    const availableStock = inventory.getAvailableStock();

    return res.json({
      success: true,
      message: "Inventory retrieved successfully",
      data: {
        ...inventory.toObject(),
        availableStock,
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

export const reserveStock = async (req: Request, res: Response) => {
  try {
    const { productId, variantId, quantity } = req.body;

    let filter: any = { productId };

    if (variantId) {
      filter.variantId = variantId;
    }

    const inventory = await Inventory.findOne(filter);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found",
        error: { code: "INVENTORY_NOT_FOUND" },
      });
    }

    // Check if enough stock is available
    const availableStock = inventory.getAvailableStock();
    if (availableStock < quantity) {
      return res.status(409).json({
        success: false,
        message: "Insufficient stock available",
        error: { code: "INSUFFICIENT_STOCK" },
        data: {
          availableStock,
          requested: quantity,
        },
      });
    }

    // Reserve the stock
    inventory.reservedQuantity += quantity;
    await inventory.save();

    const newAvailableStock = inventory.getAvailableStock();

    return res.json({
      success: true,
      message: "Stock reserved successfully",
      data: {
        quantityReserved: quantity,
        availableStock: newAvailableStock,
        totalQuantity: inventory.quantity,
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

export const releaseStock = async (req: Request, res: Response) => {
  try {
    const { productId, variantId, quantity } = req.body;

    let filter: any = { productId };

    if (variantId) {
      filter.variantId = variantId;
    }

    const inventory = await Inventory.findOne(filter);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found",
        error: { code: "INVENTORY_NOT_FOUND" },
      });
    }

    // Release the stock (but don't go below 0)
    inventory.reservedQuantity = Math.max(0, inventory.reservedQuantity - quantity);
    await inventory.save();

    const availableStock = inventory.getAvailableStock();

    return res.json({
      success: true,
      message: "Stock released successfully",
      data: {
        quantityReleased: quantity,
        availableStock,
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

export const adjustStock = async (req: Request, res: Response) => {
  try {
    const { productId, variantId, quantity, type } = req.body;

    let filter: any = { productId };

    if (variantId) {
      filter.variantId = variantId;
    }

    const inventory = await Inventory.findOne(filter);

    if (!inventory) {
      // Create new inventory record if not exists
      const newInventory = new Inventory({
        productId,
        variantId,
        quantity: type === "add" ? quantity : quantity,
        reservedQuantity: 0,
        lowStockThreshold: 10,
      });
      await newInventory.save();
      return res.json({
        success: true,
        message: "Inventory created successfully",
        data: newInventory,
      });
    }

    // Adjust stock based on type
    if (type === "add") {
      inventory.quantity += quantity;
    } else if (type === "subtract") {
      inventory.quantity = Math.max(0, inventory.quantity - quantity);
    } else if (type === "set") {
      inventory.quantity = quantity;
    }

    await inventory.save();

    const availableStock = inventory.getAvailableStock();

    return res.json({
      success: true,
      message: "Stock adjusted successfully",
      data: {
        quantityAdjusted: quantity,
        availableStock,
        totalQuantity: inventory.quantity,
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