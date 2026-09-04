import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess, unauthorizedResponse } from "@/lib/auth-guard";
import {
  getAdminEmiPlans,
  createAdminEmiPlan,
  updateAdminEmiPlan,
  deleteAdminEmiPlan,
} from "@/lib/services/admin-service";
import { AdminEmiPlanSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  if (!verifyAdminAccess(request)) {
    return unauthorizedResponse();
  }

  try {
    const plans = await getAdminEmiPlans();
    return NextResponse.json({ success: true, data: plans });
  } catch (error) {
    console.error("Failed to fetch admin EMI plans:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch EMI plans" },
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
    const validation = AdminEmiPlanSchema.safeParse(body);

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

    const plan = await createAdminEmiPlan(validation.data);
    return NextResponse.json({ success: true, data: plan }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create EMI plan:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create EMI plan" },
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
        { success: false, error: "EMI Plan ID is required" },
        { status: 400 }
      );
    }

    const validation = AdminEmiPlanSchema.partial().safeParse(data);
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

    const updated = await updateAdminEmiPlan(id, validation.data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Failed to update EMI plan:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update EMI plan" },
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
        { success: false, error: "EMI Plan ID is required" },
        { status: 400 }
      );
    }

    await deleteAdminEmiPlan(id);
    return NextResponse.json({
      success: true,
      message: "EMI plan deleted successfully",
    });
  } catch (error: any) {
    console.error("Failed to delete EMI plan:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete EMI plan" },
      { status: 400 }
    );
  }
}
