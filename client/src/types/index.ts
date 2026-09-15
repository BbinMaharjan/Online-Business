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
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  addresses: Address[];
  orderHistory: string[];
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
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
}

export interface SearchSuggestion {
  label: string;
  value: string;
  type: "product" | "category" | "brand";
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}