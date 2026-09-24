export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  CATEGORIES: "/categories",
  CATEGORY_DETAIL: (slug: string) => `/categories/${slug}`,
  BRANDS: "/brands",
  BRAND_DETAIL: (slug: string) => `/brands/${slug}`,
  SEARCH: "/search",
  CART: "/cart",
  CHECKOUT: "/checkout",
  CHECKOUT_SUCCESS: "/checkout/success",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  ACCOUNT: "/account",
  ACCOUNT_PROFILE: "/account/profile",
  ACCOUNT_ORDERS: "/account/orders",
  ACCOUNT_ORDER_DETAIL: (id: string) => `/account/orders/${id}`,
  ACCOUNT_ADDRESSES: "/account/addresses",
  ACCOUNT_WISHLIST: "/account/wishlist",
  ACCOUNT_REVIEWS: "/account/reviews",
  ABOUT: "/about",
  CONTACT: "/contact",
  FAQ: "/faq",
  TERMS: "/terms",
  PRIVACY: "/privacy",
} as const;

export const PROTECTED_ROUTES = [
  "/account",
  "/checkout",
  "/cart",
] as const;

export const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
] as const;

export type RouteKey = keyof typeof ROUTES;