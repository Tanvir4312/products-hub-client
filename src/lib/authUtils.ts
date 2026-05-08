

export type UserRole =
  | "ADMIN"
  | "MODERATOR"
  | "USER"
  | "SUPER_ADMIN";

export const authRoutes = [
  "/login",
  "/register",
];

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((router: string) => router === pathname);
};

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

export const commonProtectedRoutes: RouteConfig = {
  exact: ["/my-profile", "/change-password"],
  pattern: [],
};

export const moderatorProtectedRoute: RouteConfig = {
  pattern: [/^\/moderator\/dashboard/],
  exact: [],
};

export const userProtectedRoute: RouteConfig = {
  pattern: [/^\/user\/dashboard/],
  exact: [],
};

export const adminProtectedRoutes: RouteConfig = {
  pattern: [/^\/admin\/dashboard/], // Matches any path that starts with /admin/dashboard
  exact: [],
};

export const isRouteMatches = (pathname: string, routes: RouteConfig) => {
  if (routes.exact.includes(pathname)) {
    return true;
  }
  return routes.pattern.some((pattern: RegExp) => pattern.test(pathname));
};

export const getRouteOwner = (
  pathname: string,
):
  | "ADMIN"
  | "MODERATOR"
  | "USER"
  | "SUPER_ADMIN"
  | "COMMON"
  | null => {


  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }

  if (isRouteMatches(pathname, moderatorProtectedRoute)) {
    return "MODERATOR";
  }

  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }

  if (isRouteMatches(pathname, userProtectedRoute)) {
    return "USER";
  }

  return null; // public route
};

export const getDefaultDashboardRoute = (role: UserRole) => {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return "/admin/dashboard";
  }
  if (role === "MODERATOR") {
    return "/moderator/dashboard";
  }
  if (role === "USER") {
    return "/user/dashboard";
  }
  return "/";
};


export const isValidRedirectForRole = (redirectPath: string, role: UserRole) => {
  const unifySuperAdminAndAdminRole = role === "SUPER_ADMIN" ? "ADMIN" : role;

  role = unifySuperAdminAndAdminRole;

  const ownerPath = getRouteOwner(redirectPath);

  if (ownerPath === null || ownerPath === "COMMON") {
    return true;
  }

  if (ownerPath === role) {
    return true;
  }

  return false;
}
