import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Roles } from "./constants/roles";

const publicPaths = ["/", "/public", "/login"];
const privatePaths = ["/dashboard", "/booking", "/tutorProfile"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ======================= VERIFY SESSION =======================
    const token =
        request.cookies.get("__Secure-session_token") ||
        request.cookies.get("session_token");
    // ======================= CHECK PATHS & GIVE PERMISSIONS =======================

    const isPrivatePath = privatePaths.some(
        (path) => pathname === path || pathname.startsWith(path + "/"),
    );

    //* 1. Fast check — no token, trying to access private path → redirect immediately
    if (isPrivatePath && !token) {
        console.log("No token found. Redirecting...");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    //* 2. If token exists, fetch session for role-based routing
    let isAuthenticated = false;
    let isAdmin = false;
    let isTutor = false;

    if (token) {
        try {
            const sessionRes = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/get-session`,
                {
                    headers: {
                        cookie: request.headers.get("cookie") ?? "",
                    },
                },
            );

            const session = await sessionRes.json();

            if (session.user) {
                isAuthenticated = true;
                isAdmin = session.user.role === Roles.admin;
                isTutor = session.user.role === Roles.tutor;
            }
        } catch {
            // session fetch failed, treat as unauthenticated
        }
    }

    //* 3. Prevent authenticated users from visiting login/register
    if (
        isAuthenticated &&
        (pathname === "/login" || pathname === "/register")
    ) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    //* 4. Double check — session invalid even though token exists
    if (isPrivatePath && !isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    //* 5. Admin-only protection
    if (pathname.startsWith("/dashboard/admin") && !isAdmin) {
        if (isTutor) {
            return NextResponse.redirect(
                new URL("/dashboard/tutor", request.url),
            );
        }
        return NextResponse.redirect(new URL("/", request.url));
    }

    //* 5.1 Tutor-only protection
    if (pathname.startsWith("/dashboard/tutor") && !isTutor) {
        if (isAdmin) {
            return NextResponse.redirect(
                new URL("/dashboard/admin", request.url),
            );
        }
        return NextResponse.redirect(new URL("/", request.url));
    }

    //* 6. Redirect /dashboard root based on role
    if (pathname === "/dashboard") {
        if (isAdmin) {
            return NextResponse.redirect(
                new URL("/dashboard/admin", request.url),
            );
        }
        if (isTutor) {
            return NextResponse.redirect(
                new URL("/dashboard/tutor", request.url),
            );
        }
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
