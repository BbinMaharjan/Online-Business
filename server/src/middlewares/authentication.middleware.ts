import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, verifyRefreshToken } from "../config/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check for token in cookie (fallback)
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
        error: { code: "NO_TOKEN" },
      });
    }

    // Verify access token
    let payload: any;
    try {
      payload = verifyAccessToken(token);
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Access token expired",
          error: { code: "TOKEN_EXPIRED" },
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        error: { code: "INVALID_TOKEN" },
      });
    }

    // Attach user to request
    req.user = payload;
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      error: { code: "INVALID_TOKEN" },
    });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const payload = verifyAccessToken(token);
      req.user = payload;
    }
    next();
  } catch {
    req.user = undefined;
    next();
  }
};