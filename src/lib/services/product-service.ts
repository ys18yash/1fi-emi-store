import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { calculateEmi } from "@/lib/emi-calculator";
import { ProductListItemDto, ProductDetailDto, CatalogFacetsDto } from "@/types/product";

export interface ProductFilterParams {
  category?: string;
  brand?: string;
  search?: string;
  storage?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "recommended" | "price_asc" | "price_desc" | "newest";
}

export async function getAllProducts(
  filters?: ProductFilterParams
): Promise<ProductListItemDto[]> {
  const whereClause: Prisma.ProductWhereInput = {};

  // 1. Category Filter (by slug or name)
  if (filters?.category && filters.category !== "ALL") {
    whereClause.category = {
      is: {
        OR: [
          { slug: { equals: filters.category } },
          { name: { equals: filters.category } },
        ],
      },
    };
  }

  // 2. Brand Filter
  if (filters?.brand && filters.brand !== "ALL") {
    whereClause.brand = {
      equals: filters.brand,
    };
  }

  // 3. Search Filter (name, brand, description, tagline, SKU, variantName)
  if (filters?.search && filters.search.trim()) {
    const term = filters.search.trim();
    whereClause.OR = [
      { name: { contains: term } },
      { brand: { contains: term } },
      { tagline: { contains: term } },
      { description: { contains: term } },
      {
        variants: {
          some: {
            OR: [
              { sku: { contains: term } },
              { variantName: { contains: term } },
              { colorName: { contains: term } },
            ],
          },
        },
      },
    ];
  }

  // 4. Variant-level Storage Filter
  if (filters?.storage && filters.storage !== "ALL") {
    whereClause.variants = {
      ...(whereClause.variants || {}),
      some: {
        ...(whereClause.variants?.some || {}),
        storage: { equals: filters.storage },
      },
    };
  }

  // 5. Variant-level Price Range Filter
  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    const priceConditions: Prisma.IntFilter = {};
    if (filters?.minPrice !== undefined && !isNaN(filters.minPrice)) {
      priceConditions.gte = filters.minPrice;
    }
    if (filters?.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      priceConditions.lte = filters.maxPrice;
    }

    whereClause.variants = {
      ...(whereClause.variants || {}),
      some: {
        ...(whereClause.variants?.some || {}),
        price: priceConditions,
      },
    };
  }

  // Determine Prisma primary orderBy
  let orderByClause: Prisma.ProductOrderByWithRelationInput[] = [
    { isFeatured: "desc" },
    { displayOrder: "asc" },
  ];

  if (filters?.sort === "newest") {
    orderByClause = [{ createdAt: "desc" }];
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      variants: {
        orderBy: { displayOrder: "asc" },
        include: {
          images: {
            orderBy: { displayOrder: "asc" },
          },
          emiPlans: {
            orderBy: { displayOrder: "asc" },
            include: {
              emiPlan: true,
            },
          },
        },
      },
    },
    orderBy: orderByClause,
  });

  const formattedProducts = products.map((product) => {
    const defaultVariant =
      product.variants.find((v) => v.isDefault) || product.variants[0];

    const startingPrice = Math.min(...product.variants.map((v) => v.price));
    const correspondingMrp =
      product.variants.find((v) => v.price === startingPrice)?.mrp ?? startingPrice;
    const discountPercentage = Math.round(
      ((correspondingMrp - startingPrice) / correspondingMrp) * 100
    );

    // Calculate accurate minimum monthly EMI across all available plans
    let minMonthlyEmi = 0;
    if (defaultVariant && defaultVariant.emiPlans.length > 0) {
      const emis = defaultVariant.emiPlans.map((p) => {
        if (p.customMonthlyEmi) return p.customMonthlyEmi;
        const calc = calculateEmi({
          principal: defaultVariant.price,
          tenureMonths: p.emiPlan.tenureMonths,
          annualInterestRate: p.emiPlan.annualInterestRate,
          cashbackAmount: p.emiPlan.cashbackAmount,
          minPledgeMultiplier: p.emiPlan.minPledgeMultiplier,
        });
        return calc.monthlyEmi;
      });
      minMonthlyEmi = Math.min(...emis);
    }

    const primaryImage =
      defaultVariant?.images.find((img) => img.isPrimary)?.url ||
      defaultVariant?.images[0]?.url ||
      "/images/products/iphone17pro-desert.svg";

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      tagline: product.tagline,
      badge: product.badge,
      categoryName: product.category.name,
      startingPrice,
      startingMrp: correspondingMrp,
      discountPercentage,
      minMonthlyEmi,
      variantsCount: product.variants.length,
      defaultVariant: {
        id: defaultVariant?.id ?? "",
        sku: defaultVariant?.sku ?? "",
        storage: defaultVariant?.storage ?? null,
        colorName: defaultVariant?.colorName ?? "",
        colorHex: defaultVariant?.colorHex ?? "#000000",
        imageUrl: primaryImage,
      },
    };
  });

  // Apply Price Sorting if requested
  if (filters?.sort === "price_asc") {
    formattedProducts.sort((a, b) => a.startingPrice - b.startingPrice);
  } else if (filters?.sort === "price_desc") {
    formattedProducts.sort((a, b) => b.startingPrice - a.startingPrice);
  }

  return formattedProducts;
}

