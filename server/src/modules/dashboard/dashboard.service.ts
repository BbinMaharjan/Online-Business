import { Request, Response } from "express";
import Order from "../orders/order.model";
import User from "../users/user.model";
import Product from "../products/product.model";
import Inventory from "../inventory/inventory.model";

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    // Get counts using aggregation
    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      revenue,
    ] = await Promise.all([
      Order.countDocuments({ orderStatus: "DELIVERED" }),
      User.countDocuments({ role: "CUSTOMER", status: "ACTIVE" }),
      Product.countDocuments({ status: "ACTIVE" }),
      Order.countDocuments({ orderStatus: "PENDING" }),
      Order.countDocuments({ orderStatus: "DELIVERED" }),
      Order.countDocuments({ orderStatus: "CANCELLED" }),
    ]);

    // Calculate total revenue from delivered orders
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: "DELIVERED" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Calculate average order value
    const avgOrderValueResult = await Order.aggregate([
      { $match: { orderStatus: "DELIVERED" } },
      { $group: { _id: null, average: { $avg: "$total" } } },
    ]);

    const avgOrderValue =
      avgOrderValueResult.length > 0 ? avgOrderValueResult[0].average : 0;

    return res.json({
      success: true,
      message: "Dashboard summary retrieved successfully",
      data: {
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue,
        averageOrderValue: avgOrderValue,
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

export const getBestSellingProducts = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const bestSelling = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          productName: { $first: { $arrayElemAt: ["$items.productName", 0] } },
          totalQuantitySold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.subtotal" },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ]);

    return res.json({
      success: true,
      message: "Best selling products retrieved successfully",
      data: bestSelling,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const getBestPerformingCategories = async (
  req: Request,
  res: Response,
) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const categories = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalRevenue: { $sum: "$items.subtotal" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
    ]);

    return res.json({
      success: true,
      message: "Best performing categories retrieved successfully",
      data: categories,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const getRecentOrders = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("userId", "firstName lastName")
      .populate("items.productId", "name price");

    return res.json({
      success: true,
      message: "Recent orders retrieved successfully",
      data: orders,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const getLowStockProducts = async (req: Request, res: Response) => {
  try {
    const lowStock = await Inventory.find({
      $expr: { $lt: ["$quantity", "$lowStockThreshold"] },
    }).populate("productId", "name price slug");

    return res.json({
      success: true,
      message: "Low stock products retrieved successfully",
      data: lowStock,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};
