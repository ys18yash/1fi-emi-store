import { NextRequest, NextResponse } from "next/server";
import {
  ProductSlugParamSchema,
  ReviewQuerySchema,
  CreateReviewSchema,
} from "@/lib/validators";
import {
  getProductReviews,
  createProductReview,
} from "@/lib/services/review-service";
import { ApiResponse, ProductReviewsResponseDto, ReviewDto } from "@/types/product";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const rawParams = await context.params;
    const slugValidation = ProductSlugParamSchema.safeParse(rawParams);

    if (!slugValidation.success) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Invalid product slug format",
        },
        { status: 400 }
      );
    }

    const { slug } = slugValidation.data;

    // Parse query params
    const { searchParams } = new URL(request.url);
    const queryValidation = ReviewQuerySchema.safeParse({
      rating: searchParams.get("rating") || undefined,
      limit: searchParams.get("limit") || undefined,
      offset: searchParams.get("offset") || undefined,
    });

    const filterRating = queryValidation.success
      ? queryValidation.data.rating
      : undefined;

    const reviewData = await getProductReviews(slug, filterRating);

    if (!reviewData) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: `Product with slug '${slug}' not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<ProductReviewsResponseDto>>({
      success: true,
      data: reviewData,
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: "Internal server error while fetching reviews",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const rawParams = await context.params;
    const slugValidation = ProductSlugParamSchema.safeParse(rawParams);

    if (!slugValidation.success) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Invalid product slug format",
        },
        { status: 400 }
      );
    }

    const { slug } = slugValidation.data;
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: "Invalid or missing JSON payload",
        },
        { status: 400 }
      );
    }

    const inputValidation = CreateReviewSchema.safeParse(body);

    if (!inputValidation.success) {
      const errorMsg = inputValidation.error.issues
        .map((i) => i.message)
        .join(", ");
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: errorMsg || "Validation failed for review submission",
        },
        { status: 400 }
      );
    }

    const createdReview = await createProductReview(slug, inputValidation.data);

    if (!createdReview) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: `Product with slug '${slug}' not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<ReviewDto>>(
      {
        success: true,
        data: createdReview,
        message: "Review submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product review:", error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: "Internal server error while submitting review",
      },
      { status: 500 }
    );
  }
}
