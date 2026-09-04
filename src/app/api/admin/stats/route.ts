import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess, unauthorizedResponse } from "@/lib/auth-guard";
import { getAdminStats } from "@/lib/services/admin-service";

export async function GET(request: NextRequest) {
  if (!verifyAdminAccess(request)) {
    return unauthorizedResponse();
  }

  try {
    const stats = await getAdminStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin statistics" },
      { status: 500 }
    );
  }
}
