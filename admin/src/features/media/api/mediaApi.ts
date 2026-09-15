import apiClient from "@/lib/apiClient";
import type { PaginatedResponse, ApiResponse, Media } from "@/types";

export const mediaApi = {
  uploadMedia: (file: File, referenceId: string, referenceType: string, alt?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("referenceId", referenceId);
    formData.append("referenceType", referenceType);
    if (alt) formData.append("alt", alt);
    return apiClient.upload<ApiResponse<Media>>("/media/upload", formData);
  },

  deleteMedia: (mediaId: string) =>
    apiClient.delete<ApiResponse<void>>(`/media/${mediaId}`),

  getMediaById: (mediaId: string) =>
    apiClient.get<ApiResponse<Media>>(`/media/${mediaId}`),

  getMediaByReference: (referenceId: string, referenceType: string) =>
    apiClient.get<ApiResponse<Media[]>>(`/media/reference/${referenceId}/${referenceType}`),
};