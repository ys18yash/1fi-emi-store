import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess, unauthorizedResponse } from "@/lib/auth-guard";
import {
  getAdminImages,
  createAdminImage,
  updateAdminImage,
  deleteAdminImage,
  reorderAdminImages,
} from "@/lib/services/admin-service";
import { AdminImageSchema, AdminImageReorderSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  if (!verifyAdminAccess(request)) {
    return unauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const variantId = searchParams.get("variantId") || undefined;
    const images = await getAdminImages(variantId);
    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error("Failed to fetch admin images:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch images" },
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

    // Check if it's a reorder batch request
    if (body.imageOrders && Array.isArray(body.imageOrders)) {
      const reorderValidation = AdminImageReorderSchema.safeParse(body);
      if (!reorderValidation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            details: reorderValidation.error.format(),
          },
          { status: 400 }
        );
      }
      await reorderAdminImages(reorderValidation.data.imageOrders);
      return NextResponse.json({
        success: true,
        message: "Images reordered successfully",
      });
    }

    // Otherwise standard single image create
    const validation = AdminImageSchema.safeParse(body);
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

    const image = await createAdminImage(validation.data);
    return NextResponse.json({ success: true, data: image }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to process image creation:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process image" },
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
        { success: false, error: "Image ID is required" },
        { status: 400 }
      );
    }

    const validation = AdminImageSchema.partial().safeParse(data);
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

    const updated = await updateAdminImage(id, validation.data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Failed to update image:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update image" },
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
        { success: false, error: "Image ID is required" },
        { status: 400 }
      );
    }

    await deleteAdminImage(id);
    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error: any) {
    console.error("Failed to delete image:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete image" },
      { status: 400 }
    );
  }
}
