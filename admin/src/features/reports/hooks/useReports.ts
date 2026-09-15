import { useQuery } from "@tanstack/react-query";
import { reportApi } from "../api/reportApi";
import type { SalesReport, ProductReport, CategoryReport, CustomerReport, ReportFilters } from "@/types";

export const reportKeys = {
  all: ["reports"] as const,
  sales: (filters: ReportFilters) => [...reportKeys.all, "sales", filters] as const,
  products: (filters: ReportFilters) => [...reportKeys.all, "products", filters] as const,
  categories: (filters: ReportFilters) => [...reportKeys.all, "categories", filters] as const,
  customers: (filters: ReportFilters) => [...reportKeys.all, "customers", filters] as const,
};

export const useSalesReportQuery = (filters: ReportFilters = {}) => {
  return useQuery({
    queryKey: reportKeys.sales(filters),
    queryFn: () => reportApi.getSalesReport(filters),
    select: (response) => response.data,
  });
};

export const useProductReportQuery = (filters: ReportFilters = {}) => {
  return useQuery({
    queryKey: reportKeys.products(filters),
    queryFn: () => reportApi.getProductReport(filters),
    select: (response) => response.data,
  });
};

export const useCategoryReportQuery = (filters: ReportFilters = {}) => {
  return useQuery({
    queryKey: reportKeys.categories(filters),
    queryFn: () => reportApi.getCategoryReport(filters),
    select: (response) => response.data,
  });
};

export const useCustomerReportQuery = (filters: ReportFilters = {}) => {
  return useQuery({
    queryKey: reportKeys.customers(filters),
    queryFn: () => reportApi.getCustomerReport(filters),
    select: (response) => response.data,
  });
};