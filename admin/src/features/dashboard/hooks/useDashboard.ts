import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboardApi";
import type { DashboardSummary, ProductReport, CategoryReport, RecentOrder, LowStockProduct } from "@/types";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: () => [...dashboardKeys.all, "summary"] as const,
  bestSellingProducts: (limit: number) => [...dashboardKeys.all, "best-selling-products", limit] as const,
  bestPerformingCategories: (limit: number) => [...dashboardKeys.all, "best-performing-categories", limit] as const,
  recentOrders: (limit: number) => [...dashboardKeys.all, "recent-orders", limit] as const,
  lowStockProducts: (limit: number) => [...dashboardKeys.all, "low-stock-products", limit] as const,
};

export const useDashboardSummaryQuery = () => {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: () => dashboardApi.getSummary(),
    select: (response) => response.data,
  });
};

export const useBestSellingProductsQuery = (limit = 10) => {
  return useQuery({
    queryKey: dashboardKeys.bestSellingProducts(limit),
    queryFn: () => dashboardApi.getBestSellingProducts(limit),
    select: (response) => response.data,
  });
};

export const useBestPerformingCategoriesQuery = (limit = 10) => {
  return useQuery({
    queryKey: dashboardKeys.bestPerformingCategories(limit),
    queryFn: () => dashboardApi.getBestPerformingCategories(limit),
    select: (response) => response.data,
  });
};

export const useRecentOrdersQuery = (limit = 10) => {
  return useQuery({
    queryKey: dashboardKeys.recentOrders(limit),
    queryFn: () => dashboardApi.getRecentOrders(limit),
    select: (response) => response.data,
  });
};

export const useLowStockProductsQuery = (limit = 10) => {
  return useQuery({
    queryKey: dashboardKeys.lowStockProducts(limit),
    queryFn: () => dashboardApi.getLowStockProducts(limit),
    select: (response) => response.data,
  });
};