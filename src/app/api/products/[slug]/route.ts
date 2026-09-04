import { NextRequest, NextResponse } from "next/server";
import { ProductSlugParamSchema } from "@/lib/validators";
import { getProductBySlug } from "@/lib/services/product-service";
import { ApiResponse, ProductDetailDto } from "@/types/product";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const rawParams = await context.params;
    const validationResult = ProductSlugParamSchema.safeParse(rawParams);

    if (!validationResult.success) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Invalid product slug format",
        },
        { status: 400 }
      );
    }

    const { slug } = validationResult.data;
    const product = await getProductBySlug(slug);

    if (!product) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: `Product with slug '${slug}' not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<ProductDetailDto>>({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: "Internal server error while fetching product",
      },
      { status: 500 }
    );
  }
}
