export interface EmiPlanDto {
  id: string;
  tenureMonths: number;
  monthlyEmi: number;
  annualInterestRate: number;
  isNoCost: boolean;
  cashbackAmount: number;
  cashbackDescription: string | null;
  totalPayable: number;
  netEffectiveCost: number;
  requiredMfPledge: number;
  monthlyMutualFundGrowthEstimated: number;
}

export interface VariantImageDto {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}

export interface ProductVariantDto {
  id: string;
  sku: string;
  variantName: string;
  colorName: string;
  colorHex: string;
  storage: string | null;
  mrp: number;
  price: number;
  discountPercentage: number;
  inventoryCount: number;
  isDefault: boolean;
  images: VariantImageDto[];
  emiPlans: EmiPlanDto[];
}

export interface ProductDetailDto {
  id: string;
  slug: string;
  name: string;
  brand: string;
  tagline: string | null;
  description: string;
  badge: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  variants: ProductVariantDto[];
}

export interface ProductListItemDto {
  id: string;
  slug: string;
  name: string;
  brand: string;
  tagline: string | null;
  badge: string | null;
  categoryName: string;
  startingPrice: number;
  startingMrp: number;
  discountPercentage: number;
  minMonthlyEmi: number;
  variantsCount: number;
  defaultVariant: {
    id: string;
    sku?: string;
    storage: string | null;
    colorName: string;
    colorHex: string;
    imageUrl: string;
  };
}

export interface CatalogFacetCategory {
  name: string;
  slug: string;
  count: number;
}

export interface CatalogFacetBrand {
  name: string;
  count: number;
}

export interface CatalogFacetStorage {
  value: string;
  count: number;
}

export interface CatalogFacetsDto {
  categories: CatalogFacetCategory[];
  brands: CatalogFacetBrand[];
  storages: CatalogFacetStorage[];
  priceRange: {
    min: number;
    max: number;
  };
}

export interface CatalogFilterState {
  search?: string;
  category?: string;
  brand?: string;
  storage?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "recommended" | "price_asc" | "price_desc" | "newest";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  facets?: CatalogFacetsDto;
  totalCount?: number;
  error?: string;
  message?: string;
}

