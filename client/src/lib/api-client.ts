import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiResponse, PaginatedResponse, ProductFilters, Product, Category, Brand, Cart, CartItem, Order, Address, Customer, Review, Payment, ShippingMethod, Coupon, WishlistItem, Notification, SearchSuggestion, PaymentIntent } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const message = error.response?.data?.message || error.message || "An error occurred";
    const code = error.response?.data?.error?.code || "UNKNOWN_ERROR";
    const status = error.response?.status;

    const enhancedError = new Error(message) as Error & {
      status?: number;
      code?: string;
      details?: Record<string, string[]>;
    };
    enhancedError.status = status;
    enhancedError.code = code;
    enhancedError.details = error.response?.data?.error?.details;

    return Promise.reject(enhancedError);
  }
);

export const apiClient = {
  products: {
    list: (params?: ProductFilters) =>
      api.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS.LIST, { params }).then((res) => res.data),

    getById: (id: string) =>
      api.get<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.DETAIL(id)).then((res) => res.data),

    getBySlug: (slug: string) =>
      api.get<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.BY_SLUG(slug)).then((res) => res.data),

    getReviews: (productId: string, params?: { page?: number; limit?: number }) =>
      api.get<PaginatedResponse<Review>>(API_ENDPOINTS.PRODUCTS.REVIEWS(productId), { params }).then((res) => res.data),
  },

  categories: {
    list: (parentId?: string) =>
      api.get<ApiResponse<Category[]>>(API_ENDPOINTS.CATEGORIES.LIST, { params: { parentId } }).then((res) => res.data),

    getById: (id: string) =>
      api.get<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.DETAIL(id)).then((res) => res.data),

    getBySlug: (slug: string) =>
      api.get<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.BY_SLUG(slug)).then((res) => res.data),
  },

  brands: {
    list: () =>
      api.get<ApiResponse<Brand[]>>(API_ENDPOINTS.BRANDS.LIST).then((res) => res.data),

    getById: (id: string) =>
      api.get<ApiResponse<Brand>>(API_ENDPOINTS.BRANDS.DETAIL(id)).then((res) => res.data),

    getBySlug: (slug: string) =>
      api.get<ApiResponse<Brand>>(API_ENDPOINTS.BRANDS.BY_SLUG(slug)).then((res) => res.data),
  },

  search: {
    products: (query: string, params?: ProductFilters) =>
      api.get<PaginatedResponse<Product>>(API_ENDPOINTS.SEARCH.PRODUCTS, { params: { q: query, ...params } }).then((res) => res.data),

    suggestions: (query: string) =>
      api.get<ApiResponse<SearchSuggestion[]>>(API_ENDPOINTS.SEARCH.SUGGESTIONS, { params: { q: query } }).then((res) => res.data),
  },

  cart: {
    get: () =>
      api.get<ApiResponse<Cart>>(API_ENDPOINTS.CART.GET).then((res) => res.data),

    addItem: (productId: string, variantId?: string, quantity?: number) =>
      api.post<ApiResponse<Cart>>(API_ENDPOINTS.CART.ADD_ITEM, { productId, variantId, quantity }).then((res) => res.data),

    updateItem: (itemId: string, quantity: number) =>
      api.patch<ApiResponse<Cart>>(API_ENDPOINTS.CART.UPDATE_ITEM(itemId), { quantity }).then((res) => res.data),

    removeItem: (itemId: string) =>
      api.delete<ApiResponse<Cart>>(API_ENDPOINTS.CART.REMOVE_ITEM(itemId)).then((res) => res.data),

    applyCoupon: (code: string) =>
      api.post<ApiResponse<Cart>>(API_ENDPOINTS.CART.APPLY_COUPON, { code }).then((res) => res.data),

    removeCoupon: () =>
      api.delete<ApiResponse<Cart>>(API_ENDPOINTS.CART.REMOVE_COUPON).then((res) => res.data),
  },

  auth: {
    register: (data: { firstName: string; lastName: string; email: string; password: string }) =>
      api.post<ApiResponse<{ user: Customer; accessToken: string; refreshToken: string }>>(API_ENDPOINTS.AUTH.REGISTER, data).then((res) => res.data),

    login: (data: { email: string; password: string; rememberMe?: boolean }) =>
      api.post<ApiResponse<{ user: Customer; accessToken: string; refreshToken: string }>>(API_ENDPOINTS.AUTH.LOGIN, data).then((res) => res.data),

    logout: () =>
      api.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.LOGOUT).then((res) => res.data),

    forgotPassword: (email: string) =>
      api.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }).then((res) => res.data),

    resetPassword: (token: string, password: string) =>
      api.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password }).then((res) => res.data),

    verifyEmail: (token: string) =>
      api.get<ApiResponse<void>>(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${token}`).then((res) => res.data),

    refreshToken: () =>
      api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(API_ENDPOINTS.AUTH.REFRESH_TOKEN).then((res) => res.data),

    getMe: () =>
      api.get<ApiResponse<Customer>>(API_ENDPOINTS.AUTH.ME).then((res) => res.data),

    updateProfile: (data: Partial<Customer>) =>
      api.patch<ApiResponse<Customer>>(API_ENDPOINTS.AUTH.ME, data).then((res) => res.data),
  },

  addresses: {
    list: () =>
      api.get<ApiResponse<Address[]>>(API_ENDPOINTS.ADDRESSES.LIST).then((res) => res.data),

    create: (data: Omit<Address, "_id">) =>
      api.post<ApiResponse<Address>>(API_ENDPOINTS.ADDRESSES.CREATE, data).then((res) => res.data),

    update: (id: string, data: Partial<Address>) =>
      api.put<ApiResponse<Address>>(API_ENDPOINTS.ADDRESSES.UPDATE(id), data).then((res) => res.data),

    delete: (id: string) =>
      api.delete<ApiResponse<void>>(API_ENDPOINTS.ADDRESSES.DELETE(id)).then((res) => res.data),
  },

  orders: {
    list: (params?: { page?: number; limit?: number; status?: string }) =>
      api.get<PaginatedResponse<Order>>(API_ENDPOINTS.ORDERS.LIST, { params }).then((res) => res.data),

    create: (data: { shippingAddressId: string; billingAddressId?: string; shippingMethodId: string; paymentMethod: string; coupon?: string; notes?: string }) =>
      api.post<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.CREATE, data).then((res) => res.data),

    getById: (id: string) =>
      api.get<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.DETAIL(id)).then((res) => res.data),

    cancel: (id: string) =>
      api.post<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.CANCEL(id)).then((res) => res.data),

    refund: (id: string, reason?: string) =>
      api.post<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.REFUND(id), { reason }).then((res) => res.data),
  },

  payments: {
    create: (orderId: string, provider: string, method: "COD" | "CARD" | "WALLET") =>
      api.post<ApiResponse<PaymentIntent>>(API_ENDPOINTS.PAYMENTS.CREATE, { orderId, provider, method }).then((res) => res.data),

    getStatus: (id: string) =>
      api.get<ApiResponse<Payment>>(API_ENDPOINTS.PAYMENTS.STATUS(id)).then((res) => res.data),
  },

  wishlist: {
    list: () =>
      api.get<ApiResponse<WishlistItem[]>>(API_ENDPOINTS.WISHLIST.LIST).then((res) => res.data),

    add: (productId: string) =>
      api.post<ApiResponse<WishlistItem>>(API_ENDPOINTS.WISHLIST.ADD, { productId }).then((res) => res.data),

    remove: (productId: string) =>
      api.delete<ApiResponse<void>>(API_ENDPOINTS.WISHLIST.REMOVE(productId)).then((res) => res.data),
  },

  reviews: {
    list: (productId: string, params?: { page?: number; limit?: number }) =>
      api.get<PaginatedResponse<Review>>(API_ENDPOINTS.REVIEWS.LIST, { params: { productId, ...params } }).then((res) => res.data),

    create: (productId: string, data: { rating: number; title?: string; comment: string; images?: string[] }) =>
      api.post<ApiResponse<Review>>(API_ENDPOINTS.REVIEWS.CREATE, { productId, ...data }).then((res) => res.data),

    update: (id: string, data: { rating?: number; title?: string; comment?: string; images?: string[] }) =>
      api.put<ApiResponse<Review>>(API_ENDPOINTS.REVIEWS.UPDATE(id), data).then((res) => res.data),

    delete: (id: string) =>
      api.delete<ApiResponse<void>>(API_ENDPOINTS.REVIEWS.DELETE(id)).then((res) => res.data),
  },

  notifications: {
    list: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) =>
      api.get<PaginatedResponse<Notification>>(API_ENDPOINTS.NOTIFICATIONS.LIST, { params }).then((res) => res.data),

    markRead: (id: string) =>
      api.post<ApiResponse<Notification>>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)).then((res) => res.data),

    markAllRead: () =>
      api.post<ApiResponse<void>>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ).then((res) => res.data),
  },
};

export default apiClient;