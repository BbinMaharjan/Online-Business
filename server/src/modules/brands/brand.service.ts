import { Request, Response } from "express";
import Brand from "./brand.model";

export const getBrands = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

    const query: any = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      Brand.find(query)
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Brand.countDocuments(query),
    ]);

    return res.json({
      success: true,
      message: "Brands retrieved successfully",
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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

export const getBrandById = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
        error: { code: "BRAND_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Brand retrieved successfully",
      data: brand,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const getBrandBySlug = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
        error: { code: "BRAND_NOT_FOUND" },
      });
    }

    // Fetch products for this brand
    const Product = (await import("../products/product.model")).default;
    const products = await Product.find({ brandId: brand._id, status: "ACTIVE" } as any)
      .select("name slug price compareAtPrice images rating stock")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Brand retrieved successfully",
      data: {
        ...brand.toObject(),
        products,
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

export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name, description, logo, seo } = req.body;

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    // Check if slug already exists
    const existingBrand = await Brand.findOne({ slug });
    if (existingBrand) {
      return res.status(409).json({
        success: false,
        message: "Brand with this name already exists",
        error: { code: "SLUG_EXISTS" },
      });
    }

    const brand = new Brand({
      name,
      slug,
      description: description || "",
      logo: logo || "",
      status: "ACTIVE",
      seo: seo || {
        title: "",
        description: "",
        keywords: [],
      },
    });

    await brand.save();

    return res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: brand,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const { name, description, logo, seo } = req.body;

    const updateData: any = {
      name,
      description: description !== undefined ? description : undefined,
      logo: logo !== undefined ? logo : undefined,
    };

    // Update slug if name changes
    if (name) {
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    if (seo) {
      updateData.seo = seo;
    }

    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
        error: { code: "BRAND_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Brand updated successfully",
      data: brand,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
        error: { code: "BRAND_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};