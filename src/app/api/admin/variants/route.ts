import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess, unauthorizedResponse } from "@/lib/auth-guard";
import {
  getAdminVariants,
  createAdminVariant,
  updateAdminVariant,
  deleteAdminVariant,
} from "@/lib/services/admin-service";
import { AdminVariantSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  if (!verifyAdminAccess(request)) {
    return unauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") || undefined;
    const variants = await getAdminVariants(productId);
    return NextResponse.json({ success: true, data: variants });
  } catch (error) {
    console.error("Failed to fetch admin variants:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch variants" },
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
    const validation = AdminVariantSchema.safeParse(body);

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

    const variant = await createAdminVariant(validation.data);
    return NextResponse.json({ success: true, data: variant }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create variant:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create variant" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminAccess(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Variant ID is required" },
        { status: 400 }
      );
    }

    const validation = AdminVariantSchema.partial().safeParse(data);
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

    const updated = await updateAdminVariant(id, validation.data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Failed to update variant:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update variant" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminAccess(request)) {
    return unauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Variant ID is required" },
        { status: 400 }
      );
    }

    await deleteAdminVariant(id);
    return NextResponse.json({
      success: true,
      message: "Variant deleted successfully",
    });
  } catch (error: any) {
    console.error("Failed to delete variant:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete variant" },
      { status: 400 }
    );
  }
}
