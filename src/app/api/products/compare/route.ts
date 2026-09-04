import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/services/product-service";
import { ApiResponse, ProductDetailDto } from "@/types/product";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slugsParam = searchParams.get("slugs");

    if (!slugsParam || !slugsParam.trim()) {
      return NextResponse.json<ApiResponse<ProductDetailDto[]>>(
        {
          success: true,
          data: [],
        },
        { status: 200 }
      );
    }

    const slugs = slugsParam
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0)
      .slice(0, 3); // Max 3 items

    const products = await Promise.all(
      slugs.map((slug) => getProductBySlug(slug))
    );

    const validProducts = products.filter(
      (p): p is ProductDetailDto => p !== null
    );

    return NextResponse.json<ApiResponse<ProductDetailDto[]>>({
      success: true,
      data: validProducts,
    });
  } catch (error) {
    console.error("Error in product comparison API:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: "Internal server error while fetching comparison data",
      },
      { status: 500 }
    );
  }
}
