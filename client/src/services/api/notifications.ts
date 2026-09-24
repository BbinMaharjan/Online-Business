import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Notification, PaginatedResponse } from "@/types";

const NOTIFICATION_KEYS = {
  all: ["notifications"] as const,
  lists: () => [...NOTIFICATION_KEYS.all, "list"] as const,
  list: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => [...NOTIFICATION_KEYS.lists(), params] as const,
  unreadCount: () => [...NOTIFICATION_KEYS.all, "unread-count"] as const,
};

export function useNotifications(params?: { page?: number; limit?: number; unreadOnly?: boolean }) {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(params),
    queryFn: () => apiClient.notifications.list(params),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.unreadCount(),
    queryFn: async () => {
      const response = await apiClient.notifications.list({ unreadOnly: true, limit: 1 });
      return response.data?.meta?.pagination?.total || 0;
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.notifications.markRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.lists() });
      const previousNotifications = queryClient.getQueryData<PaginatedResponse<Notification>>(NOTIFICATION_KEYS.list());
      if (previousNotifications) {
        queryClient.setQueryData<PaginatedResponse<Notification>>(NOTIFICATION_KEYS.list(), {
          ...previousNotifications,
          data: previousNotifications.data.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
        });
      }
      return { previousNotifications };
    },
    onError: (_, __, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(NOTIFICATION_KEYS.list(), context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.notifications.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
}

export function useInvalidateNotifications() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
}