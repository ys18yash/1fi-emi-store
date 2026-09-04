import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess, unauthorizedResponse } from "@/lib/auth-guard";
import { getAdminProducts, createAdminProduct } from "@/lib/services/admin-service";
import { AdminProductSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  if (!verifyAdminAccess(request)) {
    return unauthorizedResponse();
  }

  try {
    const products = await getAdminProducts();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Failed to fetch admin products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminAccess(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const validation = AdminProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const product = await createAdminProduct(validation.data);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to create product. Slug may already exist.",
      },
      { status: 400 }
    );
  }
}
