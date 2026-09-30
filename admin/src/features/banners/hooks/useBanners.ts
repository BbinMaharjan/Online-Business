import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bannerApi, type Banner, type BannerFilters } from "../api/bannerApi";

export const bannerKeys = {
  all: ["banners"] as const,
  lists: () => [...bannerKeys.all, "list"] as const,
  list: (filters: BannerFilters) => [...bannerKeys.lists(), filters] as const,
  detail: (id: string) => [...bannerKeys.all, "detail", id] as const,
};

export const useBannersQuery = (filters?: BannerFilters) => {
  return useQuery({
    queryKey: bannerKeys.list(filters || {}),
    queryFn: () => bannerApi.getBanners(filters),
    select: (response) => response.data,
  });
};

export const useBannerQuery = (id: string) => {
  return useQuery({
    queryKey: bannerKeys.detail(id),
    queryFn: () => bannerApi.getBannerById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useCreateBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description?: string; buttonText?: string; buttonLink?: string; image: string; status: "ACTIVE" | "INACTIVE"; sortOrder: number }) =>
      bannerApi.createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
};

export const useUpdateBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{ title: string; description?: string; buttonText?: string; buttonLink?: string; image: string; status: "ACTIVE" | "INACTIVE"; sortOrder: number }>;
    }) => bannerApi.updateBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
};

export const useDeleteBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bannerApi.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
};