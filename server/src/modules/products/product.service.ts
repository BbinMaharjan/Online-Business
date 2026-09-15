import { Request, Response } from "express";
import Product from "./product.model";
import { ROLES } from "../../constants/roles";
import slugify from "slugify";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      availability,
      attributes,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    // Build filter object
    const filter: any = {};

    // Keyword search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filtering
    if (category) {
      filter.categoryId = category;
    }

    // Brand filtering
    if (brand) {
      filter.brandId = brand;
    }

    // Price filtering
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Rating filtering
    if (rating) {
      filter.rating = Number(rating);
    }

    // Availability filtering
    if (availability === "in-stock") {
      filter["variants.stock"] = { $gt: 0 };
    }

    // Attributes filtering
    if (attributes) {
      // TODO: Implement attribute filtering
    }

    // Sorting
    let sortOptions: any = {};
    if (sort) {
      const [field, order] = sort.split("_");
      sortOptions[field] = order === "asc" ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Math.min(Number(limit), 100); // Max limit 100
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate("categoryId", "name slug")
      .populate("brandId", "name slug");

    const total = await Product.countDocuments(filter);

    return res.json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
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

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoryId", "name slug")
      .populate("brandId", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        error: { code: "PRODUCT_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("categoryId", "name slug")
      .populate("brandId", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        error: { code: "PRODUCT_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      compareAtPrice,
      tax,
      categoryId,
      brandId,
      images,
      tags,
      status,
      featured,
      seo,
      variants,
    } = req.body;

    // Generate slug from name
    const slug = slugify(name, { lower: true, strict: true });

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product with this name already exists",
        error: { code: "SLUG_EXISTS" },
      });
    }

    const product = new Product({
      name,
      slug,
      description,
      price,
      compareAtPrice,
      tax,
      categoryId,
      brandId,
      images: images || [],
      tags: tags || [],
      status: status || "ACTIVE",
      featured: featured || false,
      seo: seo || {
        title: "",
        description: "",
        keywords: [],
      },
      variants: variants || [],
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      compareAtPrice,
      tax,
      categoryId,
      brandId,
      images,
      tags,
      status,
      featured,
      seo,
      variants,
    } = req.body;

    const updateData: any = {
      name,
      description,
      price,
      compareAtPrice,
      tax,
      categoryId,
      brandId,
      images: images || [],
      tags: tags || [],
      status: status || "ACTIVE",
      featured: featured ?? false,
      seo: seo || {
        title: "",
        description: "",
        keywords: [],
      },
    };

    // Update slug if name changes
    if (name) {
      updateData.slug = slugify(name, { lower: true, strict: true });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        error: { code: "PRODUCT_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        error: { code: "PRODUCT_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};