import { z } from "zod";

export const brandIdSchema = z.string().min(1, "Brand ID is required");

export const createBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(100),
  description: z.string().optional(),
  logo: z.string().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).default([]),
  }),
});

export const updateBrandSchema = createBrandSchema.partial();