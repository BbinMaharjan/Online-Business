import { Request, Response, NextFunction } from "express";
import { ROLES } from "../constants/roles";

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no role found",
        error: { code: "UNAUTHORIZED" },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - insufficient role",
        error: { code: "FORBIDDEN" },
      });
    }

    next();
  };
};

export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.permissions) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - no permissions found",
        error: { code: "FORBIDDEN" },
      });
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - insufficient permissions",
        error: { code: "FORBIDDEN" },
      });
    }

    next();
  };
};