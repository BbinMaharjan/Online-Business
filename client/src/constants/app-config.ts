export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Storefront",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  env: process.env.NEXT_PUBLIC_ENV || "development",

  pagination: {
    defaultLimit: 12,
    maxLimit: 50,
  },

  products: {
    gridColumns: {
      xs: 2,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
    },
    imageSizes: {
      thumbnail: { width: 200, height: 200 },
      card: { width: 300, height: 300 },
      detail: { width: 600, height: 600 },
      zoom: { width: 1200, height: 1200 },
    },
  },

  search: {
    debounceMs: 300,
    minQueryLength: 2,
    maxSuggestions: 10,
  },

  cart: {
    maxQuantity: 99,
    minQuantity: 1,
  },

  checkout: {
    steps: ["address", "shipping", "payment", "review"] as const,
  },

  auth: {
    tokenExpiryBuffer: 5 * 60 * 1000,
    passwordMinLength: 8,
  },

  features: {
    wishlist: process.env.NEXT_PUBLIC_ENABLE_WISHLIST === "true",
    reviews: process.env.NEXT_PUBLIC_ENABLE_REVIEWS === "true",
    coupons: process.env.NEXT_PUBLIC_ENABLE_COUPONS === "true",
  },

  seo: {
    defaultTitle: "Storefront - Your Online Shop",
    defaultDescription: "Discover quality products at great prices. Fast shipping, easy returns, secure checkout.",
    defaultImage: "/og-image.jpg",
    twitterHandle: "@storefront",
  },

  cache: {
    products: 60 * 60,
    categories: 60 * 60 * 24,
    brands: 60 * 60 * 24,
    homepage: 60 * 60,
  },
} as const;

export type AppConfig = typeof APP_CONFIG;