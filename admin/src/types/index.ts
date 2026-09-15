export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: unknown;
  };
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  brandId: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  tax: number;
  variants: Variant[];
  attributes: Record<string, string>[];
  tags: string[];
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  featured: boolean;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Variant {
  _id?: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  images?: string[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  status: "ACTIVE" | "INACTIVE";
  sortOrder: number;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  status: "ACTIVE" | "INACTIVE";
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  _id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
  product?: Product;
  variant?: Variant;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  coupon?: string;
  paymentStatus: "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  orderStatus: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  productName: string;
  sku: string;
  variant?: string;
  price: number;
  quantity: number;
  subtotal: number;
  tax: number;
  discount: number;
}

export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  type: "SHIPPING" | "BILLING";
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING";
  avatar?: string;
  emailVerified?: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  minimumOrder?: number;
  maximumDiscount?: number;
  usageLimit: number;
  usagePerCustomer: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  user?: User;
  rating: number;
  title?: string;
  comment?: string;
  verifiedPurchase: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  transactionId: string;
  orderId: string;
  userId: string;
  provider: string;
  amount: number;
  paymentMethod: string;
  status: "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingMethod {
  _id: string;
  name: string;
  description?: string;
  price: number;
  estimatedDelivery: string;
  zones: string[];
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  _id: string;
  url: string;
  referenceId: string;
  referenceType: "PRODUCT" | "CATEGORY" | "BRAND" | "USER" | "BLOG";
  mimeType: string;
  size: number;
  alt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  completedOrders: number;
  lowStockProducts: number;
}

export interface SalesReport {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface ProductReport {
  productId: string;
  productName: string;
  sku: string;
  quantitySold: number;
  revenue: number;
}

export interface CategoryReport {
  categoryId: string;
  categoryName: string;
  revenue: number;
  orders: number;
}

export interface CustomerReport {
  customerId: string;
  customerName: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
}

export interface LowStockProduct {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  threshold: number;
}

export interface RecentOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  referenceId?: string;
  referenceType?: string;
  createdAt: string;
}

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "SUPER_ADMIN" | "MANAGER" | "STAFF";
  status: "ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING";
  avatar?: string;
  permissions: string[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  key: string;
  name: string;
  description?: string;
  category: string;
}

export interface AuditLog {
  _id: string;
  adminId: string;
  admin?: AdminUser;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface Settings {
  siteName: string;
  siteDescription: string;
  currency: string;
  timezone: string;
  language: string;
  taxEnabled: boolean;
  taxRate: number;
  shippingEnabled: boolean;
  freeShippingThreshold?: number;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
}

export interface AdminFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface BrandFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CouponFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface InventoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  productId?: string;
  lowStock?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
  paymentStatus?: string;
  orderStatus?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  provider?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  period?: "today" | "yesterday" | "7d" | "30d" | "this_month" | "last_month" | "custom";
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
  productId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  adminId?: string;
  action?: string;
  resource?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface StockAdjustment {
  productId: string;
  variantId?: string;
  adjustmentType: "ADD" | "REMOVE" | "SET";
  quantity: number;
  reason: "RESTOCK" | "DAMAGED" | "LOST" | "MANUAL_ADJUSTMENT" | "RETURN" | "CORRECTION";
}