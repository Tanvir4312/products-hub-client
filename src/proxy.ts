import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "@/lib/authUtils";
import { NextRequest, NextResponse } from "next/server";
import { decodeJWTPayload, isTokenExpiringSoon, fetchUserInfo, refreshTokens } from "@/lib/middlewareHelper";

/**
 * Next.js 16+ Proxy (Replaces Middleware)
 */
export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const pathWithQuery = `${pathname}${request.nextUrl.search}`;

    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const sessionToken = request.cookies.get("better-auth.session_token")?.value;

    const decodedAccessToken = accessToken ? decodeJWTPayload(accessToken) : null;
    const isValidAccessToken = !!decodedAccessToken;

    let userRole: UserRole | null = null;
    if (decodedAccessToken) {
      userRole = decodedAccessToken.role as UserRole;
    }

    const routerOwner = getRouteOwner(pathname);
    const unifySuperAdminAndAdminRole = userRole === "SUPER_ADMIN" ? "ADMIN" : userRole;
    userRole = unifySuperAdminAndAdminRole as UserRole;

    const isAuth = isAuthRoute(pathname);

    // 1. Token Refresh Logic
    if (isValidAccessToken && refreshToken && isTokenExpiringSoon(accessToken!)) {
      try {
        const refreshedData = await refreshTokens(refreshToken);
        if (refreshedData) {
          const { accessToken: newAT, refreshToken: newRT, token: newST } = refreshedData;
          const response = NextResponse.next();

          const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none" as const,
            path: "/",
          };

          if (newAT) response.cookies.set("accessToken", newAT, cookieOptions);
          if (newRT) response.cookies.set("refreshToken", newRT, cookieOptions);
          if (newST) response.cookies.set("better-auth.session_token", newST, cookieOptions);

          response.headers.set("x-token-refreshed", "1");
          return response;
        }
      } catch (error) {
        console.error("Error refreshing token in proxy:", error);
      }
    }

    // 2. Auth Route Protection
    if (
      isAuth &&
      isValidAccessToken &&
      pathname !== "/change-password"
    ) {
      const redirectParam = request.nextUrl.searchParams.get("redirect");
      if (redirectParam && redirectParam.startsWith("/")) {
        return NextResponse.redirect(new URL(redirectParam, request.url));
      }
      return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
    }

    // 3. Public Route Access
    if (routerOwner === null) {
      return NextResponse.next();
    }

    // 4. Protected Route Access (Not logged in)
    if (!accessToken || !isValidAccessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathWithQuery);
      return NextResponse.redirect(loginUrl);
    }

    // 5. User-Specific Restrictions (Status, Verification, Password Change)
    if (accessToken) {
      const userInfo = await fetchUserInfo(accessToken, sessionToken);

      if (userInfo) {
        // Status Restriction (INACTIVE/SUSPENDED)
        if (userInfo.status === "INACTIVE" || userInfo.status === "SUSPENDED") {
          if (
            pathname !== "/my-profile" &&
            pathname !== "/change-password" &&
            !isAuth
          ) {
            return NextResponse.redirect(new URL("/my-profile", request.url));
          }
        }
      }
    }

    // 6. Common Protected Routes
    if (routerOwner === "COMMON") {
      return NextResponse.next();
    }

    // 7. Role-Based Route Protection
    if (routerOwner === "ADMIN" || routerOwner === "MODERATOR" || routerOwner === "USER") {
      if (routerOwner !== userRole) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
      }
    }

    return NextResponse.next();

  } catch (error) {
    console.error("Error in proxy:", error);
    return NextResponse.next();
  }
}

// Ensure it works if Next.js looks for a default export
export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
  ]
}
