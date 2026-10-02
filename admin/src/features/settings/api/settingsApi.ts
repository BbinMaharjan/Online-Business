import apiClient from "@/lib/apiClient";
import type { ApiResponse, Settings } from "@/types";

export const settingsApi = {
  getSettings: () =>
    apiClient.get<ApiResponse<Settings>>("/settings"),

  updateSettings: (data: Partial<Settings>) =>
    apiClient.patch<ApiResponse<Settings>>("/settings", data),

  uploadImage: (file: File, type: "storeLogo" | "favicon") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    return apiClient.upload<ApiResponse<{ url: string }>>("/settings/upload", formData);
  },
};