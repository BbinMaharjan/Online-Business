export const API_ENDPOINTS = {
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id: string) => `/products/${id}`,
    BY_SLUG: (slug: string) => `/products-by-slug/${slug}`,
    REVIEWS: (productId: string) => `/products/${productId}/reviews`,
  },
  CATEGORIES: {
    LIST: "/categories",
    DETAIL: (id: string) => `/categories/${id}`,
    BY_SLUG: (slug: string) => `/categories-by-slug/${slug}`,
  },
  BRANDS: {
    LIST: "/brands",
    DETAIL: (id: string) => `/brands/${id}`,
    BY_SLUG: (slug: string) => `/brands-by-slug/${slug}`,
  },
  SEARCH: {
    PRODUCTS: "/search",
    SUGGESTIONS: "/search/suggestions",
  },
  CART: {
    GET: "/cart",
    ADD_ITEM: "/cart/items",
    UPDATE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
    REMOVE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
    APPLY_COUPON: "/cart/coupon",
    REMOVE_COUPON: "/cart/coupon",
  },
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    REFRESH_TOKEN: "/auth/refresh",
    ME: "/customers/me",
  },
  ADDRESSES: {
    LIST: "/addresses",
    CREATE: "/addresses",
    UPDATE: (id: string) => `/addresses/${id}`,
    DELETE: (id: string) => `/addresses/${id}`,
  },
  ORDERS: {
    LIST: "/orders",
    CREATE: "/orders",
    DETAIL: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    REFUND: (id: string) => `/orders/${id}/refund`,
  },
  PAYMENTS: {
    CREATE: "/payments/create",
    STATUS: (id: string) => `/payments/${id}/status`,
  },
  WISHLIST: {
    LIST: "/wishlist",
    ADD: "/wishlist",
    REMOVE: (productId: string) => `/wishlist/${productId}`,
  },
  REVIEWS: {
    LIST: "/reviews",
    CREATE: "/reviews",
    UPDATE: (id: string) => `/reviews/${id}`,
    DELETE: (id: string) => `/reviews/${id}`,
  },
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
  },
} as const;