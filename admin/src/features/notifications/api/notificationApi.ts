import apiClient from "@/lib/apiClient";
import type { PaginatedResponse, ApiResponse, Notification } from "@/types";

export const notificationApi = {
  getNotifications: (userId: string, page = 1, limit = 20) =>
    apiClient.get<PaginatedResponse<Notification>>(`/notifications/${userId}?page=${page}&limit=${limit}`),

  markAsRead: (userId: string, notificationId: string) =>
    apiClient.patch<ApiResponse<Notification>>(`/notifications/${userId}/${notificationId}/read`),

  markAllAsRead: (userId: string) =>
    apiClient.patch<ApiResponse<void>>(`/notifications/${userId}/read-all`),
};