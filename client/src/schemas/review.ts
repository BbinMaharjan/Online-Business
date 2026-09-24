import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5, "Rating must be between 1 and 5"),
  title: z.string().max(100, "Title too long").optional(),
  comment: z.string().min(10, "Review must be at least 10 characters").max(2000, "Review too long"),
  images: z.array(z.string().url("Invalid image URL")).max(5, "Maximum 5 images allowed").optional(),
});

export const reviewUpdateSchema = reviewSchema.partial().extend({
  id: z.string().min(1, "Review ID is required"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
export type ReviewUpdateInput = z.infer<typeof reviewUpdateSchema>;