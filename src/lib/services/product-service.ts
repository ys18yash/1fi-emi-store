import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { calculateEmi } from "@/lib/emi-calculator";
import { ProductListItemDto, ProductDetailDto } from "@/types/product";

export interface ProductFilterParams {
  category?: string;
  brand?: string;
  search?: string;
}

export async function getAllProducts(
  filters?: ProductFilterParams
): Promise<ProductListItemDto[]> {
  const whereClause: Prisma.ProductWhereInput = {};

  if (filters?.category) {
    whereClause.category = {
      slug: filters.category,
    };
  }

  if (filters?.brand) {
    whereClause.brand = {
      equals: filters.brand,
    };
  }

  if (filters?.search) {
    whereClause.OR = [
      { name: { contains: filters.search } },
      { brand: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
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
    orderBy: [{ isFeatured: "desc" }, { displayOrder: "asc" }],
  });

  return products.map((product) => {
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
}

export async function getProductBySlug(
  slug: string
): Promise<ProductDetailDto | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
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
  });

  if (!product) return null;

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
