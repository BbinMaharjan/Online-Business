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