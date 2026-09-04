import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess, unauthorizedResponse } from "@/lib/auth-guard";
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "@/lib/services/admin-service";
import { AdminCategorySchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  if (!verifyAdminAccess(request)) {
    return unauthorizedResponse();
  }

  try {
    const categories = await getAdminCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Failed to fetch admin categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
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
    const validation = AdminCategorySchema.safeParse(body);

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

    const category = await createAdminCategory(validation.data);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create category:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create category" },
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
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    const validation = AdminCategorySchema.partial().safeParse(data);
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

    const updated = await updateAdminCategory(id, validation.data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Failed to update category:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update category" },
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
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    await deleteAdminCategory(id);
    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    console.error("Failed to delete category:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete category" },
      { status: 400 }
    );
  }
}
