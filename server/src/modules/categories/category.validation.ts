import { z } from "zod";

export const categoryIdSchema = z.string().min(1, "Category ID is required");

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  description: z.string().optional(),
  parentId: z.string().optional(),
  image: z.string().optional(),
  sortOrder: z.number().default(0),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).default([]),
  }),
});

export const updateCategorySchema = createCategorySchema.partial();