export type UserRole = "ADMIN" | "TUTOR" | "STUDENT";

export const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
];

export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((router: string) => router === pathname);
};

export type RouteConfig = {
    exact: string[];
    pattern: RegExp[];
};

export const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/change-password", "/my-sessions"],
    pattern: [],
};

export const tutorProtectedRoutes: RouteConfig = {
    pattern: [/^\/dashboard\/tutor(?:\/|$)/], // Matches /dashboard/tutor and nested paths
    exact: [],
};

export const adminProtectedRoutes: RouteConfig = {
    pattern: [/^\/admin\/dashboard(?:\/|$)/], // Matches /admin/dashboard and nested paths
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
): "ADMIN" | "TUTOR" | "COMMON" | null => {
    if (isRouteMatches(pathname, tutorProtectedRoutes)) {
        return "TUTOR";
    }

    if (isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }

    // if (isRouteMatches(pathname, tutorProtectedRoutes)) {
    //     return "TUTOR";
    // }

    if (isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }

    return null; // public route
};

export const getDefaultDashboardRoute = (role: UserRole) => {
    if (role === "ADMIN") {
        return "/dashboard/admin";
    }
    if (role === "TUTOR") {
        return "/dashboard/tutor";
    }
    // if (role === "STUDENT") {
    //     return "/dashboard";
    // }

    return "/";
};

export const isValidRedirectForRole = (
    redirectPath: string,
    role: UserRole,
) => {
    const sanitizedRedirectPath = redirectPath.split("?")[0] || redirectPath;
    const routeOwner = getRouteOwner(sanitizedRedirectPath);

    if (routeOwner === null || routeOwner === "COMMON") {
        return true;
    }

    if (routeOwner === role) {
        return true;
    }

    return false;
};
