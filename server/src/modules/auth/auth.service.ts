import { Request, Response } from "express";
import User from "../users/user.model";
import { JwtPayloadInterface, verifyAccessToken, verifyRefreshToken } from "../../config/jwt";
import { ROLES } from "../../constants/roles";

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
        error: { code: "EMAIL_EXISTS" },
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: ROLES.CUSTOMER,
      status: "PENDING",
    });

    await user.save();

    // Generate auth tokens
    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to user's refreshTokens array (initialize if undefined)
    if (!user.refreshTokens) {
      user.refreshTokens = [];
    }
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Set tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password +refreshTokens");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        error: { code: "INVALID_CREDENTIALS" },
      });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        error: { code: "INVALID_CREDENTIALS" },
      });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate auth tokens
    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to user's refreshTokens array (initialize if undefined)
    if (!user.refreshTokens) {
      user.refreshTokens = [];
    }
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Set tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.json({
      success: true,
      message: "Logged in successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR", details: error.message },
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Invalidate refresh token - find and remove it from user's tokens
    if (req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { refreshTokens: req.body.refreshToken },
      });
    }

    // Clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    // Get refresh token from body or cookies
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
        error: { code: "REFRESH_TOKEN_REQUIRED" },
      });
    }

    // Verify refresh token
    let payload: JwtPayloadInterface;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
        error: { code: "INVALID_REFRESH_TOKEN" },
      });
    }

    // Check if token belongs to user
    const user = await User.findById(payload.userId).select("+refreshTokens");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        error: { code: "USER_NOT_FOUND" },
      });
    }

    // Check if refresh token is still valid
    if (!user.refreshTokens?.includes(refreshToken)) {
      return res.status(403).json({
        success: false,
        message: "Refresh token is invalid or revoked",
        error: { code: "INVALID_REFRESH_TOKEN" },
      });
    }

    // Initialize refreshTokens array if undefined
    if (!user.refreshTokens) {
      user.refreshTokens = [];
    }

    // Rotate refresh token - remove old, add new
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    const newRefreshToken = user.generateRefreshToken();
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    // Generate new access token
    const accessToken = user.generateAuthToken();

    // Set tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.json({
      success: true,
      message: "Token refreshed successfully",
      data: { accessToken, refreshToken: newRefreshToken },
    });
  } catch (error: any) {
    console.error("REFRESH TOKEN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR", details: error.message },
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent",
      });
    }

    // Generate reset token
    user.passwordResetToken = "some_token";
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // TODO: Send email with reset token
    // await sendEmail({
    //   email: user.email,
    //   subject: "Password reset token",
    //   message: `Your password reset token: ${user.passwordResetToken}`,
    // });

    return res.json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
        error: { code: "MISSING_REQUIRED_FIELDS" },
      });
    }

    // Verify reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
        error: { code: "INVALID_RESET_TOKEN" },
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Generate new tokens
    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Set tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.json({
      success: true,
      message: "Password reset successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
};