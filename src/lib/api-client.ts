import { ProductListItemDto, ProductDetailDto, ApiResponse } from "@/types/product";
import { getAllProducts, getProductBySlug } from "@/lib/services/product-service";

/**
 * Resolves the base URL for isomorphic server & client HTTP requests
 */
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return ""; // Browser uses relative URLs
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * Consumer for GET /api/products
 * Calls the backend REST API endpoint and returns parsed products
 */
export async function fetchProductsFromApi(filters?: {
  category?: string;
  brand?: string;
  search?: string;
  storage?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "recommended" | "price_asc" | "price_desc" | "newest";
}): Promise<ProductListItemDto[]> {
  try {
    const baseUrl = getBaseUrl();
    const url = new URL("/api/products", baseUrl || "http://localhost:3000");

    if (filters?.category && filters.category !== "ALL") {
      url.searchParams.set("category", filters.category);
    }
    if (filters?.brand && filters.brand !== "ALL") {
      url.searchParams.set("brand", filters.brand);
    }
    if (filters?.search) {
      url.searchParams.set("search", filters.search);
    }
    if (filters?.storage && filters.storage !== "ALL") {
      url.searchParams.set("storage", filters.storage);
    }
    if (filters?.minPrice !== undefined) {
      url.searchParams.set("minPrice", filters.minPrice.toString());
    }
    if (filters?.maxPrice !== undefined) {
      url.searchParams.set("maxPrice", filters.maxPrice.toString());
    }
    if (filters?.sort) {
      url.searchParams.set("sort", filters.sort);
    }

    const response = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn(
        `[API Consumer] GET /api/products returned status ${response.status}. Using service fallback.`
      );
      return await getAllProducts(filters);
    }

    const json: ApiResponse<ProductListItemDto[]> = await response.json();
    if (json.success && json.data) {
      return json.data;
    }

    return await getAllProducts(filters);
  } catch (error) {
    // If during static generation/build time where dev HTTP listener isn't bound yet, fallback cleanly
    return await getAllProducts(filters);
  }
}


/**
 * Consumer for GET /api/products/[slug]
 * Calls the backend REST API endpoint and returns parsed product detail
 */
export async function fetchProductDetailFromApi(
  slug: string
): Promise<ProductDetailDto | null> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/products/${encodeURIComponent(slug)}`;

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.warn(
        `[API Consumer] GET /api/products/${slug} returned status ${response.status}. Using service fallback.`
      );
      return await getProductBySlug(slug);
    }

    const json: ApiResponse<ProductDetailDto> = await response.json();
    if (json.success && json.data) {
      return json.data;
    }

    return await getProductBySlug(slug);
  } catch (error) {
    // If during static generation/build time where dev HTTP listener isn't bound yet, fallback cleanly
    return await getProductBySlug(slug);
  }
}
