import { Request, Response } from "express";
import User from "./user.model";

export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.userId).select("-password");
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      error: { code: "USER_NOT_FOUND" },
    });
  }
  return res.json({
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
};

export const updateMe = async (req: Request, res: Response) => {
  const { firstName, lastName } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?.userId,
    { firstName, lastName },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      error: { code: "USER_NOT_FOUND" },
    });
  }

  return res.json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
};

export const updatePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user?.userId).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      error: { code: "USER_NOT_FOUND" },
    });
  }

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect",
      error: { code: "INCURRENT_PASSWORD" },
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  return res.json({
    success: true,
    message: "Password updated successfully",
  });
};

export const getAdminUsers = async (req: Request, res: Response) => {
  if (req.user?.role !== "ADMIN" && req.user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Forbidden - admin access required",
      error: { code: "FORBIDDEN" },
    });
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string;
  const role = req.query.role as string;
  const status = req.query.status as string;

  const query: any = { role: { $in: ["ADMIN", "SUPER_ADMIN", "MANAGER", "STAFF"] } };

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (role) query.role = role;
  if (status) query.status = status;

  const [items, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(query),
  ]);

  return res.json({
    success: true,
    message: "Admin users retrieved",
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
};

export const createAdminUser = async (req: Request, res: Response) => {
  if (req.user?.role !== "ADMIN" && req.user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Forbidden - admin access required",
      error: { code: "FORBIDDEN" },
    });
  }

  const { firstName, lastName, email, phone, role, status, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
      error: { code: "EMAIL_EXISTS" },
    });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    role,
    status: status || "ACTIVE",
    password,
  });

  return res.status(201).json({
    success: true,
    message: "Admin user created",
    data: user.toObject({ getters: true }),
  });
};

export const getAdminUserById = async (req: Request, res: Response) => {
  if (req.user?.role !== "ADMIN" && req.user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Forbidden - admin access required",
      error: { code: "FORBIDDEN" },
    });
  }

  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Admin user not found",
      error: { code: "USER_NOT_FOUND" },
    });
  }

  return res.json({
    success: true,
    message: "Admin user retrieved",
    data: user,
  });
};

export const updateAdminUser = async (req: Request, res: Response) => {
  if (req.user?.role !== "ADMIN" && req.user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Forbidden - admin access required",
      error: { code: "FORBIDDEN" },
    });
  }

  const { firstName, lastName, email, phone, role, status } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { firstName, lastName, email, phone, role, status },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Admin user not found",
      error: { code: "USER_NOT_FOUND" },
    });
  }

  return res.json({
    success: true,
    message: "Admin user updated",
    data: user,
  });
};

export const deleteAdminUser = async (req: Request, res: Response) => {
  if (req.user?.role !== "ADMIN" && req.user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Forbidden - admin access required",
      error: { code: "FORBIDDEN" },
    });
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Admin user not found",
      error: { code: "USER_NOT_FOUND" },
    });
  }

  return res.json({
    success: true,
    message: "Admin user deleted",
  });
};