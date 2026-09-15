import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../api/notificationApi";
import type { Notification } from "@/types";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: (userId: string) => [...notificationKeys.all, "list", userId] as const,
};

export const useNotificationsQuery = (userId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: notificationKeys.lists(userId),
    queryFn: () => notificationApi.getNotifications(userId, page, limit),
    select: (response) => response.data,
    enabled: !!userId,
  });
};

export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, notificationId }: { userId: string; notificationId: string }) =>
      notificationApi.markAsRead(userId, notificationId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists(userId) });
    },
  });
};

export const useMarkAllAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => notificationApi.markAllAsRead(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists(userId) });
    },
  });
};