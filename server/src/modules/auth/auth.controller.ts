import { Request, Response } from "express";
import User from "../users/user.model";
import { authenticate } from "../../middlewares/authentication.middleware";
import { register, login, logout, refreshToken, forgotPassword, resetPassword } from "./auth.service";

export const registerCtrl = async (req: Request, res: Response) => {
  await register(req, res);
};

export const loginCtrl = async (req: Request, res: Response) => {
  await login(req, res);
};

export const logoutCtrl = async (req: Request, res: Response) => {
  await logout(req, res);
};

export const refreshTokenCtrl = async (req: Request, res: Response) => {
  await refreshToken(req, res);
};

export const forgotPasswordCtrl = async (req: Request, res: Response) => {
  await forgotPassword(req, res);
};

export const resetPasswordCtrl = async (req: Request, res: Response) => {
  await resetPassword(req, res);
};

export const getMeCtrl = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId).select("-password -refreshTokens");
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
      data: {
        admin: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          permissions: user.permissions || [],
          avatar: user.avatar,
          lastLoginAt: user.lastLoginAt,
          status: user.status,
          phone: user.phone,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
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