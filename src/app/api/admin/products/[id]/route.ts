import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess, unauthorizedResponse } from "@/lib/auth-guard";
import {
  getAdminProductById,
  updateAdminProduct,
  deleteAdminProduct,
} from "@/lib/services/admin-service";
import { AdminProductSchema } from "@/lib/validators";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminAccess(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await context.params;
    const product = await getAdminProductById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminAccess(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const validation = AdminProductSchema.partial().safeParse(body);

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

    const updated = await updateAdminProduct(id, validation.data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update product" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminAccess(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await context.params;
    await deleteAdminProduct(id);
    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete product" },
      { status: 400 }
    );
  }
}
