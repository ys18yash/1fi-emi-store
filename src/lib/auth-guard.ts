import { NextRequest, NextResponse } from "next/server";

export const ADMIN_SECRET_KEY =
  process.env.ADMIN_SECRET_KEY ||
  (process.env.NODE_ENV !== "production" ? "1fi-admin-secret-2026" : "");

/**
 * Validates whether the incoming request contains valid administrative credentials.
 * Supports header 'x-admin-key', 'Authorization: Bearer <key>', or cookie '1fi_admin_key'.
 */
export function verifyAdminAccess(request: NextRequest): boolean {
  // 1. Check custom header x-admin-key
  const headerKey = request.headers.get("x-admin-key");
  if (headerKey && headerKey === ADMIN_SECRET_KEY) {
    return true;
  }

  // 2. Check Authorization Bearer
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token === ADMIN_SECRET_KEY) {
      return true;
    }
  }

  // 3. Check cookie
  const cookieKey = request.cookies.get("1fi_admin_key")?.value;
  if (cookieKey && cookieKey === ADMIN_SECRET_KEY) {
    return true;
  }

  return false;
}

/**
 * Helper to return a standardized 401 Unauthorized response
 */
export function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: "Unauthorized: Invalid or missing administrator access credentials",
    },
    { status: 401 }
  );
}
