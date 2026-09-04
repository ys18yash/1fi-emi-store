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

export const CreateReviewSchema = z.object({
  rating: z
    .coerce
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  title: z
    .string()
    .trim()
    .min(2, "Review title must be at least 2 characters")
    .max(100, "Review title cannot exceed 100 characters"),
  comment: z
    .string()
    .trim()
    .min(5, "Review comment must be at least 5 characters")
    .max(1000, "Review comment cannot exceed 1000 characters"),
  reviewerName: z
    .string()
    .trim()
    .min(2, "Reviewer name must be at least 2 characters")
    .max(50, "Reviewer name cannot exceed 50 characters"),
  variantName: z.string().trim().max(100).optional(),
});

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;

export const ReviewQuerySchema = z.object({
  rating: z.coerce.number().int().min(1).max(5).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export type ReviewQueryParams = z.infer<typeof ReviewQuerySchema>;

// ==========================================
// ADMIN CATALOG MANAGEMENT SCHEMAS
// ==========================================

export const AdminProductSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters").max(100),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  brand: z.string().trim().min(1, "Brand is required").max(50),
  tagline: z.string().trim().max(200).optional().nullable(),
  description: z.string().trim().min(5, "Description must be at least 5 characters"),
  badge: z.string().trim().max(30).optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  isFeatured: z.boolean().optional().default(false),
  displayOrder: z.coerce.number().int().optional().default(0),
});

export type AdminProductInput = z.infer<typeof AdminProductSchema>;

export const AdminVariantSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  sku: z.string().trim().min(2, "SKU is required").max(50),
  variantName: z.string().trim().min(2, "Variant name is required").max(100),
  colorName: z.string().trim().min(1, "Color name is required").max(50),
  colorHex: z.string().trim().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid Hex color format"),
  storage: z.string().trim().max(50).optional().nullable(),
  mrp: z.coerce.number().int().positive("MRP must be greater than 0"),
  price: z.coerce.number().int().positive("Price must be greater than 0"),
  inventoryCount: z.coerce.number().int().min(0, "Inventory cannot be negative").default(25),
  isDefault: z.boolean().optional().default(false),
  displayOrder: z.coerce.number().int().optional().default(0),
  imageUrl: z.string().trim().optional(),
});

export type AdminVariantInput = z.infer<typeof AdminVariantSchema>;

export const AdminCategorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters").max(50),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  description: z.string().trim().max(250).optional().nullable(),
});

export type AdminCategoryInput = z.infer<typeof AdminCategorySchema>;

export const AdminEmiPlanSchema = z.object({
  tenureMonths: z.coerce.number().int().min(1, "Tenure must be at least 1 month"),
  annualInterestRate: z.coerce.number().min(0, "Interest rate cannot be negative").max(100),
  isNoCost: z.boolean().optional().default(true),
  cashbackAmount: z.coerce.number().int().min(0).default(0),
  cashbackDescription: z.string().trim().max(200).optional().nullable(),
  minPledgeMultiplier: z.coerce.number().min(1.0).max(5.0).default(1.5),
  displayOrder: z.coerce.number().int().optional().default(0),
});

export type AdminEmiPlanInput = z.infer<typeof AdminEmiPlanSchema>;

export const AdminImageSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  url: z.string().trim().min(5, "Valid image URL is required"),
  altText: z.string().trim().max(100).optional().nullable(),
  isPrimary: z.boolean().optional().default(false),
  displayOrder: z.coerce.number().int().optional().default(0),
});

export type AdminImageInput = z.infer<typeof AdminImageSchema>;

export const AdminImageReorderSchema = z.object({
  imageOrders: z.array(
    z.object({
      id: z.string(),
      displayOrder: z.number().int(),
    })
  ),
});

export type AdminImageReorderInput = z.infer<typeof AdminImageReorderSchema>;
