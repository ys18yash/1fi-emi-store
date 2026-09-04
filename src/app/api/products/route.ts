import { NextRequest, NextResponse } from "next/server";
import { ProductQuerySchema } from "@/lib/validators";
import { getAllProducts, getCatalogFacets } from "@/lib/services/product-service";
import { ApiResponse, ProductListItemDto } from "@/types/product";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      category: searchParams.get("category") ?? undefined,
      brand: searchParams.get("brand") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      storage: searchParams.get("storage") ?? undefined,
      minPrice: searchParams.get("minPrice") ?? undefined,
      maxPrice: searchParams.get("maxPrice") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
    };

    const parsedQuery = ProductQuerySchema.safeParse(queryParams);
    if (!parsedQuery.success) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Invalid query parameters format: " + parsedQuery.error.issues.map(i => i.message).join(", "),
        },
        { status: 400 }
      );
    }

    const [products, facets] = await Promise.all([
      getAllProducts(parsedQuery.data),
      getCatalogFacets(),
    ]);

    return NextResponse.json<ApiResponse<ProductListItemDto[]>>({
      success: true,
      data: products,
      facets,
      totalCount: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: "Failed to retrieve products from database",
      },
      { status: 500 }
    );
  }
}

