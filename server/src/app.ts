import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import productRoutes from "./modules/products/product.routes";
import categoryRoutes from "./modules/categories/category.routes";
import brandRoutes from "./modules/brands/brand.routes";
import cartRoutes from "./modules/cart/cart.routes";
import wishlistRoutes from "./modules/wishlist/wishlist.routes";
import addressRoutes from "./modules/addresses/address.routes";
import couponRoutes from "./modules/coupons/coupon.routes";
import checkoutRoutes from "./modules/checkout/checkout.routes";
import paymentRoutes from "./modules/payments/payment.routes";
import reviewRoutes from "./modules/reviews/review.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import shippingRoutes from "./modules/shipping/shipping.routes";
import notificationRoutes from "./modules/notifications/notification.routes";
import mediaRoutes from "./modules/media/media.routes";
import inventoryRoutes from "./modules/inventory/inventory.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { swaggerDocs } from "./swagger";

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(helmet());
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(mongoSanitize());

const limiter = rateLimit({
  max: process.env.NODE_ENV === "development" ? 1000 : 100,
  windowMs: 60 * 60 * 1000,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after an hour",
  },
});
app.use(limiter);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "OK",
    data: {
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    },
  });
});

swaggerDocs(app);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/orders", checkoutRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/admin", dashboardRoutes);
app.use("/api/v1/shipping", shippingRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/inventory", inventoryRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: { code: "ROUTE_NOT_FOUND" },
  });
});

app.use(errorHandler);

export default app;
