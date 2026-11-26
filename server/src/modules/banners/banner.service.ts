import { Request, Response } from "express";
import Banner from "./banner.model";

export const createBanner = async (req: Request, res: Response) => {
  try {
    const { title, description, buttonText, buttonLink, image, status, sortOrder } = req.body;

    if (!title || !image) {
      return res.status(400).json({
        success: false,
        message: "Title and image are required",
        error: { code: "MISSING_REQUIRED_FIELDS" },
      });
    }

    // Normalize status so boolean values from the admin UI are accepted
    let normalizedStatus = status;
    if (typeof status === "boolean") {
      normalizedStatus = status ? "ACTIVE" : "INACTIVE";
    } else if (!status) {
      normalizedStatus = "ACTIVE";
    }
    if (!["ACTIVE", "INACTIVE"].includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Status must be ACTIVE or INACTIVE",
        error: { code: "INVALID_STATUS" },
      });
    }

    const banner = new Banner({
      title,
      description,
      buttonText,
      buttonLink,
      image,
      status: normalizedStatus,
      sortOrder: sortOrder || 0,
    });

    await banner.save();

    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner,
    });
  } catch (error: any) {
    console.error("CREATE BANNER ERROR:", error);
    if (error?.name === "ValidationError" || error?.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
        error: { code: "VALIDATION_ERROR" },
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: {
        code: "INTERNAL_ERROR",
        ...(process.env.NODE_ENV === "development" && { details: error?.message }),
      },
    });
  }
};

export const getBanners = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const sortBy = (req.query.sortBy as string) || "sortOrder";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "asc";

    const filter: any = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (status) {
      filter.status = status;
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const [banners, total] = await Promise.all([
      Banner.find(filter).sort(sort).skip(skip).limit(limit),
      Banner.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      message: "Banners retrieved successfully",
      items: banners,
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
      error: {
        code: "INTERNAL_ERROR",
        ...(process.env.NODE_ENV === "development" && { details: error?.message }),
      },
    });
  }
};

export const getPublicBanners = async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find({ status: "ACTIVE" })
      .sort({ sortOrder: 1, createdAt: -1 })
      .select("title description buttonText buttonLink image")
      .lean();

    return res.json({
      success: true,
      message: "Banners retrieved successfully",
      data: banners,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: {
        code: "INTERNAL_ERROR",
        ...(process.env.NODE_ENV === "development" && { details: error?.message }),
      },
    });
  }
};

export const getBannerById = async (req: Request, res: Response) => {
  try {
    const { bannerId } = req.params;

    const banner = await Banner.findById(bannerId);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
        error: { code: "BANNER_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Banner retrieved successfully",
      data: banner,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: {
        code: "INTERNAL_ERROR",
        ...(process.env.NODE_ENV === "development" && { details: error?.message }),
      },
    });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { bannerId } = req.params;
    const { title, description, buttonText, buttonLink, image, status, sortOrder } = req.body;

    // Normalize status so boolean values from the admin UI are accepted
    let normalizedStatus = status;
    if (status !== undefined) {
      if (typeof status === "boolean") {
        normalizedStatus = status ? "ACTIVE" : "INACTIVE";
      }
      if (normalizedStatus !== undefined && !["ACTIVE", "INACTIVE"].includes(normalizedStatus)) {
        return res.status(400).json({
          success: false,
          message: "Status must be ACTIVE or INACTIVE",
          error: { code: "INVALID_STATUS" },
        });
      }
    }

    const banner = await Banner.findByIdAndUpdate(
      bannerId,
      { title, description, buttonText, buttonLink, image, status: normalizedStatus, sortOrder },
      { new: true, runValidators: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
        error: { code: "BANNER_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (error: any) {
    console.error("UPDATE BANNER ERROR:", error);
    if (error?.name === "ValidationError" || error?.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
        error: { code: "VALIDATION_ERROR" },
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: {
        code: "INTERNAL_ERROR",
        ...(process.env.NODE_ENV === "development" && { details: error?.message }),
      },
    });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { bannerId } = req.params;

    const banner = await Banner.findByIdAndDelete(bannerId);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
        error: { code: "BANNER_NOT_FOUND" },
      });
    }

    return res.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: {
        code: "INTERNAL_ERROR",
        ...(process.env.NODE_ENV === "development" && { details: error?.message }),
      },
    });
  }
};