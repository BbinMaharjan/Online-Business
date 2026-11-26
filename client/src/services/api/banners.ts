import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

const BANNER_KEYS = {
  all: ["banners"] as const,
  lists: () => [...BANNER_KEYS.all, "list"] as const,
  list: () => [...BANNER_KEYS.lists()] as const,
  details: () => [...BANNER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...BANNER_KEYS.details(), id] as const,
};

export function useBanners() {
  return useQuery({
    queryKey: BANNER_KEYS.list(),
    queryFn: () => apiClient.banners.list(),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicBanners() {
  return useQuery({
    queryKey: BANNER_KEYS.list(),
    queryFn: () => apiClient.banners.getPublic(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBanner(id: string) {
  return useQuery({
    queryKey: BANNER_KEYS.detail(id),
    queryFn: () => apiClient.banners.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePrefetchBanners() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.prefetchQuery({
      queryKey: BANNER_KEYS.list(),
      queryFn: () => apiClient.banners.list(),
      staleTime: 5 * 60 * 1000,
    });
  };
}

export function useInvalidateBanners() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: BANNER_KEYS.all });
}