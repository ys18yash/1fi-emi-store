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
  displayOrder?: number;
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

export interface ProductSpecificationDto {
  id: string;
  category: string | null;
  name: string;
  value: string;
  displayOrder: number;
}

export interface ReviewDto {
  id: string;
  productId: string;
  variantName: string | null;
  rating: number;
  title: string;
  comment: string;
  reviewerName: string;
  verifiedBuyer: boolean;
  createdAt: string;
}

export interface ReviewSummaryDto {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ProductReviewsResponseDto {
  reviews: ReviewDto[];
  summary: ReviewSummaryDto;
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
  specifications: ProductSpecificationDto[];
  reviewSummary?: ReviewSummaryDto;
}

export interface ProductListItemDto {
  id: string;
  slug: string;
  name: string;
  brand: string;
  tagline: string | null;
  badge: string | null;
  categoryName: string;
  categorySlug?: string;
  startingPrice: number;
  startingMrp: number;
  discountPercentage: number;
  minMonthlyEmi: number;
  variantsCount: number;
  availableStorages?: string[];
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

