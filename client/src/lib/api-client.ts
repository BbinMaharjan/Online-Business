import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthenticated - could redirect to login
    }
    return Promise.reject(error);
  }
);

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export const apiClient = {
  // Products
  getProducts: (params: any) => api.get("/products", { params }).then((res) => res.data),

  getProductById: (id: string) => api.get(`/products/${id}`).then((res) => res.data),

  getProductBySlug: (slug: string) => api.get(`/products-by-slug/${slug}`).then((res) => res.data),

  // Categories
  getCategories: (parentId?: string) => api.get("/categories", { params: { parentId } }).then((res) => res.data),

  getCategoryBySlug: (slug: string) => api.get(`/categories-by-slug/${slug}`).then((res) => res.data),

  // Brands
  getBrands: () => api.get("/brands").then((res) => res.data),

  getBrandBySlug: (slug: string) => api.get(`/brands-by-slug/${slug}`).then((res) => res.data),

  // Search
  searchProducts: (query: string) => api.get(`/search?q=${query}`).then((res) => res.data),

  // Cart
  getCart: (userId: string) => api.get(`/cart/${userId}`).then((res) => res.data),

  addToCart: (userId: string, productId: string, variantId?: string, quantity?: number) =>
    api.post(`/cart/${userId}`, { productId, variantId, quantity }).then((res) => res.data),

  updateCartItem: (userId: string, itemId: string, quantity: number) =>
    api.patch(`/cart/${userId}/items/${itemId}`, { quantity }).then((res) => res.data),

  removeFromCart: (userId: string, itemId: string) =>
    api.delete(`/cart/${userId}/items/${itemId}`).then((res) => res.data),

  // Orders
  createOrder: (userId: string, data: any) => api.post(`/orders/${userId}`, data).then((res) => res.data),

  getOrders: (userId: string) => api.get(`/orders/${userId}`).then((res) => res.data),

  getOrderById: (userId: string, orderId: string) => api.get(`/orders/${userId}/${orderId}`).then((res) => res.data),

  // Auth
  register: (data: any) => api.post("/auth/register", data).then((res) => res.data),

  login: (data: any) => api.post("/auth/login", data).then((res) => res.data),

  logout: () => api.post("/auth/logout").then((res) => res.data),

  // Wishlist
  getWishlist: (userId: string) => api.get(`/wishlist/${userId}`).then((res) => res.data),

  addToWishlist: (userId: string, productId: string) =>
    api.post(`/wishlist/${userId}`, { productId }).then((res) => res.data),

  removeFromWishlist: (userId: string, productId: string) =>
    api.delete(`/wishlist/${userId}/${productId}`).then((res) => res.data),

  // Customers
  getMe: () => api.get("/customers/me").then((res) => res.data),

  updateProfile: (userId: string, data: any) =>
    api.patch(`/customers/${userId}`, data).then((res) => res.data),

  // Reviews
  getReviews: (productId: string) => api.get(`/reviews?productId=${productId}`).then((res) => res.data),

  createReview: (productId: string, data: any) =>
    api.post(`/reviews/${productId}`, data).then((res) => res.data),

  // Addresses
  getAddresses: (userId: string) => api.get(`/addresses/${userId}`).then((res) => res.data),

  addAddress: (userId: string, data: any) =>
    api.post(`/addresses/${userId}`, data).then((res) => res.data),

  updateAddress: (userId: string, addressId: string, data: any) =>
    api.put(`/addresses/${userId}/${addressId}`, data).then((res) => res.data),

  removeAddress: (userId: string, addressId: string) =>
    api.delete(`/addresses/${userId}/${addressId}`).then((res) => res.data),

  // Payments
  checkout: (userId: string, data: any) => api.post(`/checkout/${userId}`, data).then((res) => res.data),

  createPayment: (userId: string, orderId: string, provider: string, amount: number) =>
    api.post(`/payments/${userId}/${orderId}`, { provider, amount }).then((res) => res.data),

  // Notifications
  getNotifications: (userId: string) =>
    api.get(`/notifications/${userId}`).then((res) => res.data),
};

export default apiClient;