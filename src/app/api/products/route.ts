import { NextRequest, NextResponse } from "next/server";
import { ProductQuerySchema } from "@/lib/validators";
import { getAllProducts } from "@/lib/services/product-service";
import { ApiResponse, ProductListItemDto } from "@/types/product";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      category: searchParams.get("category") ?? undefined,
      brand: searchParams.get("brand") ?? undefined,
      search: searchParams.get("search") ?? undefined,
    };

    const parsedQuery = ProductQuerySchema.safeParse(queryParams);
    if (!parsedQuery.success) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Invalid query parameters format",
        },
        { status: 400 }
      );
    }

    const products = await getAllProducts(parsedQuery.data);

    return NextResponse.json<ApiResponse<ProductListItemDto[]>>({
      success: true,
      data: products,
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
