import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let error = { ...err };

  // Log error for debugging
  console.error("ERROR:", {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    error = Object.values(err.errors).reduce(
      (acc: any, curr: any) => {
        acc[curr.path] = curr.message;
        return acc;
      },
      {}
    );
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate field value entered";
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid JWT token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "JWT token expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: statusCode >= 500 ? {} : error,
  });
};