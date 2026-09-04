import { prisma } from "@/lib/prisma";
import { ProductReviewsResponseDto, ReviewDto, ReviewSummaryDto } from "@/types/product";
import { CreateReviewInput } from "@/lib/validators";

/**
 * Retrieve reviews and calculated rating summary for a given product slug
 */
export async function getProductReviews(
  slug: string,
  filterRating?: number
): Promise<ProductReviewsResponseDto | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!product) return null;

  const whereClause: { productId: string; rating?: number } = {
    productId: product.id,
  };

  if (filterRating && filterRating >= 1 && filterRating <= 5) {
    whereClause.rating = filterRating;
  }

  const [reviews, allProductRatings] = await Promise.all([
    prisma.review.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.findMany({
      where: { productId: product.id },
      select: { rating: true },
    }),
  ]);

  // Aggregate ratings
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  allProductRatings.forEach((r) => {
    if (r.rating in distribution) {
      distribution[r.rating as keyof typeof distribution]++;
      sum += r.rating;
    }
  });

  const totalReviews = allProductRatings.length;
  const averageRating =
    totalReviews > 0 ? parseFloat((sum / totalReviews).toFixed(1)) : 0;

  const summary: ReviewSummaryDto = {
    averageRating,
    totalReviews,
    ratingDistribution: distribution,
  };

  const formattedReviews: ReviewDto[] = reviews.map((r) => ({
    id: r.id,
    productId: r.productId,
    variantName: r.variantName,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    reviewerName: r.reviewerName,
    verifiedBuyer: r.verifiedBuyer,
    createdAt: r.createdAt.toISOString(),
  }));

  return {
    reviews: formattedReviews,
    summary,
  };
}

/**
 * Submit a new review for a product
 */
export async function createProductReview(
  slug: string,
  input: CreateReviewInput
): Promise<ReviewDto | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!product) return null;

  const created = await prisma.review.create({
    data: {
      productId: product.id,
      variantName: input.variantName || null,
      rating: input.rating,
      title: input.title,
      comment: input.comment,
      reviewerName: input.reviewerName,
      verifiedBuyer: true,
    },
  });

  return {
    id: created.id,
    productId: created.productId,
    variantName: created.variantName,
    rating: created.rating,
    title: created.title,
    comment: created.comment,
    reviewerName: created.reviewerName,
    verifiedBuyer: created.verifiedBuyer,
    createdAt: created.createdAt.toISOString(),
  };
}
