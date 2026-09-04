import { prisma } from "@/lib/prisma";
import {
  AdminProductInput,
  AdminVariantInput,
  AdminCategoryInput,
  AdminEmiPlanInput,
} from "@/lib/validators";

export interface AdminStatsDto {
  totalProducts: number;
  totalVariants: number;
  totalCategories: number;
  totalEmiPlans: number;
  totalInventory: number;
}

/**
 * Get aggregated statistics for the admin dashboard
 */
export async function getAdminStats(): Promise<AdminStatsDto> {
  const [productsCount, variantsCount, categoriesCount, emiPlansCount, inventoryAgg] =
    await Promise.all([
      prisma.product.count(),
      prisma.productVariant.count(),
      prisma.category.count(),
      prisma.emiPlan.count(),
      prisma.productVariant.aggregate({
        _sum: { inventoryCount: true },
      }),
    ]);

  return {
    totalProducts: productsCount,
    totalVariants: variantsCount,
    totalCategories: categoriesCount,
    totalEmiPlans: emiPlansCount,
    totalInventory: inventoryAgg._sum.inventoryCount || 0,
  };
}

// ==========================================
// PRODUCTS CRUD
// ==========================================

export async function getAdminProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      variants: {
        include: {
          images: true,
        },
      },
      _count: {
        select: {
          variants: true,
          specifications: true,
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: {
        include: {
          images: true,
          emiPlans: {
            include: { emiPlan: true },
          },
        },
      },
      specifications: {
        orderBy: { displayOrder: "asc" },
      },
    },
  });
}

export async function createAdminProduct(data: AdminProductInput) {
  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      brand: data.brand,
      tagline: data.tagline || null,
      description: data.description,
      badge: data.badge || null,
      categoryId: data.categoryId,
      isFeatured: data.isFeatured ?? false,
      displayOrder: data.displayOrder ?? 0,
    },
    include: {
      category: true,
    },
  });
}

export async function updateAdminProduct(id: string, data: Partial<AdminProductInput>) {
  return prisma.product.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.slug && { slug: data.slug }),
      ...(data.brand && { brand: data.brand }),
      ...(data.tagline !== undefined && { tagline: data.tagline }),
      ...(data.description && { description: data.description }),
      ...(data.badge !== undefined && { badge: data.badge }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
    },
    include: {
      category: true,
    },
  });
}

export async function deleteAdminProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  });
}

// ==========================================
// CATEGORIES CRUD
// ==========================================

export async function getAdminCategories() {
  return prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function createAdminCategory(data: AdminCategoryInput) {
  return prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
    },
  });
}

export async function updateAdminCategory(id: string, data: Partial<AdminCategoryInput>) {
  return prisma.category.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.slug && { slug: data.slug }),
      ...(data.description !== undefined && { description: data.description }),
    },
  });
}

export async function deleteAdminCategory(id: string) {
  // Check if products exist in category
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    throw new Error(`Cannot delete category with ${count} active products. Reassign or delete products first.`);
  }
  return prisma.category.delete({
    where: { id },
  });
}

// ==========================================
// VARIANTS CRUD
// ==========================================

