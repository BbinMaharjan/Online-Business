import { z } from "zod";

export const productIdSchema = z.string().min(1, "Product ID is required");

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  description: z.string().min(1, "Product description is required"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  compareAtPrice: z.number().optional().min(0, "Compare at price must be greater than or equal to 0"),
  tax: z.number().default(0).min(0, "Tax must be greater than or equal to 0"),
  categoryId: z.string().min(1, "Category ID is required"),
  brandId: z.string().min(1, "Brand ID is required"),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
  featured: z.boolean().default(false),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).default([]),
  }),
  variants: z.array(z.object({
    name: z.string().min(1, "Variant name is required"),
    sku: z.string().min(1, "Variant SKU is required"),
    price: z.number().min(0, "Variant price must be greater than or equal to 0"),
    stock: z.number().default(0),
    attributes: z.record(z.string()).optional(),
    images: z.array(z.string()).optional(),
  })).optional(),
});

export const updateProductSchema = createProductSchema.partial();