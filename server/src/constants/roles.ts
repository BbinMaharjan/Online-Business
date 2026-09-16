export const ROLES = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
};

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
  PENDING: "PENDING",
};

export const PRODUCT_STATUS = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  ARCHIVED: "ARCHIVED",
};

export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
};

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED",
};

export const COUPON_DISCOUNT_TYPE = {
  PERCENTAGE: "PERCENTAGE",
  FIXED_AMOUNT: "FIXED_AMOUNT",
};

export const COUPON_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  EXPIRED: "EXPIRED",
};

export const SHIPPING_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  IN_TRANSIT: "IN_TRANSIT",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  FAILED: "FAILED",
  RETURNED: "RETURNED",
};

export const CART_ITEM_ACTION = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  INCREASE: "INCREASE",
  DECREASE: "DECREASE",
  UPDATE: "UPDATE",
  CLEAR: "CLEAR",
};

export const REVIEW_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export const NOTIFICATION_TYPE = {
  ACCOUNT_CREATED: "ACCOUNT_CREATED",
  EMAIL_VERIFIED: "EMAIL_VERIFIED",
  PASSWORD_CHANGED: "PASSWORD_CHANGED",
  ORDER_CREATED: "ORDER_CREATED",
  PAYMENT_SUCCESSFUL: "PAYMENT_SUCCESSFUL",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  ORDER_SHIPPED: "ORDER_SHIPPED",
  ORDER_DELIVERED: "ORDER_DELIVERED",
  ORDER_CANCELLED: "ORDER_CANCELLED",
  REFUND_PROCESSED: "REFUND_PROCESSED",
};

export const PERMISSIONS = {
  USERS_CREATE: "users:create",
  USERS_READ: "users:read",
  USERS_UPDATE: "users:update",
  USERS_DELETE: "users:delete",
  USERS_LIST: "users:list",

  PRODUCTS_CREATE: "products:create",
  PRODUCTS_READ: "products:read",
  PRODUCTS_UPDATE: "products:update",
  PRODUCTS_DELETE: "products:delete",
  PRODUCTS_LIST: "products:list",

  CATEGORIES_CREATE: "categories:create",
  CATEGORIES_READ: "categories:read",
  CATEGORIES_UPDATE: "categories:update",
  CATEGORIES_DELETE: "categories:delete",
  CATEGORIES_LIST: "categories:list",

  BRANDS_CREATE: "brands:create",
  BRANDS_READ: "brands:read",
  BRANDS_UPDATE: "brands:update",
  BRANDS_DELETE: "brands:delete",
  BRANDS_LIST: "brands:list",

  ORDERS_CREATE: "orders:create",
  ORDERS_READ: "orders:read",
  ORDERS_UPDATE: "orders:update",
  ORDERS_DELETE: "orders:delete",
  ORDERS_LIST: "orders:list",

  COUPONS_CREATE: "coupons:create",
  COUPONS_READ: "coupons:read",
  COUPONS_UPDATE: "coupons:update",
  COUPONS_DELETE: "coupons:delete",
  COUPONS_LIST: "coupons:list",

  SHIPPING_CREATE: "shipping:create",
  SHIPPING_READ: "shipping:read",
  SHIPPING_UPDATE: "shipping:update",
  SHIPPING_DELETE: "shipping:delete",
  SHIPPING_LIST: "shipping:list",

  INVENTORY_CREATE: "inventory:create",
  INVENTORY_READ: "inventory:read",
  INVENTORY_UPDATE: "inventory:update",
  INVENTORY_DELETE: "inventory:delete",
  INVENTORY_LIST: "inventory:list",

  REVIEWS_CREATE: "reviews:create",
  REVIEWS_READ: "reviews:read",
  REVIEWS_UPDATE: "reviews:update",
  REVIEWS_DELETE: "reviews:delete",
  REVIEWS_LIST: "reviews:list",

  WISHLIST_CREATE: "wishlist:create",
  WISHLIST_READ: "wishlist:read",
  WISHLIST_UPDATE: "wishlist:update",
  WISHLIST_DELETE: "wishlist:delete",
  WISHLIST_LIST: "wishlist:list",

  SETTINGS_READ: "settings:read",
  SETTINGS_UPDATE: "settings:update",

  DASHBOARD_READ: "dashboard:read",
  ANALYTICS_READ: "analytics:read",

  MEDIA_CREATE: "media:create",
  MEDIA_READ: "media:read",
  MEDIA_UPDATE: "media:update",
  MEDIA_DELETE: "media:delete",
  MEDIA_LIST: "media:list",

  PAYMENTS_CREATE: "payments:create",
  PAYMENTS_READ: "payments:read",
  PAYMENTS_UPDATE: "payments:update",
  PAYMENTS_DELETE: "payments:delete",
  PAYMENTS_LIST: "payments:list",

  NOTIFICATIONS_CREATE: "notifications:create",
  NOTIFICATIONS_READ: "notifications:read",
  NOTIFICATIONS_UPDATE: "notifications:update",
  NOTIFICATIONS_DELETE: "notifications:delete",
  NOTIFICATIONS_LIST: "notifications:list",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);