export async function getAdminVariants(productId?: string) {
  return prisma.productVariant.findMany({
    where: productId ? { productId } : undefined,
    include: {
      product: { select: { id: true, name: true, slug: true, brand: true } },
      images: { orderBy: { displayOrder: "asc" } },
      emiPlans: { include: { emiPlan: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createAdminVariant(data: AdminVariantInput) {
  const variant = await prisma.productVariant.create({
    data: {
      productId: data.productId,
      sku: data.sku,
      variantName: data.variantName,
      colorName: data.colorName,
      colorHex: data.colorHex,
      storage: data.storage || null,
      mrp: data.mrp,
      price: data.price,
      inventoryCount: data.inventoryCount,
      isDefault: data.isDefault ?? false,
      displayOrder: data.displayOrder ?? 0,
    },
  });

  // Attach default image if provided
  if (data.imageUrl) {
    await prisma.variantImage.create({
      data: {
        variantId: variant.id,
        url: data.imageUrl,
        altText: `${data.variantName} - Image`,
        isPrimary: true,
        displayOrder: 1,
      },
    });
  }

  // Link all master EMI plans automatically
  const masterPlans = await prisma.emiPlan.findMany();
  for (const p of masterPlans) {
    await prisma.productEmiPlan.create({
      data: {
        variantId: variant.id,
        emiPlanId: p.id,
        displayOrder: p.displayOrder,
      },
    });
  }

  return variant;
}

export async function updateAdminVariant(id: string, data: Partial<AdminVariantInput>) {
  return prisma.productVariant.update({
    where: { id },
    data: {
      ...(data.sku && { sku: data.sku }),
      ...(data.variantName && { variantName: data.variantName }),
      ...(data.colorName && { colorName: data.colorName }),
      ...(data.colorHex && { colorHex: data.colorHex }),
      ...(data.storage !== undefined && { storage: data.storage }),
      ...(data.mrp !== undefined && { mrp: data.mrp }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.inventoryCount !== undefined && { inventoryCount: data.inventoryCount }),
      ...(data.isDefault !== undefined && { isDefault: data.isDefault }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
    },
  });
}

export async function deleteAdminVariant(id: string) {
  return prisma.productVariant.delete({
    where: { id },
  });
}

// ==========================================
// MASTER EMI PLANS CRUD
// ==========================================

export async function getAdminEmiPlans() {
  return prisma.emiPlan.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { displayOrder: "asc" },
  });
}

export async function createAdminEmiPlan(data: AdminEmiPlanInput) {
  return prisma.emiPlan.create({
    data: {
      tenureMonths: data.tenureMonths,
      annualInterestRate: data.annualInterestRate,
      isNoCost: data.isNoCost ?? data.annualInterestRate === 0,
      cashbackAmount: data.cashbackAmount,
      cashbackDescription: data.cashbackDescription || null,
      minPledgeMultiplier: data.minPledgeMultiplier ?? 1.5,
      displayOrder: data.displayOrder ?? 0,
    },
  });
}

export async function updateAdminEmiPlan(id: string, data: Partial<AdminEmiPlanInput>) {
  return prisma.emiPlan.update({
    where: { id },
    data: {
      ...(data.tenureMonths !== undefined && { tenureMonths: data.tenureMonths }),
      ...(data.annualInterestRate !== undefined && {
        annualInterestRate: data.annualInterestRate,
        isNoCost: data.annualInterestRate === 0,
      }),
      ...(data.cashbackAmount !== undefined && { cashbackAmount: data.cashbackAmount }),
      ...(data.cashbackDescription !== undefined && { cashbackDescription: data.cashbackDescription }),
      ...(data.minPledgeMultiplier !== undefined && { minPledgeMultiplier: data.minPledgeMultiplier }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
    },
  });
}

export async function deleteAdminEmiPlan(id: string) {
  return prisma.emiPlan.delete({
    where: { id },
  });
}

// ==========================================
// VARIANT IMAGES CRUD
// ==========================================

export async function getAdminImages(variantId?: string) {
  return prisma.variantImage.findMany({
    where: variantId ? { variantId } : undefined,
    include: {
      variant: {
        select: {
          id: true,
          sku: true,
          variantName: true,
          product: {
            select: { id: true, name: true },
          },
        },
      },
    },
    orderBy: { displayOrder: "asc" },
  });
}

export async function createAdminImage(data: {
  variantId: string;
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
  displayOrder?: number;
}) {
  if (data.isPrimary) {
    // Unset primary on other images for this variant
    await prisma.variantImage.updateMany({
      where: { variantId: data.variantId },
      data: { isPrimary: false },
    });
  }

  return prisma.variantImage.create({
    data: {
      variantId: data.variantId,
      url: data.url,
      altText: data.altText || "Product image",
      isPrimary: data.isPrimary ?? false,
      displayOrder: data.displayOrder ?? 0,
    },
  });
}

export async function updateAdminImage(
  id: string,
  data: {
    url?: string;
    altText?: string | null;
    isPrimary?: boolean;
    displayOrder?: number;
  }
) {
  const current = await prisma.variantImage.findUnique({ where: { id } });
  if (!current) throw new Error("Image not found");

  if (data.isPrimary) {
    await prisma.variantImage.updateMany({
      where: { variantId: current.variantId },
      data: { isPrimary: false },
    });
  }

  return prisma.variantImage.update({
    where: { id },
    data: {
      ...(data.url !== undefined && { url: data.url }),
      ...(data.altText !== undefined && { altText: data.altText || "Product image" }),
      ...(data.isPrimary !== undefined && { isPrimary: data.isPrimary }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
    },
  });
}

export async function deleteAdminImage(id: string) {
  return prisma.variantImage.delete({
    where: { id },
  });
}

export async function reorderAdminImages(orders: { id: string; displayOrder: number }[]) {
  const updates = orders.map((item) =>
    prisma.variantImage.update({
      where: { id: item.id },
      data: { displayOrder: item.displayOrder },
    })
  );
  return prisma.$transaction(updates);
}
