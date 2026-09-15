import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { couponApi } from "../api/couponApi";
import type { Coupon, CouponFilters } from "@/types";

export const couponKeys = {
  all: ["coupons"] as const,
  lists: () => [...couponKeys.all, "list"] as const,
  list: (filters: CouponFilters) => [...couponKeys.lists(), filters] as const,
  details: () => [...couponKeys.all, "detail"] as const,
  detail: (code: string) => [...couponKeys.details(), code] as const,
};

export const useCouponsQuery = (filters: CouponFilters = {}) => {
  return useQuery({
    queryKey: couponKeys.list(filters),
    queryFn: () => couponApi.getCoupons(filters),
    select: (response) => response.data,
  });
};

export const useCouponQuery = (code: string) => {
  return useQuery({
    queryKey: couponKeys.detail(code),
    queryFn: () => couponApi.getCouponByCode(code),
    select: (response) => response.data,
    enabled: !!code,
  });
};

export const useCreateCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Coupon>) => couponApi.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
    },
  });
};

export const useUpdateCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ code, data }: { code: string; data: Partial<Coupon> }) => couponApi.updateCoupon(code, data),
    onSuccess: (_, { code }) => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      queryClient.invalidateQueries({ queryKey: couponKeys.detail(code) });
    },
  });
};

export const useDeleteCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => couponApi.deleteCoupon(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
    },
  });
};

export const useValidateCouponMutation = () => {
  return useMutation({
    mutationFn: ({ code, orderTotal }: { code: string; orderTotal: number }) => couponApi.validateCoupon(code, orderTotal),
  });
};