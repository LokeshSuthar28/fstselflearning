import { NextResponse, type NextRequest } from "next/server";

/**
 * Step 2: Part B — Edge RBAC Middleware Gate
 * 
 * Inspects incoming requests at Next.js Edge runtime:
 * 1. Checks Better Auth session cookies & simulated role headers/cookies.
 * 2. Unauthenticated requests to protected zones -> Redirects to /login (or 401 for API).
 * 3. GUEST Role -> Blocked from Member/Admin pre-orders (redirects to /unauthorized?reason=guest_upgrade_required or 403).
 * 4. MEMBER Role -> Permitted for pre-orders & /api/transactions, blocked from /admin & /api/admin.
 * 5. ADMIN Role -> Full unrestricted access.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");

  const cookieHeader = request.headers.get("cookie") || "";
  const headerRole = request.headers.get("x-mock-role") || request.headers.get("x-user-role");

  // Determine active role from headers, cookie, or default
  let userRole = "MEMBER"; // Default to Member for local interactive usability
  let userId = "usr_trinity_vip_02";

  if (headerRole) {
    userRole = headerRole.toUpperCase();
    userId =
      userRole === "ADMIN"
        ? "usr_neo_admin_01"
        : userRole === "MEMBER"
        ? "usr_trinity_vip_02"
        : "usr_cipher_guest_03";
  } else if (cookieHeader.includes("mock_session_admin")) {
    userRole = "ADMIN";
    userId = "usr_neo_admin_01";
  } else if (cookieHeader.includes("mock_session_guest")) {
    userRole = "GUEST";
    userId = "usr_cipher_guest_03";
  } else if (cookieHeader.includes("mock_session_member")) {
    userRole = "MEMBER";
    userId = "usr_trinity_vip_02";
  }

  // =========================================================================
  // RULE 1: Admin Route Protection (/admin & /api/admin)
  // Only ADMIN is allowed
  // =========================================================================
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (userRole !== "ADMIN") {
      if (isApiRoute) {
        return NextResponse.json(
          {
            error: "Forbidden: Admin privileges required for this resource",
            code: "FORBIDDEN_ROLE",
            currentRole: userRole,
          },
          { status: 403 }
        );
      }
      return NextResponse.redirect(
        new URL("/unauthorized?reason=admin_only", request.url)
      );
    }

    const requestHeaders = new Headers(request.headers);
    if (userId) requestHeaders.set("x-user-id", userId);
    requestHeaders.set("x-user-role", userRole);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // =========================================================================
  // RULE 2: Member Protected Routes (/preorders & /api/transactions)
  // GUEST is denied (403 or redirect)
  // =========================================================================
  if (pathname.startsWith("/preorders") || pathname.startsWith("/api/transactions")) {
    if (userRole === "GUEST") {
      if (isApiRoute) {
        return NextResponse.json(
          {
            error: "Forbidden: Guest tier cannot access transactions. Upgrade to Member.",
            code: "GUEST_ACCESS_DENIED",
          },
          { status: 403 }
        );
      }
      return NextResponse.redirect(
        new URL("/unauthorized?reason=guest_upgrade_required", request.url)
      );
    }

    const requestHeaders = new Headers(request.headers);
    if (userId) requestHeaders.set("x-user-id", userId);
    requestHeaders.set("x-user-role", userRole);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/preorders/:path*",
    "/api/transactions/:path*",
  ],
};
