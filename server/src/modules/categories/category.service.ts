import { Request, Response } from "express";
import Category from "./category.model";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { parentId } = req.query;

    let filter: any = {};

    // Filter by parentId for hierarchical structure
    if (parentId) {
      filter.parentId = parentId;
    } else {
      // Get only top-level categories (no parent)
      filter.parentId = null;
    }

    const categories = await Category.find(filter).sort({ sortOrder: 1 });

    return res.json({
      success: true,
      message: "Categories retrieved successfully",
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

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        error: { code: "CATEGORY_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        error: { code: "CATEGORY_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, parentId, image, sortOrder, seo } = req.body;

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category with this name already exists",
        error: { code: "SLUG_EXISTS" },
      });
    }

    const category = new Category({
      name,
      slug,
      description,
      parentId,
      image: image || "",
      sortOrder: sortOrder || 0,
      seo: seo || {
        title: "",
        description: "",
        keywords: [],
      },
    });

    await category.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, parentId, image, sortOrder, seo } = req.body;

    const updateData: any = {
      name,
      description,
      parentId,
      image: image !== undefined ? image : undefined,
      sortOrder: sortOrder !== undefined ? sortOrder : undefined,
      seo: seo || {
        title: "",
        description: "",
        keywords: [],
      },
    };

    // Update slug if name changes
    if (name) {
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        error: { code: "CATEGORY_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        error: { code: "CATEGORY_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};