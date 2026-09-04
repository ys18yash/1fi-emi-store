import { z } from "zod";

export const ProductSlugParamSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug is too long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must only contain lowercase alphanumeric characters and hyphens"
    ),
});

export const ProductQuerySchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  search: z.string().optional(),
  storage: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z
    .enum(["recommended", "price_asc", "price_desc", "newest"])
    .optional()
    .default("recommended"),
});

export type ProductQueryParams = z.infer<typeof ProductQuerySchema>;