/**
 * Retrieve dynamic catalog facets for filters
 */
export async function getCatalogFacets(): Promise<CatalogFacetsDto> {
  const [categories, products, variants, priceStats] = await Promise.all([
    prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      select: {
        brand: true,
      },
    }),
    prisma.productVariant.findMany({
      where: {
        storage: { not: null },
      },
      select: {
        storage: true,
      },
    }),
    prisma.productVariant.aggregate({
      _min: { price: true },
      _max: { price: true },
    }),
  ]);

  // Aggregate Brand counts
  const brandCountMap = new Map<string, number>();
  products.forEach((p) => {
    brandCountMap.set(p.brand, (brandCountMap.get(p.brand) || 0) + 1);
  });
  const brands = Array.from(brandCountMap.entries()).map(([name, count]) => ({
    name,
    count,
  }));

  // Aggregate Storage counts
  const storageCountMap = new Map<string, number>();
  variants.forEach((v) => {
    if (v.storage) {
      storageCountMap.set(v.storage, (storageCountMap.get(v.storage) || 0) + 1);
    }
  });
  const storages = Array.from(storageCountMap.entries()).map(([value, count]) => ({
    value,
    count,
  }));

  return {
    categories: categories.map((c) => ({
      name: c.name,
      slug: c.slug,
      count: c._count.products,
    })),
    brands,
    storages,
    priceRange: {
      min: priceStats._min.price ?? 50000,
      max: priceStats._max.price ?? 200000,
    },
  };
}


export async function getProductBySlug(
  slug: string
): Promise<ProductDetailDto | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        select: { rating: true },
      },
      specifications: {
        orderBy: { displayOrder: "asc" },
      },
      variants: {
        orderBy: { displayOrder: "asc" },
        include: {
          images: {
            orderBy: { displayOrder: "asc" },
          },
          emiPlans: {
            orderBy: { displayOrder: "asc" },
            include: {
              emiPlan: true,
            },
          },
        },
      },
    },
  });

  if (!product) return null;

  // Calculate review summary
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sumRatings = 0;
  product.reviews.forEach((r) => {
    if (r.rating in distribution) {
      distribution[r.rating as keyof typeof distribution]++;
      sumRatings += r.rating;
    }
  });
  const totalReviews = product.reviews.length;
  const averageRating =
    totalReviews > 0 ? parseFloat((sumRatings / totalReviews).toFixed(1)) : 0;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    tagline: product.tagline,
    description: product.description,
    badge: product.badge,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    reviewSummary: {
      averageRating,
      totalReviews,
      ratingDistribution: distribution,
    },
    specifications: product.specifications.map((spec) => ({
      id: spec.id,
      category: spec.category,
      name: spec.name,
      value: spec.value,
      displayOrder: spec.displayOrder,
    })),
    variants: product.variants.map((v) => {
      const discountPercentage = Math.round(((v.mrp - v.price) / v.mrp) * 100);

      const emiPlans = v.emiPlans.map((mapping) => {
        const plan = mapping.emiPlan;

        const calculated = calculateEmi({
          principal: v.price,
          tenureMonths: plan.tenureMonths,
          annualInterestRate: plan.annualInterestRate,
          cashbackAmount: plan.cashbackAmount,
          minPledgeMultiplier: plan.minPledgeMultiplier,
        });

        // Use custom precomputed monthly EMI if explicitly assigned, else calculated
        const finalMonthlyEmi = mapping.customMonthlyEmi ?? calculated.monthlyEmi;
        const totalPayable = mapping.customMonthlyEmi
          ? mapping.customMonthlyEmi * plan.tenureMonths
          : calculated.totalPayable;
        const netEffectiveCost = Math.max(0, totalPayable - plan.cashbackAmount);

        return {
          id: plan.id,
          tenureMonths: plan.tenureMonths,
          monthlyEmi: finalMonthlyEmi,
          annualInterestRate: plan.annualInterestRate,
          isNoCost: plan.isNoCost,
          cashbackAmount: plan.cashbackAmount,
          cashbackDescription: plan.cashbackDescription,
          totalPayable,
          netEffectiveCost,
          requiredMfPledge: Math.round(v.price * plan.minPledgeMultiplier),
          monthlyMutualFundGrowthEstimated:
            calculated.monthlyMutualFundGrowthEstimated,
        };
      });

      return {
        id: v.id,
        sku: v.sku,
        variantName: v.variantName,
        colorName: v.colorName,
        colorHex: v.colorHex,
        storage: v.storage,
        mrp: v.mrp,
        price: v.price,
        discountPercentage,
        inventoryCount: v.inventoryCount,
        isDefault: v.isDefault,
        images: v.images.map((img) => ({
          id: img.id,
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary,
        })),
        emiPlans,
      };
    }),
  };
}
