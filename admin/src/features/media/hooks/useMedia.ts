import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { mediaApi } from "../api/mediaApi";
import type { Media } from "@/types";

export const mediaKeys = {
  all: ["media"] as const,
  reference: (referenceId: string, referenceType: string) => [...mediaKeys.all, "reference", referenceId, referenceType] as const,
};

export const useUploadMediaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, referenceId, referenceType, alt }: { file: File; referenceId: string; referenceType: string; alt?: string }) =>
      mediaApi.uploadMedia(file, referenceId, referenceType, alt),
    onSuccess: (_, { referenceId, referenceType }) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.reference(referenceId, referenceType) });
    },
  });
};

export const useDeleteMediaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mediaId: string) => mediaApi.deleteMedia(mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
};

export const useMediaByReferenceQuery = (referenceId: string, referenceType: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: mediaKeys.reference(referenceId, referenceType),
    queryFn: () => mediaApi.getMediaByReference(referenceId, referenceType),
    select: (response) => response.data,
    enabled: !!referenceId && !!referenceType,
  });
};