export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  tax: number;
  brandId: string;
  categoryId: string;
  images: string[];
  tags: string[];
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
  featured: boolean;
  rating: number;
  reviewCount: number;
  variants: Variant[];
  brand?: Brand;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Variant {
  _id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  image?: string;
  attributes: Record<string, string>;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
  children?: Category[];
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface CartItem {
  _id: string;
  productId: string;
  variantId?: string;
  productName: string;
  sku: string;
  variant?: string;
  price: number;
  quantity: number;
  subtotal: number;
  product?: Product;
  variantData?: Variant;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  coupon?: string;
  couponDiscount?: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  coupon?: string;
  paymentStatus: "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "REFUNDED";
  orderStatus: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  shippingMethod?: ShippingMethod;
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
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  type: "SHIPPING" | "BILLING";
  isDefault?: boolean;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  image?: string;
  addresses: Address[];
  orderHistory: string[];
  createdAt: string;
  updatedAt: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  userName: string;
  userImage?: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  orderId: string;
  userId: string;
  provider: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  transactionId?: string;
  paidAt?: string;
  method?: "COD" | "CARD" | "WALLET";
}

export interface SearchSuggestion {
  label: string;
  value: string;
  type: "product" | "category" | "brand";
  image?: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    pagination?: PaginationInfo;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    pagination: PaginationInfo;
  };
}

export interface ShippingMethod {
  _id: string;
  name: string;
  description?: string;
  price: number;
  estimatedDays: number;
  isActive: boolean;
}

export interface Coupon {
  _id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface WishlistItem {
  _id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: "ORDER_CONFIRMED" | "ORDER_SHIPPED" | "ORDER_DELIVERED" | "ORDER_CANCELLED" | "PAYMENT_RECEIVED" | "PROMOTIONAL" | "REVIEW_REQUEST";
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface SEOData {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "product";
  twitterCard?: "summary" | "summary_large_image";
  structuredData?: Record<string, unknown>;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "rating" | "best-selling";
  page?: number;
  limit?: number;
  search?: string;
}

export interface ProductSortOption {
  value: ProductFilters["sort"];
  label: string;
}

export const PRODUCT_SORT_OPTIONS: ProductSortOption[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Best Rated" },
  { value: "best-selling", label: "Best Selling" },
];

export interface CartMutationResult {
  cart: Cart;
  message: string;
}

export interface CheckoutSession {
  id: string;
  userId: string;
  step: number;
  data: Record<string, unknown>;
  expiresAt: string;
}

export interface PaymentIntent {
  clientSecret?: string;
  redirectUrl?: string;
  paymentId: string;
}

export type OrderStatus = Order["orderStatus"];
export type PaymentStatus = Order["paymentStatus"];

export const ORDER_STATUSES: { value: OrderStatus; label: string; color: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info" }[] = [
  { value: "PENDING", label: "Pending", color: "warning" },
  { value: "CONFIRMED", label: "Confirmed", color: "info" },
  { value: "PROCESSING", label: "Processing", color: "primary" },
  { value: "SHIPPED", label: "Shipped", color: "secondary" },
  { value: "DELIVERED", label: "Delivered", color: "success" },
  { value: "CANCELLED", label: "Cancelled", color: "error" },
  { value: "REFUNDED", label: "Refunded", color: "default" },
];

export const PAYMENT_STATUSES: { value: PaymentStatus; label: string; color: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info" }[] = [
  { value: "PENDING", label: "Pending", color: "warning" },
  { value: "PROCESSING", label: "Processing", color: "info" },
  { value: "PAID", label: "Paid", color: "success" },
  { value: "FAILED", label: "Failed", color: "error" },
  { value: "REFUNDED", label: "Refunded", color: "default" },
];