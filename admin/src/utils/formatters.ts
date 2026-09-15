export const formatCurrency = (value: number, currency = "USD", locale = "en-US"): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value: number, locale = "en-US"): string => {
  return new Intl.NumberFormat(locale).format(value);
};

export const formatDate = (dateString: string, locale = "en-US"): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatDateShort = (dateString: string, locale = "en-US"): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const formatPercent = (value: number, locale = "en-US"): string => {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    ACTIVE: "success",
    INACTIVE: "default",
    DRAFT: "warning",
    ARCHIVED: "default",
    PENDING: "warning",
    CONFIRMED: "blue",
    PROCESSING: "cyan",
    SHIPPED: "blue",
    DELIVERED: "success",
    CANCELLED: "error",
    REFUNDED: "error",
    PAID: "success",
    FAILED: "error",
    APPROVED: "success",
    REJECTED: "error",
  };
  return statusColors[status] || "default";
};

export const getOrderStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    PENDING: "warning",
    CONFIRMED: "blue",
    PROCESSING: "cyan",
    SHIPPED: "blue",
    DELIVERED: "success",
    CANCELLED: "error",
    REFUNDED: "error",
  };
  return statusColors[status] || "default";
};

export const getPaymentStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    PENDING: "warning",
    PROCESSING: "cyan",
    PAID: "success",
    FAILED: "error",
    REFUNDED: "error",
    PARTIALLY_REFUNDED: "warning",
  };
  return statusColors[status] || "default";
};